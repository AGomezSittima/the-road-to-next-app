"use client";

import { useActionState } from "react";

import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";

import { createAttachments } from "../actions/create-attachments";
import { ACCEPTED_FILE_TYPES } from "../constants";

type TicketAttachmentCreateFormProps = {
  ticketId: string;
};

enum FormFields {
  Files = "files",
}

const TicketAttachmentCreateForm = ({
  ticketId,
}: TicketAttachmentCreateFormProps) => {
  const [actionState, action] = useActionState(
    createAttachments.bind(null, ticketId),
    EMPTY_ACTION_STATE,
  );

  return (
    <Form action={action} actionState={actionState}>
      <Input
        name={FormFields.Files}
        id={FormFields.Files}
        type="file"
        multiple
        accept={ACCEPTED_FILE_TYPES.join(",")}
      />
      <FieldError actionState={actionState} name={FormFields.Files} />

      <SubmitButton label="Upload" />
    </Form>
  );

  return null;
};

export { TicketAttachmentCreateForm };
