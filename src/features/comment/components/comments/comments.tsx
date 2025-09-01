"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { CardCompact } from "@/components/card-compact";
import { Spinner } from "@/components/spinner";
import { PaginatedData } from "@/types/pagination";

import { CommentWithMetadata } from "../../types";
import { CommentCreateForm } from "../comment-create-form";
import { CommentDeleteButton } from "../comment-delete-button";
import { CommentItem } from "../comment-item";
import { usePaginatedComments } from "./use-paginated-comments";

type CommentsProps = {
  ticketId: string;
  paginatedComments: PaginatedData<CommentWithMetadata>;
};

const Comments = ({ ticketId, paginatedComments }: CommentsProps) => {
  const {
    comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    onCreateComment,
    onDeleteComment,
  } = usePaginatedComments(ticketId, paginatedComments);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage]);

  return (
    <>
      <CardCompact
        title="Create Comment"
        description="A new comment will be created"
        content={
          <CommentCreateForm
            ticketId={ticketId}
            onCreateComment={onCreateComment}
          />
        }
      />

      <div className="ml-8 flex flex-col gap-y-2">
        {comments.map((comment) => {
          const commentDeleteButton = (
            <CommentDeleteButton
              key="0"
              id={comment.id}
              onDeleteComment={onDeleteComment}
            />
          );

          const buttons = [...(comment.isOwner ? [commentDeleteButton] : [])];

          return (
            <CommentItem key={comment.id} comment={comment} buttons={buttons} />
          );
        })}
      </div>

      <div ref={ref}>
        {isFetchingNextPage ? (
          <Spinner />
        ) : (
          !hasNextPage && (
            <p className="text-right text-xs italic text-muted-foreground">
              No more comments.
            </p>
          )
        )}
      </div>
    </>
  );
};

export { Comments };
