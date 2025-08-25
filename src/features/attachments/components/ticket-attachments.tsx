import { CardCompact } from "@/components/card-compact";

import { getAttachments } from "../queries/get-attachments";
import { AttachmentItem } from "./attachment-item";
import { TicketAttachmentCreateForm } from "./ticket-attachment-create-form";

type TicketAttachmentsProps = {
  ticketId: string;
  isOwner: boolean;
};

const TicketAttachments = async ({
  ticketId,
  isOwner,
}: TicketAttachmentsProps) => {
  const attachments = await getAttachments(ticketId);

  return (
    <CardCompact
      title="Attachments"
      description="Attached images or PDFs"
      content={
        <>
          <div className="mx-2 mb-4 flex flex-col gap-y-2">
            {attachments.map((attachment) => (
              <AttachmentItem key={attachment.id} attachment={attachment} />
            ))}
          </div>

          {isOwner && <TicketAttachmentCreateForm ticketId={ticketId} />}
        </>
      }
    />
  );
};

export { TicketAttachments };
