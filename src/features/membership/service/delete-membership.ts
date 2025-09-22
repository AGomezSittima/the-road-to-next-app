import { prisma } from "@/lib/prisma";

import { getMemberships } from "../queries/get-memberships";

export const deleteMembership = async ({
  userId,
  membershipUserId,
  organizationId,
}: {
  userId: string;
  membershipUserId: string;
  organizationId: string;
}) => {
  const memberships = await getMemberships(organizationId);
  const isLastMember = (memberships ?? []).length === 1;

  // Check if it is the last member of the organization
  if (isLastMember) {
    throw new Error("You cannot delete the last membership of an organization");
  }

  // Check if the membership exists
  const targetMembership = (memberships ?? []).find(
    (membership) => membership.userId === membershipUserId,
  );

  if (!targetMembership) {
    throw new Error("Membership not found");
  }

  // Check if the user is trying to delete the last admin
  const adminMemberships = (memberships ?? []).filter(
    (membership) => membership.role === "ADMIN",
  );

  const removesAdmin = targetMembership.role === "ADMIN";
  const isLastAdmin = adminMemberships.length <= 1;

  if (removesAdmin && isLastAdmin) {
    throw new Error("You cannot remove the last admin of an organization");
  }

  // Check if the user is authorized
  const myMermbership = (memberships ?? []).find(
    (membership) => membership.userId === userId,
  );

  const isMyself = userId === membershipUserId;
  const isAdmin = myMermbership?.role === "ADMIN";

  if (!isAdmin && !isMyself) {
    throw new Error("You can only delete memberships as an admin");
  }

  // TODO: Extract to DAL
  await prisma.membership.delete({
    where: { membershipId: { userId: membershipUserId, organizationId } },
  });

  return { isMyself };
};
