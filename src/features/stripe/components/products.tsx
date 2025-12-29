import { LucideBadgeCheck, LucideCheck } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { stripe } from "@/lib/stripe";
import { cn } from "@/lib/utils";
import { toCurrencyFromCent } from "@/utils/currency";

import { checkIfStripeSubscriptionAllowed } from "../queries/check-if-stripe-allowed";
import { getStripeCustomerByOrganization } from "../queries/get-stripe-customer";
import { isActiveSubscription } from "../utils/is-active-subscription";
import { CheckoutSessionForm } from "./checkout-session-form";

type PricesProps = {
  organizationId: string | null | undefined;
  productId: string | undefined;
  activePriceId: string | null | undefined;
};

const Prices = async ({
  organizationId,
  productId,
  activePriceId,
}: PricesProps) => {
  const prices = await stripe.prices.list({ active: true, product: productId });
  const isStripeSubscriptionAllowed = checkIfStripeSubscriptionAllowed();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-x-2">
        {prices.data.map((price) => (
          <CheckoutSessionForm
            key={price.id}
            organizationId={organizationId}
            priceId={price.id}
            activePriceId={activePriceId}
          >
            <span className="text-lg font-bold">
              {toCurrencyFromCent(price.unit_amount || 0, price.currency)}
            </span>
            &nbsp;/&nbsp;<span>{price.recurring?.interval}</span>
          </CheckoutSessionForm>
        ))}
      </div>
      {!isStripeSubscriptionAllowed && (
        <p className="bg-red-500/30 p-2 text-sm text-red-600 text-center rounded-lg">
          Stripe is not configured.
        </p>
      )}
    </div>
  );
};

type ProductsProps = {
  organizationId: string | null | undefined;
};

const Products = async ({ organizationId }: ProductsProps) => {
  const stripeCustomer = await getStripeCustomerByOrganization(organizationId);

  const subscriptionStatus = stripeCustomer?.subscriptionStatus;
  const activeSubscription = isActiveSubscription(subscriptionStatus);
  const activeProductId = activeSubscription ? stripeCustomer?.productId : null;
  const activePriceId = activeSubscription ? stripeCustomer?.priceId : null;

  const products = await stripe.products.list({
    active: true,
  });

  return (
    <div className="flex flex-1 items-center justify-center gap-x-4">
      {products.data.map((product) => {
        const isActiveProduct = activeProductId === product.id;

        return (
          <Card
            key={product.id}
            className={cn(isActiveProduct && "border-primary")}
          >
            <CardHeader>
              <CardTitle className="flex justify-between">
                {product.name}
                {isActiveProduct ? <LucideBadgeCheck /> : null}
              </CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {product.marketing_features.map((feature) => (
                <div key={feature.name} className="flex items-center gap-x-2">
                  <LucideCheck />
                  &nbsp;{feature.name}
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Prices
                organizationId={organizationId}
                productId={product.id}
                activePriceId={activePriceId}
              />
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export { Products };
