import { usePaginated } from "@/hooks/use-paginated";
import { PaginatedData } from "@/types/pagination";

import { getComments } from "../../queries/get-comments";
import { CommentWithMetadata } from "../../types";

export const usePaginatedComments = (
  ticketId: string,
  paginatedComments: PaginatedData<CommentWithMetadata>,
) => {
  const queryKey = ["comments", ticketId];

  const {
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

  const comments = data.pages.flatMap((page) => page.list);

  return {
    comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    onCreateComment: () => invalidateQueries(),
    onDeleteComment: () => invalidateQueries(),
  };
};
