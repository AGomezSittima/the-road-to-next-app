"use client";

import { useActionState } from "react";

import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";

import { forgotPassword } from "../actions/forgot-password";

enum FormFields {
  Email = "email",
}

const ForgotPasswordForm = () => {
  const [actionState, formAction] = useActionState(
    forgotPassword,
    EMPTY_ACTION_STATE,
  );

  return (
    <Form action={formAction} actionState={actionState}>
      <Input
        name={FormFields.Email}
        placeholder="Email"
        defaultValue={actionState.payload?.get(FormFields.Email) as string}
      />
      <FieldError name={FormFields.Email} actionState={actionState} />

      <SubmitButton label="Send Email" />
    </Form>
  );
};

export { ForgotPasswordForm };
