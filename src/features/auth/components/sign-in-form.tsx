"use client";

import { useActionState } from "react";

import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";

import { signIn } from "../actions/sign-in";

enum FormFields {
  Email = "email",
  Password = "password",
}

const SignInForm = () => {
  const [actionState, formAction] = useActionState(
    signIn,
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

      <Input
        name={FormFields.Password}
        placeholder="Password"
        type="password"
        defaultValue={actionState.payload?.get(FormFields.Password) as string}
      />
      <FieldError name={FormFields.Password} actionState={actionState} />

      <SubmitButton label="Sign In" />
    </Form>
  );
};

export { SignInForm };
