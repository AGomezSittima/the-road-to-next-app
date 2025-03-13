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
  FirstName = "firstName",
  LastName = "lastName",
}

const SignUpForm = () => {
  const [actionState, formAction] = useActionState(signUp, EMPTY_ACTION_STATE);

  return (
    <Form action={formAction} actionState={actionState}>
      <Input
        name={FormFields.Username}
        placeholder="Username"
        required
        defaultValue={actionState.payload?.get(FormFields.Username) as string}
      />
      <FieldError name={FormFields.Username} actionState={actionState} />

      <div className="flex gap-x-2">
        <div className="w-1/2">
          <Input
            name={FormFields.FirstName}
            placeholder="First Name"
            required
            defaultValue={
              actionState.payload?.get(FormFields.FirstName) as string
            }
          />
          <FieldError name={FormFields.FirstName} actionState={actionState} />
        </div>

        <div className="w-1/2">
          <Input
            name={FormFields.LastName}
            placeholder="Last Name"
            defaultValue={
              actionState.payload?.get(FormFields.LastName) as string
            }
          />
          <FieldError name={FormFields.LastName} actionState={actionState} />
        </div>
      </div>

      <Input
        name={FormFields.Email}
        required
        placeholder="Email"
        defaultValue={actionState.payload?.get(FormFields.Email) as string}
      />
      <FieldError name={FormFields.Email} actionState={actionState} />

      <Input
        name={FormFields.Password}
        required
        placeholder="Password"
        type="password"
        defaultValue={actionState.payload?.get(FormFields.Password) as string}
      />
      <FieldError name={FormFields.Password} actionState={actionState} />

      <Input
        name={FormFields.ConfirmPassword}
        required
        placeholder="Confirm Password"
        type="password"
        defaultValue={
          actionState.payload?.get(FormFields.ConfirmPassword) as string
        }
      />
      <FieldError name={FormFields.ConfirmPassword} actionState={actionState} />

      <SubmitButton label="Sign Up" />
    </Form>
  );
};

export { SignUpForm };
