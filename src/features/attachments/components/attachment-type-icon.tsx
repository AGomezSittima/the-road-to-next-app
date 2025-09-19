import { LucideCamera, LucideFileText } from "lucide-react";
import React from "react";

import { AttachmentType } from "@prisma/client";

type AttachmentTypeIconProps = {
  attachmentType: AttachmentType;
};

const attachmentIcons: Readonly<Record<AttachmentType, React.ReactNode>> = {
  IMAGE: <LucideCamera className="inline size-4" />,
  DOCUMENT: <LucideFileText className="inline size-4" />,
};

const AttachmentTypeIcon = ({ attachmentType }: AttachmentTypeIconProps) => {
  return attachmentIcons[attachmentType];
};

export { AttachmentTypeIcon };
