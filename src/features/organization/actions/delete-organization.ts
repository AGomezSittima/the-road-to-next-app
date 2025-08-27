"use server";

import { generateS3Key } from "@/features/attachments/utils/generate-s3-key";
import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";

import { getOrganizationsByUser } from "../queries/get-organization-by-user";

export const deleteOrganization = async (organizationId: string) => {
  await getAdminOrRedirect(organizationId);

  try {
    const userOrganizations = await getOrganizationsByUser();

    const canDelete = userOrganizations.some(
      (organization) => organizationId === organization.id,
    );

    if (!canDelete) {
      return toActionState("ERROR", "Not a member of this organization");
    }

    const ticketsIds = await prisma.ticket.findMany({
      where: { organizationId },
      select: { id: true },
    });

    const attachments = await prisma.attachment.findMany({
      where: { ticketId: { in: ticketsIds.map((t) => t.id) } },
      include: { ticket: true },
    });

    if (attachments && attachments.length) {
      const attachmentsKeys = {
        Objects: attachments.map((attachment) => ({
          Key: generateS3Key({
            organizationId: organizationId,
            ticketId: attachment.ticket.id,
            fileName: attachment.name,
            attachmentId: attachment.id,
          }),
        })),
      };

      await inngest.send({
        name: appConfig.events.names.organizationDeleted,
        data: { organizationId, attachmentsKeys },
      });
    }

    await prisma.organization.delete({
      where: { id: organizationId },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  return toActionState("SUCCESS", "Organization deleted");
};
