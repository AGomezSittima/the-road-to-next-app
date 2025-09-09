import * as ticketService from "@/features/ticket/service";
import { prisma } from "@/lib/prisma";
import { Comment } from "@prisma/client";

export async function deleteComment(comment: Comment): Promise<void>;
export async function deleteComment(commentId: string): Promise<void>;
export async function deleteComment(commentOrId: Comment | string) {
  await prisma.$transaction(async (tx) => {
    const comment =
      typeof commentOrId === "string"
        ? await tx.comment.findUnique({ where: { id: commentOrId } })
        : commentOrId;

    if (!comment) throw new Error("Comment not found");

    await Promise.all([
      ticketService.disconnectReferencedTicketsViaComment(comment, tx),
      tx.comment.delete({ where: { id: comment.id } }),
    ]).catch((error) => {
      console.log(error);

      throw error;
    });
  });
}
