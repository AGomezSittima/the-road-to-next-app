"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { membershipsPath } from "@/utils/paths";
import { toActionState } from "@/utils/to-action-state";

import { PermissionKey } from "../../permissions/type";
import { getAdminOrRedirect } from "../queries/get-admin-or-redirect";

export const togglePermission = async ({
  userId,
  organizationId,
  permissionKey,
}: {
  userId: string;
  organizationId: string;
  permissionKey: PermissionKey;
}) => {
  await getAdminOrRedirect(organizationId);

  const where = {
    membershipId: {
      userId,
      organizationId,
    },
  };

  const membership = await prisma.membership.findUnique({
    where,
  });

  if (!membership) {
    return toActionState("ERROR", "Membership not found");
  }

  await prisma.membership.update({
    where,
    data: {
      [permissionKey]: !membership[permissionKey],
    },
  });

  revalidatePath(membershipsPath(organizationId));

  return toActionState("SUCCESS", "Permission updated");
};
