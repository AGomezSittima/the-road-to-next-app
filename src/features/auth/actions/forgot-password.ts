"use server";

import { z } from "zod";

import { inngest } from "@/lib/inngest";
import { appConfig } from "@/utils/app-config";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";

import { getUserByEmail } from "../queries/get-user";
import { checkIfEmailIsAllowed } from "../utils/check-if-email-is-allowed";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Is required" })
    .max(191, { message: "Too many characters (max 191 characters)" })
    .email(),
});

export const forgotPassword = async (
  _actionState: ActionState,
  formData: FormData,
) => {
  try {
    checkIfEmailIsAllowed({ shouldThrow: true });

    const { email } = forgotPasswordSchema.parse(Object.fromEntries(formData));

    const user = await getUserByEmail(email);

    if (user) {
      await inngest.send({
        name: appConfig.events.names.passwordReset,
        data: { userId: user.id },
      });
    }
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  return toActionState("SUCCESS", "Check your email for the reset link");
};
