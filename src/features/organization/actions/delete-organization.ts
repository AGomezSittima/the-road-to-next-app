"use server";

import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { prisma } from "@/lib/prisma";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";

import { getOrganizationsByUser } from "../queries/get-organization-by-user";

export const deleteOrganization = async (organizationId: string) => {
  await getAuthOrRedirect();

  try {
    const userOrganizations = await getOrganizationsByUser();

    const canDelete = userOrganizations.some(
      (organization) => organizationId === organization.id,
    );

    if (!canDelete) {
      return toActionState("ERROR", "Not a member of this organization");
    }

    await prisma.organization.delete({
      where: { id: organizationId },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  return toActionState("SUCCESS", "Organization deleted");
};
