import { redirect } from "next/navigation";
import { cache } from "react";

import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { signInPath } from "@/utils/paths";

import { getMembershipInOrganizationByUserId } from "./get-membership";

export const getAdminOrRedirect = cache(async (organizationId: string) => {
  const auth = await getAuthOrRedirect();

  const membership = await getMembershipInOrganizationByUserId({
    organizationId,
    userId: auth.user.id,
  });

  if (!membership) {
    redirect(signInPath());
  }

  if (membership.role !== "ADMIN") {
    redirect(signInPath());
  }

  return { ...auth, membership };
});
