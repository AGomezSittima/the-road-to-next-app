"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { prisma } from "@/lib/prisma";
import { ticketPath } from "@/utils/paths";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";

const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Is required")
    .max(1024, "Too many characters (max 1024 characters)"),
});

export const createComment = async (
  ticketId: string,
  _acitonState: ActionState,
  formData: FormData,
) => {
  const { user } = await getAuthOrRedirect();

  let comment;
  try {
    const data = createCommentSchema.parse(Object.fromEntries(formData));

    comment = await prisma.comment.create({
      data: {
        ...data,
        userId: user.id,
        ticketId,
      },
      include: { user: true },
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
