"use server";

import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";

import * as invitationService from "../services";

type DeleteInvitationArgs = {
  email: string;
  organizationId: string;
};

export const deleteInvitation = async ({
  email,
  organizationId,
}: DeleteInvitationArgs) => {
  await getAdminOrRedirect(organizationId);

  try {
    await invitationService.deleteInvitation({ email, organizationId });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  return toActionState("SUCCESS", "Invitation revoked");
};
