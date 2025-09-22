"use server";

import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";

import { getAuthOrRedirect } from "../queries/get-auth-or-redirect";
import * as authService from "../service";

export const resendVerificationEmail = async () => {
  const { user } = await getAuthOrRedirect({
    checkEmailVerified: false,
    checkOrganization: false,
    checkActiveOrgananization: false,
  });

  try {
    await authService.resendVerificationEmail(user);
  } catch (error) {
    return fromErrorToActionState(error);
  }

  return toActionState("SUCCESS", "Verification email has been sent");
};
