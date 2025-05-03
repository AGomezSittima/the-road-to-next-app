"use client";

import { LucideLoaderCircle, LucideLogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import { Button } from "@/components/ui/button";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";

import { deleteMembership } from "../actions/delete-membership";

type MembershipDeleteButtonProps = {
  userId: string;
  organizationId: string;
};

const MembershipDeleteButton = ({
  userId,
  organizationId,
}: MembershipDeleteButtonProps) => {
  const router = useRouter();

  const [deleteButton, deleteDialog] = useConfirmDialog({
    action: deleteMembership.bind(null, { userId, organizationId }),
    renderTrigger: (onClick, isPending) => (
      <Button
        variant="destructive"
        size="icon"
        onClick={onClick}
        disabled={isPending}
      >
        {isPending ? (
          <LucideLoaderCircle className="size-4 animate-spin" />
        ) : (
          <LucideLogOut className="size-4" />
        )}
      </Button>
    ),
    pendingMessage: "Deleting membership ...",
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

export { MembershipDeleteButton };
