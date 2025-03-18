"use client";

import React, { useActionState, useState } from "react";

import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
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
import { ActionState, EMPTY_ACTION_STATE } from "@/utils/to-action-state";

type ConfirmDialogProps = {
  title?: string;
  description?: string;
  action: () => Promise<ActionState>;
  renderTrigger: (onClick: () => void) => React.ReactElement;
  onSuccess?: (actionState: ActionState) => void;
};

const useConfirmDialog = ({
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. Make sure you understand the consequences.",
  action,
  renderTrigger,
  onSuccess,
}: ConfirmDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const dialogTrigger = renderTrigger(() => setIsOpen((state) => !state));

  const [actionState, formAction] = useActionState(action, EMPTY_ACTION_STATE);

  const handleSuccess = () => {
    setIsOpen(false);
    onSuccess?.(actionState);
  };

  const dialog = (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Form
              action={formAction}
              actionState={actionState}
              onSuccess={handleSuccess}
            >
              <SubmitButton label="Confirm" />
            </Form>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return [dialogTrigger, dialog];
};

export { useConfirmDialog };
