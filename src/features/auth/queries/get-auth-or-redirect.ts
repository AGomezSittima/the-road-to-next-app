import { redirect } from "next/navigation";
import { cache } from "react";

import { getOrganizationsByUser } from "@/features/organization/queries/get-organizations-by-user";
import {
  emailVerificationPath,
  onboardingPath,
  selectActiveOrganizationPath,
  signInPath,
} from "@/utils/paths";

import { getAuth } from "./get-auth";

type GetAuthOrRedirectOptions = {
  checkEmailVerified?: boolean;
  checkOrganization?: boolean;
  checkActiveOrgananization?: boolean;
};

export const getAuthOrRedirect = cache(
  async (options?: GetAuthOrRedirectOptions) => {
    const {
      checkEmailVerified = true,
      checkOrganization = true,
      checkActiveOrgananization: checkActiveOrganization = true,
    } = options ?? {};

    const auth = await getAuth();

    if (!auth.user) {
      redirect(signInPath());
    }

    if (checkEmailVerified && !auth.user.emailVerified) {
      redirect(emailVerificationPath());
    }

    let activeOrganization;
    if (checkOrganization || checkActiveOrganization) {
      const organizations = await getOrganizationsByUser();

      if (checkOrganization && !organizations.length) {
        redirect(onboardingPath());
      }

      activeOrganization = organizations.find(
        (organization) => organization.membershipByUser.isActive,
      );

      const hasActiveOrganization = !!activeOrganization;
      if (checkActiveOrganization && !hasActiveOrganization) {
        redirect(selectActiveOrganizationPath());
      }
    }

    return { ...auth, activeOrganization };
  },
);
