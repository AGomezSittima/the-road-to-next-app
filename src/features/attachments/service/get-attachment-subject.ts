import { prisma } from "@/lib/prisma";
import { AttachmentEntity } from "@prisma/client";

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
      return await prisma.ticket.findUnique({
        where: { id: entityId },
      });
    }
    case "COMMENT": {
      return await prisma.comment.findUnique({
        where: { id: entityId },
        include: { ticket: true },
      });
    }
    default: {
      return null;
    }
  }
};
