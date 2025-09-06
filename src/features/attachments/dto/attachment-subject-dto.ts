import { AttachmentEntity } from "@prisma/client";

import {
  AttachmentPayload,
  AttachmentSubject,
  isComment,
  isTicket,
} from "../types";

export class AttachmentSubjectDTO {
  entity: AttachmentEntity;
  entityId: string;
  organizationId: string;
  userId: string | null;
  ticketId: string;
  commentId: string | null;

  constructor(
    entity: AttachmentEntity,
    entityId: string,
    organizationId: string,
    userId: string | null,
    ticketId: string,
    commentId: string | null,
  ) {
    this.entity = entity;
    this.entityId = entityId;
    this.organizationId = organizationId;
    this.userId = userId;
    this.ticketId = ticketId;
    this.commentId = commentId;
  }

  static fromTicket(ticket: AttachmentSubject | null) {
    if (!ticket || !isTicket(ticket)) {
      return null;
    }

    return new AttachmentSubjectDTO(
      "TICKET",
      ticket.id,
      ticket.organizationId,
      ticket.userId,
      ticket.id,
      null,
    );
  }

  static fromComment(comment: AttachmentSubject | null) {
    if (!comment || !isComment(comment)) {
      return null;
    }

    return new AttachmentSubjectDTO(
      "COMMENT",
      comment.id,
      comment.ticket.organizationId,
      comment.userId,
      comment.ticket.id,
      comment.id,
    );
  }

  static fromAttachment(attachment: AttachmentPayload | null) {
    switch (attachment?.entity) {
      case "TICKET":
        return this.fromTicket(attachment.ticket);
      case "COMMENT":
        return this.fromComment(attachment.comment);
      default:
        return null;
    }
  }
}
