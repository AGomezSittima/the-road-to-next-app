import { findEntityIdsFromText } from "@/utils/find-entity-ids-from-text";
import { Comment, Prisma } from "@prisma/client";

export async function disconnectReferencedTicketsViaComment(
  comment: Comment,
  tx: Prisma.TransactionClient,
): Promise<void>;
export async function disconnectReferencedTicketsViaComment(
  commentId: string,
  tx: Prisma.TransactionClient,
): Promise<void>;
export async function disconnectReferencedTicketsViaComment(
  commentOrId: Comment | string,
  tx: Prisma.TransactionClient,
): Promise<void> {
  const comment =
    typeof commentOrId === "string"
      ? await tx.comment.findUnique({ where: { id: commentOrId } })
      : commentOrId;

  if (!comment) {
    throw new Error("Comment not found.");
  }

  const ticketId = comment.ticketId;
  const ticketIds = findEntityIdsFromText("tickets", comment.content);

  if (!ticketIds.length) return;

  // TODO: Refactor common logic for making sure that referenced IDs are in the database
  const referencedTicketIds = await tx.ticket.findMany({
    where: { id: { in: ticketIds } },
    select: { id: true },
  });

  const comments = await tx.comment.findMany({
    where: {
      ticketId: comment.ticketId,
      id: {
        not: comment.id,
      },
    },
  });

  // TODO: Change self relation model so it stores how many times a ticket was referenced, making it easier to check if it should be disconnected
  const allOtherContent = comments.map((comment) => comment.content).join(" ");
  const allOtherTicketIds = findEntityIdsFromText("tickets", allOtherContent);

  const ticketIdsToRemove = referencedTicketIds.filter(
    (ticketId) => !allOtherTicketIds.includes(ticketId.id),
  );

  await tx.ticket.update({
    where: { id: ticketId },
    data: {
      referencedTickets: {
        disconnect: ticketIdsToRemove,
      },
    },
  });
}
