import { z } from "zod";

import { Prisma } from "@prisma/client";

import { attachmentSubjectSchema } from "./schema/attachmentSubject";

type AttachmentSubjectTicket = Prisma.TicketGetPayload<{
  select: {
    id: true;
    organizationId: true;
    userId: true;
  };
}>;

type AttachmentSubjectComment = Prisma.CommentGetPayload<{
  include: {
    ticket: {
      select: {
        id: true;
        organizationId: true;
      };
    };
  };
}>;

export type AttachmentPayload = Prisma.AttachmentGetPayload<{
  include: { ticket: true; comment: { include: { ticket: true } } };
}>;

export type AttachmentSubject =
  | AttachmentSubjectTicket
  | AttachmentSubjectComment;

export type AttachmentReferenceData = z.TypeOf<typeof attachmentSubjectSchema>;

export const isTicket = (
  subject: AttachmentSubject,
): subject is AttachmentSubjectTicket => {
  return "organizationId" in subject;
};

export const isComment = (
  subject: AttachmentSubject,
): subject is AttachmentSubjectComment => {
  return "ticket" in subject;
};
