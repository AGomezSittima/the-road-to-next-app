"use server";

import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import { generateAttachmentS3Key } from "@/features/s3/utils/generate-s3-key";
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
    });

    if (attachments && attachments.length) {
      await inngest.send({
        name: appConfig.events.names.s3ObjectsCleanup,
        data: {
          objects: {
            Objects: attachments.map((attachment) => ({
              Key: generateAttachmentS3Key({
                organizationId,
                ticketId: attachment.ticketId,
                fileName: attachment.name,
                attachmentId: attachment.id,
              }),
            })),
          },
        },
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
