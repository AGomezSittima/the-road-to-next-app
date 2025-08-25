import { s3 } from "@/lib/aws";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

import { generateS3Key } from "../utils/generate-s3-key";

export type AttachmentDeletedEventArgs = {
  data: {
    attachmentId: string;
  };
};

export const attachmentDeletedEvent = inngest.createFunction(
  { id: "attachment-deleted" },
  {
    event: appConfig.events.names.attachmentDeleted,
  },
  async ({ event }) => {
    const { attachmentId } = event.data;

    try {
      const attachment = await prisma.attachment.findUniqueOrThrow({
        where: { id: attachmentId },
        include: { ticket: true },
      });

      const attachmentKey = generateS3Key({
        organizationId: attachment.ticket.organizationId,
        ticketId: attachment.ticket.id,
        fileName: attachment.name,
        attachmentId: attachment.id,
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
