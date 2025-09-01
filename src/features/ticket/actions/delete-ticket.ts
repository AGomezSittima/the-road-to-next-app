"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { setCookieByKey } from "@/actions/cookies";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";
import { getTicketPermissions } from "@/features/permissions/queries/get-ticket-permissions";
import { generateAttachmentS3Key } from "@/features/s3/utils/generate-s3-key";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";
import { ticketsPath } from "@/utils/paths";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";

export const deleteTicket = async (ticketId: string) => {
  const { user } = await getAuthOrRedirect();

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket || !isOwner(user, ticket))
      return toActionState("ERROR", "Not authorized");

    const permissions = await getTicketPermissions({
      organizationId: ticket.organizationId,
      userId: user.id,
    });

    if (!permissions.canDeleteTicket)
      return toActionState("ERROR", "Not authorized");

    const attachments = await prisma.attachment.findMany({
      where: { ticketId },
    });

    if (attachments && attachments.length) {
      await inngest.send({
        name: appConfig.events.names.s3ObjectsCleanup,
        data: {
          objects: {
            Objects: attachments.map((attachment) => ({
              Key: generateAttachmentS3Key({
                organizationId: ticket.organizationId,
                ticketId: attachment.ticketId,
                fileName: attachment.name,
                attachmentId: attachment.id,
              }),
            })),
          },
        },
      });
    }

    await prisma.ticket.delete({ where: { id: ticketId } });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketsPath());
  await setCookieByKey(appConfig.cookiesKeys.toast, "Ticket deleted");
  redirect(ticketsPath());
};
