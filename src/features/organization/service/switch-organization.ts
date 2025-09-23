import { prisma } from "@/lib/prisma";

import { getOrganizationsByUser } from "../queries/get-organizations-by-user";

export const switchOrganization = async (
  organizationId: string,
  userId: string,
) => {
  const userOrganizations = await getOrganizationsByUser();

  const canSwitch = userOrganizations.some(
    (organization) => organizationId === organization.id,
  );

  if (!canSwitch) {
    throw new Error("Not a member of this organization");
  }

  await prisma.$transaction([
    prisma.membership.updateMany({
      where: {
        userId,
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
          userId,
        },
      },
      data: {
        isActive: true,
      },
    }),
  ]);
};
