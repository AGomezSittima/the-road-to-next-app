import { ticketPath } from "@/utils/paths";
import { AttachmentEntity } from "@prisma/client";

import { AttachmentSubject, isComment, isTicket } from "../types";

export const getOrganizationIdByAttachmentSubject = (
  entity: AttachmentEntity,
  subject: null | AttachmentSubject,
) => {
  if (!subject) return "";

  let organizationId = "";
  switch (entity) {
    case "TICKET": {
      if (isTicket(subject)) {
        organizationId = subject.organizationId;
      }
      break;
    }
    case "COMMENT": {
      if (isComment(subject)) {
        organizationId = subject.ticket.organizationId;
      }

      break;
    }
  }

  return organizationId;
};

export const getPathByAttachmentSubject = (
  entity: AttachmentEntity,
  subject: null | AttachmentSubject,
) => {
  if (!subject) return "";

  let path = "";
  switch (entity) {
    case "TICKET": {
      if (isTicket(subject)) {
        path = ticketPath(subject.id);
      }
      break;
    }
    case "COMMENT": {
      if (isComment(subject)) {
        path = ticketPath(subject.ticket.id);
      }
      break;
    }
  }

  return path;
};
