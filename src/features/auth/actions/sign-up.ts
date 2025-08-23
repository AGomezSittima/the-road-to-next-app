"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { setSessionTokenCookie } from "@/features/auth/lib/cookies";
import { hashPassword } from "@/features/auth/lib/password";
import { createSession } from "@/features/auth/lib/session";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";
import { generateRandomToken } from "@/utils/crypto";
import { ticketsPath } from "@/utils/paths";
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

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        firstName,
        lastName,
      },
    });

    const invitations = await prisma.invitation.findMany({
      where: { email: user.email, status: "ACCEPTED_WITHOUT_ACCOUNT" },
    });

    await prisma.$transaction([
      prisma.invitation.deleteMany({
        where: { email: user.email, status: "ACCEPTED_WITHOUT_ACCOUNT" },
      }),
      prisma.membership.createMany({
        data: invitations.map((invitation) => ({
          userId: user.id,
          organizationId: invitation.organizationId,
          role: "MEMBER",
          isActive: false,
        })),
      }),
    ]);

    await inngest.send({
      name: appConfig.events.names.signUp,
      data: { userId: user.id },
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
