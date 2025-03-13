"use client";

import { useActionState, useId } from "react";

import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";
import { User } from "@prisma/client";

import { updateProfile } from "../actions/update-profile";

enum FormFields {
  Username = "username",
  FirstName = "firstName",
  LastName = "lastName",
}

type ProfileFormProps = {
  user: User;
};

const ProfileForm = ({ user }: ProfileFormProps) => {
  const [actionState, formAction] = useActionState(
    updateProfile,
    EMPTY_ACTION_STATE,
  );

  const usernameFieldId = useId();
  const firstNameFieldId = useId();
  const lastNameFieldId = useId();

  return (
    <Form action={formAction} actionState={actionState}>
      <Label htmlFor={usernameFieldId}>Username</Label>
      <Input
        id={usernameFieldId}
        name={FormFields.Username}
        placeholder={user?.username}
        defaultValue={actionState.payload?.get(FormFields.FirstName) as string}
      />
      <FieldError name={FormFields.FirstName} actionState={actionState} />

      <div className="flex gap-x-2">
        <div className="w-1/2">
          <Label htmlFor={firstNameFieldId}>First Name</Label>
          <Input
            id={firstNameFieldId}
            name={FormFields.FirstName}
            placeholder={user.firstName}
            defaultValue={
              actionState.payload?.get(FormFields.FirstName) as string
            }
          />
          <FieldError name={FormFields.FirstName} actionState={actionState} />
        </div>

        <div className="w-1/2">
          <Label htmlFor={lastNameFieldId}>Last Name</Label>
          <Input
            id={lastNameFieldId}
            name={FormFields.LastName}
            placeholder={user.lastName ?? ""}
            defaultValue={
              actionState.payload?.get(FormFields.LastName) as string
            }
          />
          <FieldError name={FormFields.LastName} actionState={actionState} />
        </div>
      </div>

      <SubmitButton label="Update" />
    </Form>
  );
};

export { ProfileForm };
