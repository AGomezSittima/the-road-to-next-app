import { usePaginated } from "@/hooks/use-paginated";
import { PaginatedData } from "@/types/pagination";
import { InfiniteData, QueryClient, QueryKey } from "@tanstack/react-query";

import { getComments } from "../../queries/get-comments";
import { CommentWithMetadata } from "../../types";

type CacheArgs = {
  queryClient: QueryClient;
  queryKey: QueryKey;
};

type RemoveAttachmentsFromCachePayload = {
  attachmentId: string;
  commentId: string;
};

const removeAttachmentFromCache = (
  { queryClient, queryKey }: CacheArgs,
  payload: RemoveAttachmentsFromCachePayload,
) => {
  queryClient.setQueryData<
    InfiniteData<Awaited<ReturnType<typeof getComments>>>
  >(queryKey, (cache) => {
    if (!cache) return cache;

    const pages = cache.pages.map((page) => ({
      ...page,
      list: page.list.map((comment) => {
        if (comment.id === payload.commentId) {
          return {
            ...comment,
            attachments: comment.attachments.filter(
              (attachment) => attachment.id !== payload.attachmentId,
            ),
          };
        }

        return comment;
      }),
    }));

    return { ...cache, pages };
  });
};

export const usePaginatedComments = (
  ticketId: string,
  paginatedComments: PaginatedData<CommentWithMetadata>,
) => {
  const queryKey = ["comments", ticketId];

  const {
    queryClient,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    invalidateQueries,
  } = usePaginated({
    queryKey,
    queryFn: ({ pageParam }) => getComments(ticketId, pageParam),
    initialPaginatedData: paginatedComments,
  });

  const handleDeleteAttachment = (commentId: string, attachmentId: string) => {
    removeAttachmentFromCache(
      { queryClient, queryKey },
      { attachmentId, commentId },
    );

    invalidateQueries();
  };

  const comments = data.pages.flatMap((page) => page.list);

  return {
    comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    onCreateComment: () => invalidateQueries(),
    onDeleteComment: () => invalidateQueries(),
    onCreateAttachment: () => invalidateQueries(),
    onDeleteAttachment: handleDeleteAttachment,
  };
};
