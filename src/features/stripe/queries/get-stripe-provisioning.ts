import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

import { isActiveSubscription } from "../utils/is-active-subscription";
import { checkIfStripeSubscriptionAllowed } from "./check-if-stripe-allowed";

export type GetStripeProvisioningPayload = {
  allowedMembers: number;
  currentMembers: number;
};

const defaultValue: GetStripeProvisioningPayload = {
  allowedMembers: 0,
  currentMembers: 0,
};

export const getStripeProvisioningByOrganization = async (
  organizationId: string | null | undefined,
): Promise<GetStripeProvisioningPayload> => {
  if (checkIfStripeSubscriptionAllowed()) {
    return defaultValue;
  }

  if (!organizationId) {
    return defaultValue;
  }

  const [membershipCount, invitaionCount, stripeCustomer] =
    await prisma.$transaction([
      prisma.membership.count({ where: { organizationId } }),
      prisma.invitation.count({ where: { organizationId } }),
      prisma.stripeCustomer.findUnique({ where: { organizationId } }),
    ]);

  const currentMembers = membershipCount + invitaionCount;
  const isActive = isActiveSubscription(stripeCustomer?.subscriptionStatus);

  if (!isActive || !stripeCustomer?.productId) {
    return { allowedMembers: 1, currentMembers };
  }

  const product = await stripe.products.retrieve(stripeCustomer.productId);

  return {
    allowedMembers: Number(product.metadata.allowedMembers),
    currentMembers,
  };
};
