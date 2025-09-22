import { prisma } from "@/lib/prisma";

import { PermissionKey } from "../../permissions/type";
import { getMembershipInOrganizationByUserId } from "../queries/get-membership";

export const togglePermission = async ({
  userId,
  organizationId,
  permissionKey,
}: {
  userId: string;
  organizationId: string;
  permissionKey: PermissionKey;
}) => {
  const membership = await getMembershipInOrganizationByUserId({
    organizationId,
    userId,
  });

  if (!membership) {
    throw new Error("Membership not found");
  }

  // TODO: Extract to DAL
  await prisma.membership.update({
    where: {
      membershipId: {
        organizationId,
        userId,
      },
    },
    data: {
      [permissionKey]: !membership[permissionKey],
    },
  });
};
