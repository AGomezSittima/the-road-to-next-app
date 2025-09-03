"use client";

import React, { useActionState } from "react";

import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";
import { AttachmentEntity } from "@prisma/client";

import { createAttachments } from "../actions/create-attachments";
import { ACCEPTED_FILE_TYPES } from "../constants";

type AttachmentCreateFormProps = {
  entity: AttachmentEntity;
  entityId: string;
  buttons?: React.ReactNode;
  onSuccess?: () => void;
};

enum FormFields {
  Files = "files",
}

const AttachmentCreateForm = ({
  entity,
  entityId,
  buttons,
  onSuccess,
}: AttachmentCreateFormProps) => {
  const [actionState, action] = useActionState(
    createAttachments.bind(null, { entity, entityId }),
    EMPTY_ACTION_STATE,
  );

  return (
    <Form action={action} actionState={actionState} onSuccess={onSuccess}>
      <Input
        name={FormFields.Files}
        id={FormFields.Files}
        type="file"
        multiple
        accept={ACCEPTED_FILE_TYPES.join(",")}
      />
      <FieldError actionState={actionState} name={FormFields.Files} />

      {buttons || <SubmitButton label="Upload" />}
    </Form>
  );

  return null;
};

export { AttachmentCreateForm };
