"use client";

import { useActionState } from "react";

import { Form } from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";

import { createCheckoutSession } from "../actions/create-checkout-session";

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
  const [actionState, action] = useActionState(
    createCheckoutSession.bind(null, { organizationId, priceId }),
    EMPTY_ACTION_STATE,
  );

  const isActivePrice = activePriceId === priceId;

  return (
    <Form action={action} actionState={actionState}>
      <Button
        type="submit"
        disabled={isActivePrice}
        className={cn("flex flex-col", { "h-16": !!activePriceId })}
      >
        {!activePriceId ? null : isActivePrice ? (
          <span>Current Plan</span>
        ) : (
          <span>Other Plan</span>
        )}
        <div>{children}</div>
      </Button>
    </Form>
  );
};

export { CheckoutSessionForm };
