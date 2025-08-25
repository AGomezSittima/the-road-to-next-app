import React from "react";

import { Attachment } from "@prisma/client";

type AttachmentItemProps = {
  attachment: Attachment;
  buttons: React.ReactNode[];
};

const AttachmentItem = ({ attachment, buttons }: AttachmentItemProps) => {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm">{attachment.name}</p>
      {buttons}
    </div>
  );
};

export { AttachmentItem };
