"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { setSessionTokenCookie } from "@/features/auth/lib/cookies";
import { createSession } from "@/features/auth/lib/session";
import { generateRandomToken } from "@/utils/crypto";
import { ticketsPath } from "@/utils/paths";
import { ActionState, fromErrorToActionState } from "@/utils/to-action-state";

import * as authService from "../service";

const signUpSchema = z
  .object({
    username: z
      .string()
      .min(1, { message: "Is required" })
      .max(191, { message: "Too many characters (max 191 characters)" })
      .refine(
        (value) => !value.includes(" "),
        "Username cannot contain spaces",
      ),
    email: z
      .string()
      .min(1, { message: "Is required" })
      .max(191, { message: "Too many characters (max 191 characters)" })
      .email(),
    password: z
      .string()
      .min(6, { message: "Must have at least 6 characters" })
      .max(191, { message: "Too many characters (max 191 characters)" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Must have at least 6 characters" })
      .max(191, { message: "Too many characters (max 191 characters)" }),
    firstName: z
      .string()
      .min(1, { message: "Is required" })
      .max(191, { message: "Too many characters (max 191 characters)" }),
    lastName: z
      .string()
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

export const signUp = async (_actionState: ActionState, formData: FormData) => {
  try {
    const { username, email, password, firstName, lastName } =
      signUpSchema.parse(Object.fromEntries(formData));

    const user = await authService.signUp(password, {
      username,
      email,
      firstName,
      lastName,
    });

    const sessionToken = generateRandomToken();
    const session = await createSession(sessionToken, user.id);
    await setSessionTokenCookie(sessionToken, session.expiresAt);
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  redirect(ticketsPath());
};
