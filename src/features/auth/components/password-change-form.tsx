"use client";

import { useActionState } from "react";

import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";

import { changePassword } from "../actions/change-password";

enum FormFields {
  Password = "password",
}

const PasswordChangeForm = () => {
  const [actionState, formAction] = useActionState(
    changePassword,
    EMPTY_ACTION_STATE,
  );

  return (
    <Form action={formAction} actionState={actionState}>
      <Input
        type="passwordd"
        name={FormFields.Password}
        placeholder="Password"
        defaultValue={actionState.payload?.get(FormFields.Password) as string}
      />
      <FieldError name={FormFields.Password} actionState={actionState} />

      <SubmitButton label="Send Email" />
    </Form>
  );
};

export { PasswordChangeForm };
