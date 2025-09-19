"use client";

import React, { useActionState, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ActionState, EMPTY_ACTION_STATE } from "@/utils/to-action-state";

type FormDialogProps = {
  title?: string;
  description?: string;
  action: (
    actionState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
  renderForm: (
    formAction: (payload: FormData) => void,
    actionState: ActionState,
    onClose: () => void,
  ) => React.ReactNode;
  renderTrigger: () => React.ReactElement;
  onSuccess?: (actionState: ActionState) => void;
};

const useFormDialog = ({
  title = "Form Dialog",
  description,
  action,
  renderForm,
  renderTrigger,
}: FormDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [actionState, formAction] = useActionState(action, EMPTY_ACTION_STATE);

  const handleClose = () => {
    setIsOpen(false);
  };

  const dialogTrigger = renderTrigger();
  const dialogForm = renderForm(formAction, actionState, handleClose);

  const dialog = (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {dialogForm}
      </DialogContent>
    </Dialog>
  );

  return dialog;
};

export { useFormDialog };
