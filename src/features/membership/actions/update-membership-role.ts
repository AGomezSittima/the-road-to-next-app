"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { membershipsPath } from "@/utils/paths";
import { toActionState } from "@/utils/to-action-state";
import { MembershipRole } from "@prisma/client";

import { getAdminOrRedirect } from "../queries/get-admin-or-redirect";
import { getMemberships } from "../queries/get-memberships";

export const updateMembershipRole = async ({
  userId,
  organizationId,
  membershipRole,
}: {
  userId: string;
  organizationId: string;
  membershipRole: MembershipRole;
}) => {
  await getAdminOrRedirect(organizationId);

  const memberships = await getMemberships(organizationId);

  // Check if membership exists
  const targetMembership = (memberships ?? []).find(
    (membership) => membership.userId === userId,
  );

  if (!targetMembership) {
    return toActionState("ERROR", "Membership not found");
  }

  // Check if user is deleting last admin
  const adminMemberships = (memberships ?? []).filter(
    (membership) => membership.role === "ADMIN",
  );

  const removesAdmin = targetMembership.role === "ADMIN";
  const isLastAdmin = adminMemberships.length <= 1;

  if (removesAdmin && isLastAdmin) {
    return toActionState(
      "ERROR",
      "You cannot delete the last admin of an organization",
    );
  }

  await prisma.membership.update({
    where: {
      membershipId: {
        userId,
        organizationId,
      },
    },
    data: {
      role: membershipRole,
    },
  });

  revalidatePath(membershipsPath(organizationId));

  return toActionState("SUCCESS", "The role has been updated");
};
