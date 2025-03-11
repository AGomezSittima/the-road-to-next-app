"use server";

import { redirect } from "next/navigation";

import { deleteSessionTokenCookie } from "@/lib/auth/cookies";
import { invalidateSession } from "@/lib/auth/session";
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
