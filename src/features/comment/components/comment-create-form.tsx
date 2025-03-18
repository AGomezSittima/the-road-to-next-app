"use client";

import { useActionState } from "react";

import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { ActionState, EMPTY_ACTION_STATE } from "@/utils/to-action-state";

import { createComment } from "../actions/create-comment";
import { CommentWithMetadata } from "../types";

enum FormFields {
  Content = "content",
}

type CommentCreateFormProps = {
  ticketId: string;
  onCreateComment?: (comment: CommentWithMetadata | undefined) => void;
};

const CommentCreateForm = ({
  ticketId,
  onCreateComment,
}: CommentCreateFormProps) => {
  const [actionState, formAction] = useActionState(
    createComment.bind(null, ticketId),
    EMPTY_ACTION_STATE,
  );

  const handleSuccess = (
    actionState: ActionState<CommentWithMetadata | undefined>,
  ) => {
    onCreateComment?.(actionState.data);
  };

  return (
    <Form
      action={formAction}
      actionState={actionState}
      onSuccess={handleSuccess}
    >
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
