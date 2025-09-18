"use server";

import { revalidatePath } from "next/cache";

import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { prisma } from "@/lib/prisma";
import { organizationsPath } from "@/utils/paths";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";

import { getOrganizationsByUser } from "../queries/get-organizations-by-user";

export const switchOrganization = async (organizationId: string) => {
  const { user } = await getAuthOrRedirect({
    checkActiveOrgananization: false,
  });

  try {
    const userOrganizations = await getOrganizationsByUser();

    const canSwitch = userOrganizations.some(
      (organization) => organizationId === organization.id,
    );

    if (!canSwitch) {
      return toActionState("ERROR", "Not a member of this organization");
    }

    await prisma.$transaction([
      prisma.membership.updateMany({
        where: {
          userId: user.id,
          organizationId: {
            not: organizationId,
          },
        },
        data: {
          isActive: false,
        },
      }),
      prisma.membership.update({
        where: {
          membershipId: {
            organizationId,
            userId: user.id,
          },
        },
        data: {
          isActive: true,
        },
      }),
    ]);
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(organizationsPath());

  return toActionState("SUCCESS", "Active organization has been switched");
};
