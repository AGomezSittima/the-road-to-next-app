"use server";

import { revalidatePath } from "next/cache";

import { membershipsPath } from "@/utils/paths";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";

import { PermissionKey } from "../../permissions/type";
import { getAdminOrRedirect } from "../queries/get-admin-or-redirect";
import * as membershipService from "../service";

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

  try {
    await membershipService.togglePermission({
      userId,
      organizationId,
      permissionKey,
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(membershipsPath(organizationId));

  return toActionState("SUCCESS", "Permission updated");
};
