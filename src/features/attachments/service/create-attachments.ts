import { generateAttachmentS3Key } from "@/features/s3/utils/generate-s3-key";
import { s3 } from "@/lib/aws";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Attachment, AttachmentEntity } from "@prisma/client";

import { AttachmentSubject } from "../types";
import { getOrganizationIdByAttachmentSubject } from "../utils/attachment-helper";

type CreateAttachmentsArgs = {
  subject: AttachmentSubject;
  entity: AttachmentEntity;
  entityId: string;
  files: File[];
};

export const createAttachments = async ({
  subject,
  entity,
  entityId,
  files,
}: CreateAttachmentsArgs) => {
  const createdAttachments: Attachment[] = [];
  const uploadedFilesKeys: string[] = [];
  try {
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const attachment = await prisma.attachment.create({
        data: {
          name: file.name,
          ...(entity === "TICKET" ? { ticketId: entityId } : {}),
          ...(entity === "COMMENT" ? { commentId: entityId } : {}),
          entity,
        },
      });

      const organizationId = getOrganizationIdByAttachmentSubject(
        entity,
        subject,
      );

      const attachmentKey = generateAttachmentS3Key({
        organizationId,
        entity,
        entityId,
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

      createdAttachments.push(attachment);
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
        where: {
          id: { in: createdAttachments.map((attachment) => attachment.id) },
        },
      })
      .catch(() => null);

    throw error;
  }

  return createdAttachments;
};
