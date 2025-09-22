"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ActionState, EMPTY_ACTION_STATE } from "@/utils/to-action-state";

import { useActionFeedback } from "./use-action-feedback";

type ConfirmDialogProps = {
  title?: string;
  description?: string;
  pendingMessage?: string;
  action: () => Promise<ActionState>;
  renderTrigger: (
    onClick: () => void,
    isPending: boolean,
  ) => React.ReactElement;
  onSuccess?: (actionState: ActionState) => void;
};

const useConfirmDialog = ({
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. Make sure you understand the consequences.",
  pendingMessage = "Processing ...",
  action,
  renderTrigger,
  onSuccess,
}: ConfirmDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [actionState, formAction, isPending] = useActionState(
    action,
    EMPTY_ACTION_STATE,
  );

  const pendingToastRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (isPending) {
      pendingToastRef.current = toast.loading(pendingMessage);
    } else if (pendingToastRef.current) {
      toast.dismiss(pendingToastRef.current);
    }

    return () => {
      if (pendingToastRef.current) {
        toast.dismiss(pendingToastRef.current);
      }
    };
  }, [isPending, pendingMessage]);

  useActionFeedback(actionState, {
    onSuccess: ({ actionState }) => {
      if (actionState.message) toast.success(actionState.message);

      onSuccess?.(actionState);
    },
    onError: ({ actionState }) => {
      if (actionState.message) toast.error(actionState.message);
    },
  });

  const dialogTrigger = renderTrigger(
    () => setIsOpen((state) => !state),
    isPending,
  );

  const dialog = (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <form action={formAction}>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button type="submit">Confirm</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );

  return [dialogTrigger, dialog];
};

export { useConfirmDialog };
