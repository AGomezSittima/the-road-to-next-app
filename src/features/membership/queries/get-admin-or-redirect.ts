import { redirect } from "next/navigation";

import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { signInPath } from "@/utils/paths";

import { getMembership } from "./get-membership";

export const getAdminOrRedirect = async (organizationId: string) => {
  const auth = await getAuthOrRedirect();

  const membership = await getMembership({
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
};
