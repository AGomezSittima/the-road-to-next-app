import { s3 } from "@/lib/aws";
import { inngest } from "@/lib/inngest";
import { appConfig } from "@/utils/app-config";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

import { generateS3Key } from "../utils/generate-s3-key";

export type AttachmentDeletedEventArgs = {
  data: {
    organizationId: string;
    ticketId: string;
    fileName: string;
    attachmentId: string;
  };
};

export const attachmentDeletedEvent = inngest.createFunction(
  { id: "attachment-deleted" },
  {
    event: appConfig.events.names.attachmentDeleted,
  },
  async ({ event }) => {
    const { organizationId, ticketId, fileName, attachmentId } = event.data;

    try {
      const attachmentKey = generateS3Key({
        organizationId,
        ticketId,
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
