"use server";

import { z } from "zod";

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";

import { getAuthOrRedirect } from "../queries/get-auth-or-redirect";
import * as authService from "../service";

const changePasswordSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Must have at least 6 characters" })
    .max(191, { message: "Too many characters (max 191 characters)" }),
});

export const changePassword = async (
  _actionState: ActionState,
  formData: FormData,
) => {
  const { user } = await getAuthOrRedirect();

  try {
    const { password } = changePasswordSchema.parse(
      Object.fromEntries(formData),
    );

    await authService.changePassword(password, user);
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  return toActionState("SUCCESS", "Check your email for the reset link");
};
