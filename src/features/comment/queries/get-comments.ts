"use server";

import { getAuth } from "@/features/auth/queries/get-auth";
import { isOwner } from "@/features/auth/utils/is-owner";
import { prisma } from "@/lib/prisma";
import { PaginatedData } from "@/types/pagination";
import { appConfig } from "@/utils/app-config";

import { CommentWithMetadata } from "../types";

export const getComments = async (
  ticketId: string,
  cursor?: string,
): Promise<PaginatedData<CommentWithMetadata>> => {
  const { user } = await getAuth();

  const where = {
    ticketId,
    id: {
      lt: cursor,
    },
  };
  const take = appConfig.comments.commentsPerPage;

  const queryResult = await prisma.$transaction([
    // Get comments
    prisma.comment.findMany({
      where,
      take: take + 1,
      include: { user: { select: { username: true } } },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    }),
    // Get total comments count
    prisma.comment.count({ where }),
  ]);

  let [comments] = queryResult;
  const [, count] = queryResult;

  const hasNextPage = comments.length > take;
  comments = hasNextPage ? comments.slice(0, -1) : comments;

  return {
    list: comments.map((comment) => ({
      ...comment,
      isOwner: isOwner(user, comment),
    })),
    metadata: {
      count,
      hasNextPage,
      cursor: comments[comments.length - 1]?.id,
    },
  };
};
