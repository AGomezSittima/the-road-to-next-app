import { generateAttachmentKey } from "@/features/files/utils/generate-file-key";
import { s3 } from "@/lib/aws";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Attachment, AttachmentEntity } from "@prisma/client";

import * as attachmentDataAccess from "../data";
import { AttachmentSubjectDTO } from "../dto/attachment-subject-dto";
import { checkIfAttachmentsAreAllowed } from "../queries/check-if-attachments-allowed";
import { attachmentSubjectSchema } from "../schema/attachmentSubject";

type CreateAttachmentsArgs = {
  subject: AttachmentSubjectDTO;
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
  if (checkIfAttachmentsAreAllowed()) {
    return [];
  }

  const createdAttachments: Attachment[] = [];
  const uploadedFilesKeys: string[] = [];
  try {
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const referenceData = attachmentSubjectSchema.parse(
        entity === AttachmentEntity.TICKET
          ? { entity, ticketId: entityId }
          : { entity, commentId: entityId },
      );

      const attachment = await attachmentDataAccess.createAttachment({
        name: file.name,
        fileType: file.type,
        referenceData,
      });

      // TODO: Extract to abtraction FileUpload file
      const attachmentKey = generateAttachmentKey({
        organizationId: subject.organizationId,
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
    // TODO: Extract to abtraction FileUpload file
    await inngest
      .send({
        name: appConfig.events.names.filesCleanup,
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
