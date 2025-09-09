"use client";

import { LucideLoaderCircle, LucideTrash } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import { Button } from "@/components/ui/button";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";

import { revokeCredential } from "../actions/revoke-credential";

type CredentialRevokeButtonProps = {
  credentialId: string;
  organizationId: string;
};

const CredentialRevokeButton = ({
  credentialId,
  organizationId,
}: CredentialRevokeButtonProps) => {
  const router = useRouter();

  const [revokeButton, revokeDialog] = useConfirmDialog({
    action: revokeCredential.bind(null, { credentialId, organizationId }),
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
          <LucideTrash className="size-4" />
        )}
      </Button>
    ),
    pendingMessage: "Revoking credential ...",
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <>
      {revokeDialog}
      {revokeButton}
    </>
  );
};

export { CredentialRevokeButton };
