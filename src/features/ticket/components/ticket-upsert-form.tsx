"use client";

import { useActionState, useId } from "react";

import { DatePicker } from "@/components/date-picker";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fromCent } from "@/utils/currency";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";
import { Ticket } from "@prisma/client";

import { upsertTicket } from "../actions/upsert-ticket";

type TicketUpsertFormProps = {
  ticket?: Ticket;
};

enum FormFields {
  Title = "title",
  Content = "content",
  Deadline = "deadline",
  Bounty = "bounty",
}

const TicketUpsertForm = ({ ticket }: TicketUpsertFormProps) => {
  const [actionState, action, isPending] = useActionState(
    upsertTicket.bind(null, ticket?.id),
    EMPTY_ACTION_STATE,
  );

  const titleFieldId = useId();
  const contentFieldId = useId();
  const deadlineFieldId = useId();
  const bountyFieldId = useId();

  return (
    <Form action={action} actionState={actionState}>
      <Label htmlFor={titleFieldId}>Title</Label>
      <Input
        id={titleFieldId}
        name={FormFields.Title}
        type="text"
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

      <div className="mb-1 flex gap-x-2">
        <div className="w-1/2">
          <Label htmlFor={deadlineFieldId}>Deadline</Label>
          {/* <Input
            id={deadlineFieldId}
            name={FormFields.Deadline}
            type="date"
            defaultValue={
              (actionState.payload?.get(FormFields.Deadline) as string) ??
              ticket?.deadline
            }
          /> */}
          <DatePicker
            id={deadlineFieldId}
            name={FormFields.Deadline}
            defaultValue={
              (actionState.payload?.get(FormFields.Deadline) as string) ??
              ticket?.deadline
            }
          />
          <FieldError actionState={actionState} name={FormFields.Deadline} />
        </div>

        <div className="w-1/2">
          <Label htmlFor={bountyFieldId}>Bounty ($)</Label>
          <Input
            id={bountyFieldId}
            name={FormFields.Bounty}
            type="number"
            step=".01"
            defaultValue={
              (actionState.payload?.get(FormFields.Bounty) as string) ??
              (ticket?.bounty ? fromCent(ticket.bounty) : "")
            }
          />
          <FieldError actionState={actionState} name={FormFields.Deadline} />
        </div>
      </div>

      <SubmitButton label={ticket ? "Edit" : "Create"} isPending={isPending} />
    </Form>
  );
};

export { TicketUpsertForm };
