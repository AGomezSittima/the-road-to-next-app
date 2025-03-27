"use server";

import { z } from "zod";

import { inngest } from "@/lib/inngest";
import { appConfig } from "@/utils/app-config";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";

import { verifyPasswordHash } from "../lib/password";
import { getAuthOrRedirect } from "../queries/get-auth-or-redirect";

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

    await inngest.send({
      name: appConfig.events.names.passwordReset,
      data: { userId: user.id },
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  return toActionState("SUCCESS", "Check your email for the reset link");
};
