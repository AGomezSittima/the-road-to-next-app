"use server";

import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { prisma } from "@/lib/prisma";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";

import { getMemberships } from "../queries/get-memberships";

export const deleteMembership = async ({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}) => {
  const { user } = await getAuthOrRedirect();

  const memberships = await getMemberships(organizationId);
  const isLastMember = (memberships ?? []).length === 1;

  // Check if it is the last member of the organization
  if (isLastMember) {
    return toActionState(
      "ERROR",
      "You cannot delete the last membership of an organization",
    );
  }

  // Check if the membership exists
  const targetMembership = (memberships ?? []).find(
    (membership) => membership.userId === userId,
  );

  if (!targetMembership) {
    return toActionState("ERROR", "Membership not found");
  }

  // Check if the user is trying to delete the last admin
  const adminMemberships = (memberships ?? []).filter(
    (membership) => membership.role === "ADMIN",
  );

  const removesAdmin = targetMembership.role === "ADMIN";
  const isLastAdmin = adminMemberships.length <= 1;

  if (removesAdmin && isLastAdmin) {
    return toActionState(
      "ERROR",
      "You cannot remove the last admin of an organization",
    );
  }

  // Check if the user is authorized
  const myMermbership = (memberships ?? []).find(
    (membership) => membership.userId === user.id,
  );

  const isMyself = user.id === userId;
  const isAdmin = myMermbership?.role === "ADMIN";

  if (!isAdmin && !isMyself) {
    return toActionState(
      "ERROR",
      "You can only delete memberships as an admin",
    );
  }

  try {
    await prisma.membership.delete({
      where: { membershipId: { userId, organizationId } },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  const successMessage = isMyself
    ? "You have left the organization"
    : "Membership has been deleted";
  return toActionState("SUCCESS", successMessage);
};
