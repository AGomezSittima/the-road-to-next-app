import { LucideArrowUpRightFromSquare } from "lucide-react";
import Link from "next/link";
import React from "react";

import { attachmentDownloadUrl } from "@/utils/paths";
import { Attachment } from "@prisma/client";

import { AttachmentTypeIcon } from "./attachment-type-icon";

type AttachmentItemProps = {
  attachment: Attachment;
  buttons: React.ReactNode[];
};

const AttachmentItem = ({ attachment, buttons }: AttachmentItemProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-x-2">
        <Link
          className="flex items-center gap-x-2 truncate text-sm"
          href={attachmentDownloadUrl(attachment.id)}
        >
          <LucideArrowUpRightFromSquare className="size-4" />
          <p>{attachment.name}</p>
        </Link>

        <p className="text-muted-foreground">
          (&nbsp;
          <AttachmentTypeIcon attachmentType={attachment.type} />
          &nbsp;)
        </p>
      </div>
      {buttons}
    </div>
  );
};

export { AttachmentItem };
