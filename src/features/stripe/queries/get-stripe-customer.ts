import { prisma } from "@/lib/prisma";

import { checkIfStripeAllowed } from "./check-if-stripe-allowed";

export const getStripeCustomerByOrganization = async (
  organizationId: string | null | undefined,
) => {
  if (checkIfStripeAllowed()) {
    return null;
  }

  if (!organizationId) {
    return null;
  }

  return prisma.stripeCustomer.findUnique({ where: { organizationId } });
};
