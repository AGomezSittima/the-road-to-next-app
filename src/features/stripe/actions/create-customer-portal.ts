"use server";

import { redirect } from "next/navigation";

import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { signInPath, subscriptionPath } from "@/utils/paths";
import { toActionState } from "@/utils/to-action-state";
import { getBaseUrl } from "@/utils/url";

import { checkIfStripeAllowed } from "../queries/check-if-stripe-allowed";

export const createCustomerPortal = async (
  organizationId: string | null | undefined,
) => {
  if (checkIfStripeAllowed()) {
    return toActionState("ERROR", "Stripe is not allowed in this environment");
  }

  if (!organizationId) {
    redirect(signInPath());
  }

  await getAdminOrRedirect(organizationId);

  const stripeCustomer = await prisma.stripeCustomer.findUnique({
    where: { organizationId },
  });

  if (!stripeCustomer) {
    return toActionState("ERROR", "Stripe customer not found");
  }

  const productsWithPrices = [];
  const products = await stripe.products.list({ active: true });

  for (const product of products.data) {
    const prices = await stripe.prices.list({
      active: true,
      product: product.id,
    });

    productsWithPrices.push({
      product,
      prices: prices.data,
    });
  }

  const configuration = await stripe.billingPortal.configurations.create({
    business_profile: {
      privacy_policy_url: "https://example.com/privacy",
      terms_of_service_url: "https://example.com/terms",
    },
    features: {
      payment_method_update: {
        enabled: true,
      },
      customer_update: {
        enabled: true,
        allowed_updates: ["name", "email", "address", "tax_id"],
      },
      invoice_history: {
        enabled: true,
      },
      subscription_cancel: {
        enabled: true,
        mode: "at_period_end",
      },
      subscription_update: {
        enabled: true,
        default_allowed_updates: ["price"],
        proration_behavior: "create_prorations",
        products: productsWithPrices.map(({ product, prices }) => ({
          product: product.id,
          prices: prices.map((price) => price.id),
        })),
      },
    },
  });

  const session = await stripe.billingPortal.sessions.create({
    configuration: configuration.id,
    customer: stripeCustomer.customerId,
    return_url: `${getBaseUrl()}${subscriptionPath(organizationId)}`,
  });

  if (!session.url) {
    return toActionState("ERROR", "Session URL could not be created");
  }

  redirect(session.url);
};
