import { appConfig } from "@/utils/app-config";
import { User } from "@prisma/client";

import { sendEmailVerification } from "../emails/send-email-verification";
import { canResendVerificationEmail } from "../utils/can-resend-verification-email";
import { generateEmailVerificationCode } from "../utils/generate-email-verification-code";

export const resendVerificationEmail = async (user: User) => {
  const canResend = await canResendVerificationEmail(user.id);

  if (!canResend) {
    throw new Error(
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
    throw new Error("Failed to send verification email");
  }
};
