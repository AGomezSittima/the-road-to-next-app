import { s3 } from "@/lib/aws";
import { inngest } from "@/lib/inngest";
import { appConfig } from "@/utils/app-config";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { AttachmentEntity } from "@prisma/client";

import { generateAttachmentKey } from "../../files/utils/generate-file-key";

export type AttachmentDeletedEventArgs = {
  data: {
    organizationId: string;
    entity: AttachmentEntity;
    entityId: string;
    fileName: string;
    attachmentId: string;
  };
};

export const deleteAttachmentFromS3Function = inngest.createFunction(
  { id: "delete-attachment-from-s3" },
  {
    event: appConfig.events.names.attachmentDeleted,
  },
  async ({ event }) => {
    const { organizationId, entity, entityId, fileName, attachmentId } =
      event.data;

    try {
      const attachmentKey = generateAttachmentKey({
        organizationId,
        entity,
        entityId,
        fileName,
        attachmentId,
      });

      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: attachmentKey,
        }),
      );
    } catch (error) {
      console.log(error);
      return { event, body: false };
    }

    return { event, body: true };
  },
);
