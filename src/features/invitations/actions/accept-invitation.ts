"use server";

import { redirect } from "next/navigation";

import { setCookieByKey } from "@/actions/cookies";
import { getAuth } from "@/features/auth/queries/get-auth";
import { appConfig } from "@/utils/app-config";
import { organizationsPath, signInPath } from "@/utils/paths";
import { fromErrorToActionState } from "@/utils/to-action-state";

import * as invitationService from "../services";

export const acceptInvitation = async (tokenId: string) => {
  const { user: signedInUser } = await getAuth();

  try {
    await invitationService.acceptInvitation(tokenId);

    await setCookieByKey(appConfig.cookiesKeys.toast, "Invitation accepted");
  } catch (error) {
    return fromErrorToActionState(error);
  }

  redirect(signedInUser ? organizationsPath() : signInPath());
};
