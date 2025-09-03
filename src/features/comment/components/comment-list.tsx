import { AttachmentCreateButton } from "@/features/attachments/components/attachment-create-button";
import { AttachmentDeleteButton } from "@/features/attachments/components/attachment-delete-button";
import { AttachmentList } from "@/features/attachments/components/attachment-list";

import { CommentWithMetadata } from "../types";
import { CommentDeleteButton } from "./comment-delete-button";
import { CommentItem, CommentItemSection } from "./comment-item";

type CommentListProps = {
  comments: CommentWithMetadata[];
  onDeleteComment: (id: string) => void;
  onCreateAttachment?: () => void;
  onDeleteAttachment?: (id: string) => void;
};

const CommentList = ({
  comments,
  onDeleteComment,
  onCreateAttachment,
  onDeleteAttachment,
}: CommentListProps) => {
  return (
    <>
      {comments.map((comment) => {
        const attachmentCreateButton = (
          <AttachmentCreateButton
            key="0"
            entity="COMMENT"
            entityId={comment.id}
            onCreateAttachment={onCreateAttachment}
          />
        );

        const commentDeleteButton = (
          <CommentDeleteButton
            key="1"
            id={comment.id}
            onDeleteComment={onDeleteComment}
          />
        );

        const buttons = [
          ...(comment.isOwner
            ? [attachmentCreateButton, commentDeleteButton]
            : []),
        ];

        const sections: CommentItemSection[] = [];

        if (comment.attachments.length) {
          sections.push({
            label: "Attachments",
            content: (
              <AttachmentList
                attachments={comment.attachments}
                renderButtons={(attachmentId: string) => [
                  ...(comment.isOwner
                    ? [
                        <AttachmentDeleteButton
                          key="0"
                          id={attachmentId}
                          onDeleteAttachment={onDeleteAttachment}
                        />,
                      ]
                    : []),
                ]}
              />
            ),
          });
        }

        return (
          <CommentItem
            key={comment.id}
            comment={comment}
            sections={sections}
            buttons={buttons}
          />
        );
      })}
    </>
  );
};

export { CommentList };
