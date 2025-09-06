"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { AttachmentSubjectDTO } from "@/features/attachments/dto/attachment-subject-dto";
import { filesSchema } from "@/features/attachments/schema/files";
import * as attachmentService from "@/features/attachments/service";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { ticketPath } from "@/utils/paths";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";

import * as commentDataAccess from "../data";

const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Is required")
    .max(1024, "Too many characters (max 1024 characters)"),
  files: filesSchema,
});

export const createComment = async (
  ticketId: string,
  _acitonState: ActionState,
  formData: FormData,
) => {
  const { user } = await getAuthOrRedirect();

  let comment;
  try {
    const { content, files } = createCommentSchema.parse({
      content: formData.get("content"),
      files: formData.getAll("files"),
    });

    comment = await commentDataAccess.createComment({
      userId: user.id,
      ticketId,
      content,
      options: {
        includeUser: true,
        includeTicket: true,
      },
    });

    const subject = AttachmentSubjectDTO.fromComment(comment);

    if (!subject) {
      return toActionState("ERROR", "Comment not created");
    }

    await attachmentService.createAttachments({
      subject,
      entity: "COMMENT",
      entityId: comment.id,
      files,
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketPath(ticketId));

  return toActionState("SUCCESS", "Comment created", undefined, {
    ...comment,
    isOwner: true,
  });
};
