import { LucideArrowUpRightFromSquare } from "lucide-react";
import Link from "next/link";
import React from "react";

import { attachmentDownlaodUrl as attachmentDownloadUrl } from "@/utils/paths";
import { Attachment } from "@prisma/client";

type AttachmentItemProps = {
  attachment: Attachment;
  buttons: React.ReactNode[];
};

const AttachmentItem = ({ attachment, buttons }: AttachmentItemProps) => {
  return (
    <div className="flex items-center justify-between">
      <Link
        className="flex items-center gap-x-2 truncate text-sm"
        href={attachmentDownloadUrl(attachment.id)}
      >
        <LucideArrowUpRightFromSquare className="size-4" />
        {attachment.name}
      </Link>

      {buttons}
    </div>
  );
};

export { AttachmentItem };
