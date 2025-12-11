"use server";

import { differenceInSeconds } from "date-fns";

import { appConfig } from "@/utils/app-config";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";

import { getAuthOrRedirect } from "../queries/get-auth-or-redirect";
import { getEmailVerificationTokenByUserId } from "../queries/get-email-verification-token";
import * as authService from "../service";

export const resendVerificationEmail = async () => {
  const { user } = await getAuthOrRedirect({
    checkEmailVerified: false,
    checkOrganization: false,
    checkActiveOrgananization: false,
  });

  try {
    const canResend = await canResendVerificationEmail(user.id);

    if (!canResend) {
      throw new Error(
        `You can only resend the verification email once every ${appConfig.emailVerification.emailResendIntervalInSeconds} seconds`,
      );
    }

    await authService.sendVerificationEmail(user);
  } catch (error) {
    return fromErrorToActionState(error);
  }

  return toActionState("SUCCESS", "Verification email has been sent");
};

const canResendVerificationEmail = async (userId: string) => {
  const databaseCode = await getEmailVerificationTokenByUserId(userId);

  if (!databaseCode) {
    return true;
  }

  const diff = differenceInSeconds(
    new Date(),
    new Date(databaseCode.createdAt),
  );

  return diff > appConfig.emailVerification.emailResendIntervalInSeconds;
};
