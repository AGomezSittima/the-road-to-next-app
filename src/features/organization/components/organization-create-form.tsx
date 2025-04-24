"use client";

import { useActionState } from "react";

import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";

import { createOrganization } from "../actions/create-organization";

enum FormFields {
  Name = "name",
}

const OrganizationCreateForm = () => {
  const [actionState, formAction] = useActionState(
    createOrganization,
    EMPTY_ACTION_STATE,
  );

  return (
    <Form action={formAction} actionState={actionState}>
      <Input
        name={FormFields.Name}
        placeholder="Name"
        required
        defaultValue={actionState.payload?.get(FormFields.Name) as string}
      />
      <FieldError name={FormFields.Name} actionState={actionState} />

      <SubmitButton label="Create" />
    </Form>
  );
};

export { OrganizationCreateForm };
