import { AttachmentSubjectDTO } from "@/features/attachments/dto/attachment-subject-dto";
import * as attachmentService from "@/features/attachments/service";
import * as ticketService from "@/features/ticket/service";
import { findEntityIdsFromText } from "@/utils/find-entity-ids-from-text";

import * as commentDataAccess from "../data";

type CreateCommentArgs = {
  userId: string;
  ticketId: string;
  content: string;
  files: File[];
};

export const createComment = async ({
  userId,
  ticketId,
  content,
  files,
}: CreateCommentArgs) => {
  const comment = await commentDataAccess.createComment({
    userId,
    ticketId,
    content,
    options: {
      includeUser: true,
      includeTicket: true,
    },
  });

  const subject = AttachmentSubjectDTO.fromComment(comment);

  if (!subject) {
    throw new Error("Comment not created");
  }

  await attachmentService.createAttachments({
    subject,
    entity: "COMMENT",
    entityId: comment.id,
    files,
  });

  await ticketService.connectReferencedTickets(
    ticketId,
    findEntityIdsFromText("tickets", content),
  );

  return comment;
};
