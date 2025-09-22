import { prisma } from "@/lib/prisma";
import { MembershipRole } from "@prisma/client";

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
  const memberships = await getMemberships(organizationId);

  // Check if membership exists
  const targetMembership = (memberships ?? []).find(
    (membership) => membership.userId === userId,
  );

  if (!targetMembership) {
    throw new Error("Membership not found");
  }

  // Check if user is deleting last admin
  const adminMemberships = (memberships ?? []).filter(
    (membership) => membership.role === "ADMIN",
  );

  const removesAdmin = targetMembership.role === "ADMIN";
  const isLastAdmin = adminMemberships.length <= 1;

  if (removesAdmin && isLastAdmin) {
    throw new Error("You cannot delete the last admin of an organization");
  }

  // TODO: Extract to DAL
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
};
