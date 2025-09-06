import { prisma } from "@/lib/prisma";

import { AttachmentPayload } from "../types";

export const getAttachmentById = async (
  id: string,
): Promise<AttachmentPayload | null> => {
  return await prisma.attachment.findUnique({
    where: { id },
    include: { ticket: true, comment: { include: { ticket: true } } },
  });
};
