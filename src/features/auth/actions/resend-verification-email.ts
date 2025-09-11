"use server";

import { appConfig } from "@/utils/app-config";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";

import { sendEmailVerification } from "../emails/send-email-verification";
import { getAuthOrRedirect } from "../queries/get-auth-or-redirect";
import { canResendVerificationEmail } from "../utils/can-resend-verification-email";
import { generateEmailVerificationCode } from "../utils/generate-email-verification-code";

export const resendVerificationEmail = async () => {
  const { user } = await getAuthOrRedirect({
    checkEmailVerified: false,
    checkOrganization: false,
    checkActiveOrgananization: false,
  });

  try {
    const canResend = await canResendVerificationEmail(user.id);

    if (!canResend) {
      return toActionState(
        "ERROR",
        `You can only resend the verification email once every ${appConfig.emailVerification.emailResendIntervalInSeconds} seconds`,
      );
    }

    const verificationCode = await generateEmailVerificationCode(
      user.id,
      user.email,
    );

    const result = await sendEmailVerification(
      user.username,
      user.email,
      verificationCode,
    );

    if (result.error) {
      return toActionState("ERROR", "Failed to send verification email");
    }
  } catch (error) {
    return fromErrorToActionState(error);
  }

  return toActionState("SUCCESS", "Verification email has been sent");
};
