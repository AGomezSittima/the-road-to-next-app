import { prisma } from "@/lib/prisma";

import { AttachmentPayload, AttachmentReferenceData } from "../types";
import { getAttachmentTypeFromFileType } from "../utils/get-attachment-type";

type CreateAttachmentArgs = {
  name: string;
  fileType: string;
  referenceData: AttachmentReferenceData;
};

export const createAttachment = async ({
  name,
  fileType,
  referenceData,
}: CreateAttachmentArgs): Promise<AttachmentPayload> => {
  const { entity, ticketId, commentId } = referenceData;
  const attachmentType = getAttachmentTypeFromFileType(fileType);

  return await prisma.attachment.create({
    data: {
      name,
      entity,
      type: attachmentType,
      ticketId,
      commentId,
    },
    include: { ticket: true, comment: { include: { ticket: true } } },
  });
};
