"use client";

import { useActionState } from "react";

import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { PasswordInputWithBar } from "@/components/form/password-input";
import { SubmitButton } from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";

import { resetPassword } from "../actions/reset-password";

enum FormFields {
  Password = "password",
  ConfirmPassword = "confirmPassword",
}

type PasswordResetFormProps = {
  tokenId: string;
};

const PasswordResetForm = ({ tokenId }: PasswordResetFormProps) => {
  const [actionState, formAction] = useActionState(
    resetPassword.bind(null, tokenId),
    EMPTY_ACTION_STATE,
  );

  return (
    <Form action={formAction} actionState={actionState}>
      <PasswordInputWithBar
        name={FormFields.Password}
        placeholder="Password"
        defaultValue={actionState.payload?.get(FormFields.Password) as string}
      />
      <FieldError name={FormFields.Password} actionState={actionState} />

      <Input
        type="password"
        name={FormFields.ConfirmPassword}
        placeholder="Confirm Password"
        defaultValue={
          actionState.payload?.get(FormFields.ConfirmPassword) as string
        }
      />
      <FieldError name={FormFields.ConfirmPassword} actionState={actionState} />

      <SubmitButton label="Reset Password" />
    </Form>
  );
};

export { PasswordResetForm };
