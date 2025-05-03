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
  await getAuthOrRedirect();

  const membership = await getMemberships(organizationId);
  const isLastMember = (membership ?? []).length === 1;

  if (isLastMember) {
    return toActionState(
      "ERROR",
      "You cannot delete the last membership of an organization",
    );
  }

  try {
    await prisma.membership.delete({
      where: { membershipId: { userId, organizationId } },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  return toActionState("SUCCESS", "Membership deleted");
};
