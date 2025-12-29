import { redirect } from "next/navigation";

import { membershipsPath, organizationsPath } from "@/utils/paths";

export const checkIfStripeAllowed = ({
  shouldThrow,
}: { shouldThrow?: boolean } = {}) => {
  if (process.env.NEXT_PUBLIC_ALLOW_STRIPE !== "true") {
    if (shouldThrow) {
      throw new Error("Stripe integration is disabled");
    }

    return false;
  }

  return true;
};

export const checkIfStripeAllowedOrRedirect = (organizationId?: string) => {
  if (!checkIfStripeAllowed()) {
    redirect(
      organizationId ? membershipsPath(organizationId) : organizationsPath(),
    );
  }
};

export const checkIfStripeSubscriptionAllowed = ({
  shouldThrow,
}: { shouldThrow?: boolean } = {}) => {
  try {
    checkIfStripeAllowed({ shouldThrow: true });
  } catch (error) {
    if (shouldThrow) {
      throw error;
    }

    return false;
  }

  if (process.env.NEXT_PUBLIC_ALLOW_STRIPE_SUBSCRIPTION_MANAGEMENT !== "true") {
    if (shouldThrow) {
      throw new Error("Stripe subscription management is disabled");
    }

    return false;
  }

  return true;
};
