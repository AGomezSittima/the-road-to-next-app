"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { setCookieByKey } from "@/actions/cookies";
import { appConfig } from "@/utils/app-config";
import { generateRandomToken } from "@/utils/crypto";
import { ticketsPath } from "@/utils/paths";
import { ActionState, fromErrorToActionState } from "@/utils/to-action-state";

import { setSessionTokenCookie } from "../lib/cookies";
import { createSession } from "../lib/session";
import * as authService from "../service";

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

    const passwordResetToken = await authService.resetPassword(
      tokenId,
      password,
    );

    const sessionToken = generateRandomToken();
    const session = await createSession(
      sessionToken,
      passwordResetToken.userId,
    );

    await setSessionTokenCookie(sessionToken, session.expiresAt);
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  await setCookieByKey(
    appConfig.cookiesKeys.toast,
    "Your password has been reset and you're now signed in.",
  );

  redirect(ticketsPath());
};
