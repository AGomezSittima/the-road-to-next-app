import Stripe from "stripe";

import { prisma } from "@/lib/prisma";

export const updateSubscription = async (subscription: Stripe.Subscription) => {
  const price = subscription.items.data[0].price;

  await prisma.stripeCustomer.update({
    where: { customerId: subscription.customer as string },
    data: {
      subscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      productId: price.product as string,
      priceId: price.id as string,
    },
  });
};
