import { getAttachments } from "@/features/attachments/queries/get-attachments";
import { generateAttachmentS3Key } from "@/features/s3/utils/generate-s3-key";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";

import { getTicket } from "../queries/get-ticket";

export const deleteTicket = async (userId: string, ticketId: string) => {
  const ticket = await getTicket(ticketId);

  if (!ticket || !ticket.isOwner) {
    throw new Error("Not authorized");
  }

  if (!ticket.permissions.canDeleteTicket) {
    throw new Error("Not authorized");
  }

  const attachments = await getAttachments("TICKET", ticketId);

  if (attachments && attachments.length) {
    await inngest.send({
      name: appConfig.events.names.s3ObjectsCleanup,
      data: {
        objects: {
          Objects: attachments.map((attachment) => ({
            Key: generateAttachmentS3Key({
              organizationId: ticket.organizationId,
              entity: attachment.entity,
              entityId: ticketId,
              fileName: attachment.name,
              attachmentId: attachment.id,
            }),
          })),
        },
      },
    });
  }

  // TODO: Extract to DAL
  await prisma.ticket.delete({ where: { id: ticketId } });
};
