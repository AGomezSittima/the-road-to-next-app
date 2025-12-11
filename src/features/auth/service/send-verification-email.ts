import { generateRandomcode } from "@/utils/crypto";
import { User } from "@prisma/client";

import * as authDataAccess from "../data";
import { sendEmailVerification } from "../emails/send-email-verification";

export const sendVerificationEmail = async (user: User) => {
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

  return result;
};

const generateEmailVerificationCode = async (userId: string, email: string) => {
  await authDataAccess.clearEmailVerificationTokens(userId);

  const code = generateRandomcode();

  await authDataAccess.createEmailVerificationToken(userId, email, code);

  return code;
};
