"use server";

import { z } from "zod";

import { sendEmailPasswordReset } from "@/features/emails/send-email-password-reset";
import { prisma } from "@/lib/prisma";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";

import { generatePasswordResetLink } from "../utils/generate-password-reset-link";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Is required" })
    .max(191, { message: "Too many characters (max 191 characters)" })
    .email(),
});

const ERROR_INVALID_USER = "Incorrect email";

export const forgotPassword = async (
  _actionState: ActionState,
  formData: FormData,
) => {
  try {
    const { email } = forgotPasswordSchema.parse(Object.fromEntries(formData));

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return toActionState("ERROR", ERROR_INVALID_USER, formData);

    const passwordResetLink = await generatePasswordResetLink(user.id);

    await sendEmailPasswordReset(user.username, user.email, passwordResetLink);
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  return toActionState("SUCCESS", "Check your email for the reset link");
};
