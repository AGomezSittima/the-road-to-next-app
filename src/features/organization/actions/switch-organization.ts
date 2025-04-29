"use server";

import { revalidatePath } from "next/cache";

import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { prisma } from "@/lib/prisma";
import { organizationPath } from "@/utils/paths";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";

import { getOrganizationsByUser } from "../queries/get-organization-by-user";

export const switchOrganization = async (organizationId: string) => {
  const { user } = await getAuthOrRedirect();

  try {
    const userOrganizations = await getOrganizationsByUser();

    const canSwitch = userOrganizations.some(
      (organization) => organizationId === organization.id,
    );

    if (!canSwitch) {
      return toActionState("ERROR", "Not a member of this organization");
    }

    await prisma.membership.updateMany({
      where: {
        userId: user.id,
        organizationId: {
          not: organizationId,
        },
      },
      data: {
        isActive: false,
      },
    });

    await prisma.membership.update({
      where: {
        membershipId: {
          organizationId,
          userId: user.id,
        },
      },
      data: {
        isActive: true,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(organizationPath());

  return toActionState("SUCCESS", "Active organization has been switched");
};
