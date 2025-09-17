import { StripeSubscriptionStatus } from "@prisma/client";

export const isActiveSubscription = (
  subscriptionStatus: StripeSubscriptionStatus | null | undefined,
) => {
  return subscriptionStatus === "active" || subscriptionStatus === "trialing";
};
