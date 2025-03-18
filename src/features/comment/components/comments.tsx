"use client";

import { useState } from "react";

import { CardCompact } from "@/components/card-compact";
import { Button } from "@/components/ui/button";
import { PaginationMetadata } from "@/lib/types";

import { getComments } from "../queries/get-comments";
import { CommentWithMetadata } from "../types";
import { CommentCreateForm } from "./comment-create-form";
import { CommentDeleteButton } from "./comment-delete-button";
import { CommentItem } from "./comment-item";

type CommentsProps = {
  ticketId: string;
  paginatedComments: {
    list: CommentWithMetadata[];
    metadata: PaginationMetadata;
  };
};

const Comments = ({ ticketId, paginatedComments }: CommentsProps) => {
  const [comments, setComments] = useState(paginatedComments.list);
  const [metadata, setMetadata] = useState(paginatedComments.metadata);

  const handleMoreComments = async () => {
    const morePaginatedComments = await getComments(ticketId, comments.length);

    setComments((previousComments) => [
      ...previousComments,
      ...morePaginatedComments.list,
    ]);
    setMetadata(morePaginatedComments.metadata);
  };

  const handleCreateComment = (comment: CommentWithMetadata | undefined) => {
    if (!comment) return;

    setComments((previousComments) => [comment, ...previousComments]);
  };

  const handleDeleteComment = (id: string) => {
    setComments((previousComments) =>
      previousComments.filter((comment) => comment.id !== id),
    );
  };

  return (
    <>
      <CardCompact
        title="Create Comment"
        description="A new comment will be created"
        content={
          <CommentCreateForm
            ticketId={ticketId}
            onCreateComment={handleCreateComment}
          />
        }
      />

      <div className="ml-8 flex flex-col gap-y-2">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            buttons={[
              ...(comment.isOwner
                ? [
                    <CommentDeleteButton
                      key="0"
                      id={comment.id}
                      onDeleteComment={handleDeleteComment}
                    />,
                  ]
                : []),
            ]}
          />
        ))}
      </div>

      <div className="ml-8 flex flex-col justify-center">
        {metadata.hasNextPage && (
          <Button variant={"ghost"} onClick={handleMoreComments}>
            More
          </Button>
        )}
      </div>
    </>
  );
};

export { Comments };
