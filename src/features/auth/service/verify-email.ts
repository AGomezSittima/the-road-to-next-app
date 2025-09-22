import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

import { validateEmailVerificationCode } from "../utils/validate-email-verification-code";

// TODO: Extract prisma calls to DAL
export const verifyEmail = async (code: string, user: User) => {
  const validCode = await validateEmailVerificationCode(
    user.id,
    user.email,
    code,
  );

  if (!validCode) {
    throw new Error("Invalid or expired code");
  }

  await prisma.session.deleteMany({ where: { userId: user.id } });
  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true },
  });
};
