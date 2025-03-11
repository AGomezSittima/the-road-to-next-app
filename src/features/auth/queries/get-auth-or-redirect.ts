import { redirect } from "next/navigation";
import { cache } from "react";

import { signInPath } from "@/utils/paths";

import { getAuth } from "./get-auth";

export const getAuthOrRedirect = cache(async () => {
  const auth = await getAuth();

  if (!auth.user) {
    redirect(signInPath());
  }

  return auth;
});
