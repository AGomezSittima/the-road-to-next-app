"use server";

import { z } from "zod";

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";

import { verifyPasswordHash } from "../lib/password";
import { getAuthOrRedirect } from "../queries/get-auth-or-redirect";
import { generatePasswordResetLink } from "../utils/generate-password-reset-link";

const changePasswordSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Must have at least 6 characters" })
    .max(191, { message: "Too many characters (max 191 characters)" }),
});

const ERROR_INVALID_USER = "Incorrect password";

export const changePassword = async (
  _actionState: ActionState,
  formData: FormData,
) => {
  const { user } = await getAuthOrRedirect();

  try {
    const { password } = changePasswordSchema.parse(
      Object.fromEntries(formData),
    );

    const validPassword = await verifyPasswordHash(user.passwordHash, password);

    if (!validPassword) {
      return toActionState("ERROR", ERROR_INVALID_USER, formData);
    }

    const passwordResetLink = await generatePasswordResetLink(user.id);

    console.log(passwordResetLink);

    // TODO: Send email with reset password link
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  return toActionState("SUCCESS", "Check your email for the reset link");
};
