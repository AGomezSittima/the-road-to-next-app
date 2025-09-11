"use server";

import { z } from "zod";

import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";

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
    const { email } = forgotPasswordSchema.parse(Object.fromEntries(formData));

    const user = await prisma.user.findUnique({
      where: { email },
    });

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
