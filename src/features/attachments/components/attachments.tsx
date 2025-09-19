import { CardCompact } from "@/components/card-compact";
import { AttachmentEntity } from "@prisma/client";

import { ACCEPTED_FILE_TYPES } from "../constants";
import { getAttachments } from "../queries/get-attachments";
import { AttachmentCreateForm } from "./attachment-create-form";
import { AttachmentDeleteButton } from "./attachment-delete-button";
import { AttachmentList } from "./attachment-list";

type TicketAttachmentsProps = {
  entity: AttachmentEntity;
  entityId: string;
  isOwner: boolean;
};

const Attachments = async ({
  entity,
  entityId,
  isOwner,
}: TicketAttachmentsProps) => {
  const attachments = await getAttachments(entity, entityId);
  const acceptedFileTypesText = ACCEPTED_FILE_TYPES.map(
    (fileType) => fileType.split("/")[1],
  ).join(", ");

  return (
    <CardCompact
      title="Attachments"
      description={`Attached images or PDFs (Accepted file formats: ${acceptedFileTypesText})`}
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

          {isOwner && (
            <AttachmentCreateForm entity={entity} entityId={entityId} />
          )}
        </>
      }
    />
  );
};

export { Attachments };
