"use client";

import { useActionState } from "react";

import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ACCEPTED_FILE_TYPES } from "@/features/attachments/constants";
import { ActionState, EMPTY_ACTION_STATE } from "@/utils/to-action-state";

import { createComment } from "../actions/create-comment";
import { CommentWithMetadata } from "../types";

enum FormFields {
  Content = "content",
  Files = "files",
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
        className="resize-none"
      />
      <FieldError name={FormFields.Content} actionState={actionState} />

      <Input
        name={FormFields.Files}
        id={FormFields.Files}
        type="file"
        multiple
        accept={ACCEPTED_FILE_TYPES.join(",")}
      />
      <FieldError name={FormFields.Files} actionState={actionState} />

      <SubmitButton label="Comment" />
    </Form>
  );
};

export { CommentCreateForm };
