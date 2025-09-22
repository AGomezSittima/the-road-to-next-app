"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { setSessionTokenCookie } from "@/features/auth/lib/cookies";
import { verifyPasswordHash } from "@/features/auth/lib/password";
import { createSession } from "@/features/auth/lib/session";
import { generateRandomToken } from "@/utils/crypto";
import { ticketsPath } from "@/utils/paths";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";

import { getUserByEmail } from "../queries/get-user";

const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Is required" })
    .max(191, { message: "Too many characters (max 191 characters)" })
    .email(),
  password: z
    .string()
    .min(1, { message: "Is required" })
    .max(191, { message: "Too many characters (max 191 characters)" }),
});

const ERROR_INVALID_USER = "Incorrect email or password";

export const signIn = async (_actionState: ActionState, formData: FormData) => {
  try {
    const { email, password } = signInSchema.parse(
      Object.fromEntries(formData),
    );

    const user = await getUserByEmail(email);

    const validPassword = await verifyPasswordHash(
      user ? user.passwordHash : "invalid",
      password,
    );

    if (!user || !validPassword) {
      return toActionState("ERROR", ERROR_INVALID_USER, formData);
    }

    const sessionToken = generateRandomToken();
    const session = await createSession(sessionToken, user.id);

    await setSessionTokenCookie(sessionToken, session.expiresAt);
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  redirect(ticketsPath());
};
