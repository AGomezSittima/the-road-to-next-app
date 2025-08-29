"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";
import { s3 } from "@/lib/aws";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";
import { ticketPath } from "@/utils/paths";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";
import { PutObjectCommand } from "@aws-sdk/client-s3";

import { generateTicketAttachmentS3Key } from "../../s3/utils/generate-s3-key";
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE_IN_MB } from "../constants";
import { sizeInMB } from "../utils/size";

const createAttachmentsSchema = z.object({
  files: z
    .custom<FileList>()
    .transform((files) => Array.from(files))
    .transform((files) => files.filter((file) => file.size > 0))
    .refine(
      (files) =>
        files.every((file) => sizeInMB(file.size) <= MAX_FILE_SIZE_IN_MB),
      `The maximum file size is ${MAX_FILE_SIZE_IN_MB}MB`,
    )
    .refine((files) =>
      files.every(
        (file) => ACCEPTED_FILE_TYPES.includes(file.type),
        "File type is not supported",
      ),
    )
    .refine((files) => files.length !== 0, "File is required"),
});

export const createAttachments = async (
  ticketId: string,
  _actionState: ActionState,
  formData: FormData,
) => {
  const { user } = await getAuthOrRedirect();

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    return toActionState("ERROR", "Ticket not found");
  }

  if (!isOwner(user, ticket)) {
    return toActionState("ERROR", "Not authorized");
  }

  const createdAttachmentsIds: string[] = [];
  const uploadedFilesKeys: string[] = [];
  try {
    const { files } = createAttachmentsSchema.parse({
      files: formData.getAll("files"),
    });

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const attachment = await prisma.attachment.create({
        data: {
          name: file.name,
          ticketId,
        },
      });

      const attachmentKey = generateTicketAttachmentS3Key({
        organizationId: ticket.organizationId,
        ticketId,
        fileName: file.name,
        attachmentId: attachment.id,
      });

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: attachmentKey,
          Body: buffer,
          ContentType: file.type,
        }),
      );

      createdAttachmentsIds.push(attachment.id);
      uploadedFilesKeys.push(attachmentKey);
    }
  } catch (error) {
    // Rollback uploaded files from S3
    await inngest
      .send({
        name: appConfig.events.names.s3ObjectsCleanup,
        data: {
          objects: {
            Objects: uploadedFilesKeys.map((key) => ({
              Key: key,
            })),
          },
        },
      })
      .catch(() => null);

    // Rollback created attachment records from DB
    await prisma.attachment
      .deleteMany({
        where: { id: { in: createdAttachmentsIds } },
      })
      .catch(() => null);

    return fromErrorToActionState(error);
  }

  revalidatePath(ticketPath(ticketId));

  return toActionState("SUCCESS", "Attachment(s) uploaded");
};
