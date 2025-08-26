"use client";

import { LucideLoaderCircle, LucideTrash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";

import { deleteAttachment } from "../actions/delete-attachment";

type AttachmentDeleteButtonProps = {
  id: string;
};

const AttachmentDeleteButton = ({ id }: AttachmentDeleteButtonProps) => {
  const [deleteButton, deleteDialog] = useConfirmDialog({
    pendingMessage: "Deleting attachment ...",
    action: deleteAttachment.bind(null, id),
    renderTrigger: (onClick, isPending) => (
      <Button variant="ghost" size="xs" onClick={onClick} disabled={isPending}>
        {isPending ? (
          <LucideLoaderCircle className="size-4 animate-spin" />
        ) : (
          <LucideTrash className="size-4" />
        )}
      </Button>
    ),
  });

  return (
    <>
      {deleteDialog}
      {deleteButton}
    </>
  );
};

export { AttachmentDeleteButton };
