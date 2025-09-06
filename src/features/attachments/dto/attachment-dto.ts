import { Prisma } from "@prisma/client";

export type Type = Prisma.AttachmentGetPayload<{
  include: { ticket: true; comment: { include: { ticket: true } } };
}>;
