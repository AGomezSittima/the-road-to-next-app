"use client";

import { LucidePlus } from "lucide-react";
import { useActionState, useState } from "react";

import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";

import { createCredential } from "../actions/create-credential";

type CredentialCreateButtonProps = {
  organizationId: string;
};

const CredentialCreateButton = ({
  organizationId,
}: CredentialCreateButtonProps) => {
  enum FormFields {
    Name = "name",
  }

  const [open, setOpen] = useState(false);

  const [actionState, action] = useActionState(
    createCredential.bind(null, organizationId),
    EMPTY_ACTION_STATE,
  );

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <LucidePlus className="size-4" />
          Create Credential
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Credential</DialogTitle>
          <DialogDescription>
            Create a new API secret for your organization
          </DialogDescription>
        </DialogHeader>
        <Form action={action} actionState={actionState} onSuccess={handleClose}>
          <div className="grid gap-4 py-4">
            <div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={FormFields.Name} className="text-right">
                  Name
                </Label>
                <Input
                  name={FormFields.Name}
                  id={FormFields.Name}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div />
                <FieldError name={FormFields.Name} actionState={actionState} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <SubmitButton label="Create" />
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { CredentialCreateButton };
