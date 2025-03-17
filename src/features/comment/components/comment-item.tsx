import { Card } from "@/components/ui/card";

import { CommentWithMetadata } from "../types";

type CommentItemProps = {
  comment: CommentWithMetadata;
};

const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <Card className="flex flex-1 flex-col gap-y-1 p-4">
      <div className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          {comment.user?.username ?? "Deleted User"}
        </p>
        <p className="text-sm text-muted-foreground">
          {comment.createdAt.toLocaleString()}
        </p>
      </div>
      <p className="whitespace-pre-line">{comment.content}</p>
    </Card>
  );
};

export { CommentItem };
