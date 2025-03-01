"use client";

import { useActionState, useId } from "react";

import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EMPTY_ACTION_STATE } from "@/lib/to-action-state";
import { Ticket } from "@prisma/client";

import { upsertTicket } from "../actions/upsert-ticket";

type TicketUpsertFormProps = {
  ticket?: Ticket;
};

enum FormFields {
  Title = "title",
  Content = "content",
}

const TicketUpsertForm = ({ ticket }: TicketUpsertFormProps) => {
  const [actionState, action, isPending] = useActionState(
    upsertTicket.bind(null, ticket?.id),
    EMPTY_ACTION_STATE,
  );

  const titleFieldId = useId();
  const contentFieldId = useId();

  return (
    <Form action={action} actionState={actionState}>
      <Label htmlFor={titleFieldId}>Title</Label>
      <Input
        type="text"
        id={titleFieldId}
        name={FormFields.Title}
        defaultValue={
          (actionState.payload?.get(FormFields.Title) as string) ??
          ticket?.title
        }
      />
      <FieldError actionState={actionState} name={FormFields.Title} />

      <Label htmlFor={contentFieldId}>Content</Label>
      <Textarea
        id={contentFieldId}
        name={FormFields.Content}
        defaultValue={
          (actionState.payload?.get(FormFields.Content) as string) ??
          ticket?.content
        }
      />
      <FieldError actionState={actionState} name={FormFields.Content} />

      <SubmitButton label={ticket ? "Edit" : "Create"} isPending={isPending} />
    </Form>
  );
};

export { TicketUpsertForm };
