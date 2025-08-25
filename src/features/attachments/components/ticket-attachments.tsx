import { CardCompact } from "@/components/card-compact";

import { TicketAttachmentCreateForm } from "./ticket-attachment-create-form";

type TicketAttachmentsProps = {
  ticketId: string;
  isOwner: boolean;
};

const TicketAttachments = ({ ticketId, isOwner }: TicketAttachmentsProps) => {
  return (
    <CardCompact
      title="Attachments"
      description="Attached images or PDFs"
      content={
        <>
          {/* TODO: list attachments */}

          {isOwner && <TicketAttachmentCreateForm ticketId={ticketId} />}
        </>
      }
    />
  );
};

export { TicketAttachments };
