"use server";

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

    await inngest.send({
      name: appConfig.events.names.organizationDeleted,
      data: { organizationId },
    });

    await prisma.organization.delete({
      where: { id: organizationId },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  return toActionState("SUCCESS", "Organization deleted");
};
