"use client";

import { useActionState } from "react";

import { Form } from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";

import { createCheckoutSession } from "../actions/create-checkout-session";

type CheckoutSessionFormProps = {
  organizationId: string | null | undefined;
  priceId: string;
  children: React.ReactNode;
};

// TODO: Inform user that the session with Stripe is being created when the form is submitted
const CheckoutSessionForm = ({
  organizationId,
  priceId,
  children,
}: CheckoutSessionFormProps) => {
  const [actionState, action] = useActionState(
    createCheckoutSession.bind(null, { organizationId, priceId }),
    EMPTY_ACTION_STATE,
  );

  return (
    <Form action={action} actionState={actionState}>
      <Button type="submit">{children}</Button>
    </Form>
  );
};

export { CheckoutSessionForm };
