import { z } from "zod";

import { AttachmentEntity } from "@prisma/client";

export const attachmentSubjectSchema = z.discriminatedUnion("entity", [
  z.object({
    entity: z.literal(AttachmentEntity.TICKET),
    ticketId: z.string(),
    commentId: z.undefined(),
  }),
  z.object({
    entity: z.literal(AttachmentEntity.COMMENT),
    ticketId: z.undefined(),
    commentId: z.string(),
  }),
]);
