"use server";

import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";

import * as membershipService from "../service";

export const deleteMembership = async ({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}) => {
  const { user } = await getAuthOrRedirect();

  let isMyself;
  try {
    const result = await membershipService.deleteMembership({
      userId: user.id,
      membershipUserId: userId,
      organizationId,
    });

    isMyself = result.isMyself;
  } catch (error) {
    return fromErrorToActionState(error);
  }

  const successMessage = isMyself
    ? "You have left the organization"
    : "Membership has been deleted";
  return toActionState("SUCCESS", successMessage);
};
