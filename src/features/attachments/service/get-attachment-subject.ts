import { prisma } from "@/lib/prisma";
import { AttachmentEntity } from "@prisma/client";

import { AttachmentSubjectDTO } from "../dto/attachment-subject-dto";

type GetAttachmentSubjectArgs = {
  entity: AttachmentEntity;
  entityId: string;
};

export const getAttachmentSubject = async ({
  entity,
  entityId,
}: GetAttachmentSubjectArgs) => {
  switch (entity) {
    case "TICKET": {
      const ticket = await prisma.ticket.findUnique({
        where: { id: entityId },
      });

      return AttachmentSubjectDTO.fromTicket(ticket);
    }
    case "COMMENT": {
      const comment = await prisma.comment.findUnique({
        where: { id: entityId },
        include: { ticket: true },
      });

      return AttachmentSubjectDTO.fromComment(comment);
    }
    default: {
      return null;
    }
  }
};
