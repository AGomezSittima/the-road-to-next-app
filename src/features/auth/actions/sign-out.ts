"use server";

import { redirect } from "next/navigation";

import { deleteSessionTokenCookie } from "@/features/auth/lib/cookies";
import { invalidateSession } from "@/features/auth/lib/session";
import { signInPath } from "@/utils/paths";

import { getAuth } from "../queries/get-auth";

export const signOut = async () => {
  const { session } = await getAuth();

  if (!session) {
    redirect(signInPath());
  }

  await invalidateSession(session.id);
  await deleteSessionTokenCookie();

  redirect(signInPath());
};
