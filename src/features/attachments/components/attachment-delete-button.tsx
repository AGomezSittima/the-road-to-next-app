"use client";

import { LucideLoaderCircle, LucideTrash } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";

import { deleteAttachment } from "../actions/delete-attachment";

type AttachmentDeleteButtonProps = {
  id: string;
  onDeleteAttachment?: (id: string) => void;
};

const AttachmentDeleteButton = ({
  id,
  onDeleteAttachment,
}: AttachmentDeleteButtonProps) => {
  const router = useRouter();

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
    onSuccess: () => {
      onDeleteAttachment?.(id);

      router.refresh();
    },
  });

  return (
    <>
      {deleteDialog}
      {deleteButton}
    </>
  );
};

export { AttachmentDeleteButton };
