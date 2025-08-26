import { NonRetriableError } from "inngest";

import { generateS3Key } from "@/features/attachments/utils/generate-s3-key";
import { s3 } from "@/lib/aws";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";

export type OrganizationDeletedEventArgs = {
  data: {
    organizationId: string;
  };
};

export const organizationDeletedCleanupEvent = inngest.createFunction(
  { id: "organization-deleted-cleanup", retries: 5 },
  {
    event: appConfig.events.names.organizationDeleted,
  },
  async ({ event, step }) => {
    const { organizationId } = event.data;

    const tickets = await step.run(
      "get-tickets",
      async () =>
        await prisma.ticket.findMany({
          where: { organizationId },
          select: { id: true },
        }),
    );

    if (!tickets || !tickets.length) {
      throw new NonRetriableError("No tickets have been found");
    }

    const attachmentsKeys = await step.run("get-attachments-keys", async () => {
      const attachments = await prisma.attachment.findMany({
        where: { ticketId: { in: tickets.map((t) => t.id) } },
        include: { ticket: true },
      });

      if (!attachments || !attachments.length) {
        throw new NonRetriableError("No attachments have been found");
      }

      return {
        Objects: attachments.map((attachment) => ({
          Key: generateS3Key({
            organizationId: organizationId,
            ticketId: attachment.ticket.id,
            fileName: attachment.name,
            attachmentId: attachment.id,
          }),
        })),
      };
    });

    await step.run(
      "delete-attachments-s3",
      async () =>
        await s3.send(
          new DeleteObjectsCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Delete: attachmentsKeys,
          }),
        ),
    );

    return { event, body: true };
  },
);
