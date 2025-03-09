"use client";

import { useActionState } from "react";

import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";

import { signUp } from "../actions/sign-up";

enum FormFields {
  Username = "username",
  Email = "email",
  Password = "password",
  ConfirmPassword = "confirmPassword",
}

const SignUpForm = () => {
  const [actionState, formAction] = useActionState(
    signUp,
    EMPTY_ACTION_STATE,
  );

  return (
    <Form action={formAction} actionState={actionState}>
      <Input
        name={FormFields.Username}
        placeholder="Username"
        defaultValue={actionState.payload?.get(FormFields.Username) as string}
      />
      <FieldError name={FormFields.Username} actionState={actionState} />

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

      <Input
        name={FormFields.ConfirmPassword}
        placeholder="Confirm Password"
        type="password"
        defaultValue={actionState.payload?.get(FormFields.ConfirmPassword) as string}
      />
      <FieldError name={FormFields.ConfirmPassword} actionState={actionState} />

      <SubmitButton label="Sign Up" />
    </Form>
  );
};

export { SignUpForm };
