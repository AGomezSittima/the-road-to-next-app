"use client";

import { LucideLoaderCircle, LucideTrash } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";

import { deleteInvitation } from "../actions/delete-invitation";

type InvitationDeleteButtonProps = {
  email: string;
  organizationId: string;
};

const InvitationDeleteButton = ({
  email,
  organizationId,
}: InvitationDeleteButtonProps) => {
  const router = useRouter();

  const [deleteButton, deleteDialog] = useConfirmDialog({
    pendingMessage: "Revoking invitation ...",
    action: deleteInvitation.bind(null, { email, organizationId }),
    renderTrigger: (onClick, isPending) => (
      <Button
        variant="destructive"
        size="icon"
        onClick={onClick}
        disabled={isPending}
      >
        {isPending ? (
          <LucideLoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <LucideTrash className="h-4 w-4" />
        )}
      </Button>
    ),
    onSuccess: () => {
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

export { InvitationDeleteButton };
