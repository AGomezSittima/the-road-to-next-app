"use client";

import { useActionState } from "react";

import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";

import { createComment } from "../actions/create-comment";

enum FormFields {
  Content = "content",
}

type CommentCreateFormProps = {
  ticketId: string;
};

const CommentCreateForm = ({ ticketId }: CommentCreateFormProps) => {
  const [actionState, formAction] = useActionState(
    createComment.bind(null, ticketId),
    EMPTY_ACTION_STATE,
  );

  return (
    <Form action={formAction} actionState={actionState}>
      <Textarea
        name={FormFields.Content}
        placeholder="What's on your mind ..."
      />
      <FieldError name={FormFields.Content} actionState={actionState} />

      <SubmitButton label="Comment" />
    </Form>
  );
};

export { CommentCreateForm };
