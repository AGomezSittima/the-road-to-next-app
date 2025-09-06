import { prisma } from "@/lib/prisma";
import { AttachmentEntity } from "@prisma/client";

import * as attachmentDTO from "../dto/attachment-dto";

type CreateAttachmentArgs = {
  name: string;
  entity: AttachmentEntity;
  entityId: string;
};

export const createAttachment = async ({
  name,
  entity,
  entityId,
}: CreateAttachmentArgs): Promise<attachmentDTO.Type> => {
  return await prisma.attachment.create({
    data: {
      name,
      entity,
      ...(entity === "TICKET" ? { ticketId: entityId } : {}),
      ...(entity === "COMMENT" ? { commentId: entityId } : {}),
    },
    include: { ticket: true, comment: { include: { ticket: true } } },
  });
};
