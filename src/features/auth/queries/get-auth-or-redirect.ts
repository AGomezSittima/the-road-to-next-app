import { redirect } from "next/navigation";
import { cache } from "react";

import { getOrganizationsByUser } from "@/features/organization/queries/get-organization-by-user";
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
      checkActiveOrgananization = true,
    } = options ?? {};

    const auth = await getAuth();

    if (!auth.user) {
      redirect(signInPath());
    }

    if (checkEmailVerified && !auth.user.emailVerified) {
      redirect(emailVerificationPath());
    }

    if (checkOrganization || checkActiveOrgananization) {
      const organizations = await getOrganizationsByUser();

      if (checkOrganization && !organizations.length) {
        redirect(onboardingPath());
      }

      if (checkActiveOrgananization) {
        const hasActive = organizations.some(
          (organization) => organization.membershipByUser.isActive,
        );

        if (!hasActive) {
          redirect(selectActiveOrganizationPath());
        }
      }
    }

    return auth;
  },
);
