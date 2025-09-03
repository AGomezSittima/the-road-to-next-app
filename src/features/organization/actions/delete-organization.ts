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

    const attachments = await prisma.attachment.findMany({
      where: {
        OR: [
          { ticket: { organizationId } },
          { comment: { ticket: { organizationId } } },
        ],
      },
      include: { ticket: true, comment: { include: { ticket: true } } },
    });

    if (attachments && attachments.length) {
      await inngest.send({
        name: appConfig.events.names.s3ObjectsCleanup,
        data: {
          objects: {
            Objects: attachments.map((attachment) => {
              const subject = attachment.ticket ?? attachment.comment;

              return {
                Key: generateAttachmentS3Key({
                  organizationId,
                  entity: attachment.entity,
                  entityId: subject?.id ?? "",
                  fileName: attachment.name,
                  attachmentId: attachment.id,
                }),
              };
            }),
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
