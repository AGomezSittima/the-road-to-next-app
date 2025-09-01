import { CardCompact } from "@/components/card-compact";

import { getAttachments } from "../queries/get-attachments";
import { AttachmentDeleteButton } from "./attachment-delete-button";
import { AttachmentList } from "./attachment-list";
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
            <AttachmentList
              attachments={attachments}
              renderButtons={(attachmentId: string) => [
                ...(isOwner
                  ? [<AttachmentDeleteButton key="0" id={attachmentId} />]
                  : []),
              ]}
            />
          </div>

          {isOwner && <TicketAttachmentCreateForm ticketId={ticketId} />}
        </>
      }
    />
  );
};

export { TicketAttachments };
