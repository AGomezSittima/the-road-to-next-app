"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { setSessionTokenCookie } from "@/lib/auth/cookies";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { generateRandomToken } from "@/utils/crypto";
import { ticketsPath } from "@/utils/path";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";
import { Prisma } from "@prisma/client";

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
    const { username, email, password } = signUpSchema.parse(
      Object.fromEntries(formData),
    );

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
      },
    });

    const sessionToken = generateRandomToken();
    const session = await createSession(sessionToken, user.id);

    await setSessionTokenCookie(sessionToken, session.expiresAt);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return toActionState(
        "ERROR",
        "Either email or username is already in use",
        formData,
      );
    }

    return fromErrorToActionState(error, formData);
  }

  redirect(ticketsPath());
};
