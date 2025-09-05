import { prisma } from "@/lib/prisma";
import { Comment, Prisma } from "@prisma/client";

type CreateCommentArgs = {
  userId: string;
  ticketId: string;
  content: string;
};

export async function createComment({
  userId,
  ticketId,
  content,
  options,
}: CreateCommentArgs & {
  options?: {
    includeUser?: false;
    includeTicket?: false;
  };
}): Promise<Comment>;

export async function createComment({
  userId,
  ticketId,
  content,
  options,
}: CreateCommentArgs & {
  options?: {
    includeUser?: true;
    includeTicket?: false;
  };
}): Promise<
  Prisma.CommentGetPayload<{
    include: { user: { select: { username: true } } };
  }>
>;

export async function createComment({
  userId,
  ticketId,
  content,
  options,
}: CreateCommentArgs & {
  options?: {
    includeUser?: false;
    includeTicket?: true;
  };
}): Promise<Prisma.CommentGetPayload<{ include: { ticket: true } }>>;

export async function createComment({
  userId,
  ticketId,
  content,
  options,
}: CreateCommentArgs & {
  options?: {
    includeUser?: true;
    includeTicket?: true;
  };
}): Promise<
  Prisma.CommentGetPayload<{
    include: { user: { select: { username: true } }; ticket: true };
  }>
>;

export async function createComment({
  userId,
  ticketId,
  content,
  options,
}: CreateCommentArgs & {
  options?: {
    includeUser?: boolean;
    includeTicket?: boolean;
  };
}) {
  const includeUser = options?.includeUser && {
    user: { select: { username: true } },
  };

  const includeTicket = options?.includeTicket && { ticket: true };

  return await prisma.comment.create({
    data: {
      userId,
      ticketId,
      content,
    },
    include: { ...includeUser, ...includeTicket },
  });
}
