"use server";

import { revalidatePath } from "next/cache";

import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";
import { prisma } from "@/lib/prisma";
import { ticketPath } from "@/utils/paths";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";

export const deleteComment = async (id: string) => {
  const { user } = await getAuthOrRedirect();

  try {
    const comment = await prisma.comment.findUnique({ where: { id } });

    if (!comment || !isOwner(user, comment)) {
      return toActionState("ERROR", "Not authorized");
    }

    await prisma.comment.delete({ where: { id } });

    revalidatePath(ticketPath(comment.ticketId));
  } catch (error) {
    return fromErrorToActionState(error);
  }

  return toActionState("SUCCESS", "Comment deleted");
};
