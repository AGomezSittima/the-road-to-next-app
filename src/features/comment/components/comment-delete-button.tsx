"use client";

import { LucideTrash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";

import { deleteComment } from "../actions/delete-comment";

type CommentDeleteButtonProps = {
  id: string;
  onDeleteComment?: (id: string) => void;
};

const CommentDeleteButton = ({
  id,
  onDeleteComment,
}: CommentDeleteButtonProps) => {
  const [deleteButton, deleteDialog] = useConfirmDialog({
    action: deleteComment.bind(null, id),
    renderTrigger: (onClick) => (
      <Button variant="outline" size="icon" onClick={onClick}>
        <LucideTrash className="h-4 w-4" />
      </Button>
    ),
    onSuccess: () => onDeleteComment?.(id),
  });

  return (
    <>
      {deleteDialog}
      {deleteButton}
    </>
  );
};

export { CommentDeleteButton };
