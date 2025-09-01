import React from "react";

import { Attachment } from "@prisma/client";

import { AttachmentItem } from "./attachment-item";

type AttachmentListProps = {
  attachments: Attachment[];
  renderButtons: (id: string) => React.ReactNode[];
};

const AttachmentList = ({
  attachments,
  renderButtons,
}: AttachmentListProps) => {
  return (
    <div>
      {attachments.map((attachment) => (
        <AttachmentItem
          key={attachment.id}
          attachment={attachment}
          buttons={renderButtons(attachment.id)}
        />
      ))}
    </div>
  );
};

export { AttachmentList };
