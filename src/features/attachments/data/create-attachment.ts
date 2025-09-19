import { prisma } from "@/lib/prisma";
import { AttachmentEntity } from "@prisma/client";

import { AttachmentPayload } from "../types";
import { getAttachmentTypeFromFileType } from "../utils/get-attachment-type";

type CreateAttachmentArgs = {
  name: string;
  fileType: string;
  entity: AttachmentEntity;
  entityId: string;
};

export const createAttachment = async ({
  name,
  fileType,
  entity,
  entityId,
}: CreateAttachmentArgs): Promise<AttachmentPayload> => {
  const attachmentType = getAttachmentTypeFromFileType(fileType);

  return await prisma.attachment.create({
    data: {
      name,
      entity,
      type: attachmentType,
      ...(entity === "TICKET" ? { ticketId: entityId } : {}),
      ...(entity === "COMMENT" ? { commentId: entityId } : {}),
    },
    include: { ticket: true, comment: { include: { ticket: true } } },
  });
};
