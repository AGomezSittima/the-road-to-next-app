"use server";

import { revalidatePath } from "next/cache";

import { membershipsPath } from "@/utils/paths";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";
import { MembershipRole } from "@prisma/client";

import { getAdminOrRedirect } from "../queries/get-admin-or-redirect";
import * as membershipService from "../service";

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

  try {
    await membershipService.updateMembershipRole({
      userId,
      organizationId,
      membershipRole,
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(membershipsPath(organizationId));

  return toActionState("SUCCESS", "The role has been updated");
};
