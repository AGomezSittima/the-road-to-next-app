"use client";

import { useActionState } from "react";

import { Form } from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";

import { createCheckoutSession } from "../actions/create-checkout-session";
import { createCustomerPortal } from "../actions/create-customer-portal";
import { checkIfStripeSubscriptionAllowed } from "../queries/check-if-stripe-allowed";

type CheckoutSessionFormProps = {
  organizationId: string | null | undefined;
  priceId: string;
  activePriceId: string | null | undefined;
  children: React.ReactNode;
};

// TODO: Inform user that the session with Stripe is being created when the form is submitted
const CheckoutSessionForm = ({
  organizationId,
  priceId,
  activePriceId,
  children,
}: CheckoutSessionFormProps) => {
  const actionFunction = !activePriceId
    ? createCheckoutSession.bind(null, { organizationId, priceId })
    : createCustomerPortal.bind(null, organizationId);

  const [actionState, action] = useActionState(
    actionFunction,
    EMPTY_ACTION_STATE,
  );

  const isStripeSubscriptionAllowed = checkIfStripeSubscriptionAllowed();

  const isActivePrice = activePriceId === priceId;

  return (
    <Form action={action} actionState={actionState}>
      <Button
        type="submit"
        disabled={!isStripeSubscriptionAllowed || isActivePrice}
        className={cn("flex flex-col", { "h-16": !!activePriceId })}
      >
        {!activePriceId ? null : isActivePrice ? (
          <span>Current Plan</span>
        ) : (
          <span>Change Plan</span>
        )}
        <div>{children}</div>
      </Button>
    </Form>
  );
};

export { CheckoutSessionForm };
