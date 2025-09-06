import { prisma } from "@/lib/prisma";

import * as attachmentDTO from "../dto/attachment-dto";

export const getAttachmentById = async (
  id: string,
): Promise<attachmentDTO.Type | null> => {
  return await prisma.attachment.findUnique({
    where: { id },
    include: { ticket: true, comment: { include: { ticket: true } } },
  });
};
