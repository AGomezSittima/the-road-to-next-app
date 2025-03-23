"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { setCookieByKey } from "@/actions/cookies";
import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";
import { hashToken } from "@/utils/crypto";
import { signInPath } from "@/utils/paths";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";

import { hashPassword } from "../lib/password";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Must have at least 6 characters" })
      .max(191, { message: "Too many characters (max 191 characters)" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Must have at least 6 characters" })
      .max(191, { message: "Too many characters (max 191 characters)" }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export const resetPassword = async (
  tokenId: string,
  _actionState: ActionState,
  formData: FormData,
) => {
  try {
    const { password } = resetPasswordSchema.parse(
      Object.fromEntries(formData),
    );

    const tokenHash = await hashToken(tokenId);

    const passwordResetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (passwordResetToken) {
      await prisma.passwordResetToken.delete({
        where: { tokenHash },
      });
    }

    if (
      !passwordResetToken ||
      Date.now() > passwordResetToken.expiresAt.getTime()
    ) {
      return toActionState(
        "ERROR",
        "Expired or invalid verification token",
        formData,
      );
    }

    await prisma.session.deleteMany({
      where: { userId: passwordResetToken.userId },
    });

    const passwordHash = await hashPassword(password);

    await prisma.user.update({
      where: { id: passwordResetToken.userId },
      data: { passwordHash },
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  await setCookieByKey(
    appConfig.cookiesKeys.toast,
    "Successfully reset password",
  );
  redirect(signInPath());
};
