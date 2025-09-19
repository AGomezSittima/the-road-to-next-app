"use client";

import { LucidePlus } from "lucide-react";

import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormDialog } from "@/hooks/use-form-dialog";

import { createCredential } from "../actions/create-credential";

type CredentialCreateButtonProps = {
  organizationId: string;
};

enum FormFields {
  Name = "name",
}

const CredentialCreateButton = ({
  organizationId,
}: CredentialCreateButtonProps) => {
  const dialog = useFormDialog({
    title: "Create Credential",
    description: "Create a new API secret for your organization",
    action: createCredential.bind(null, organizationId),
    // TODO: Extract form to component
    renderForm: (formAction, actionState, onClose) => (
      <Form
        action={formAction}
        actionState={actionState}
        onSuccess={onClose}
        toastOptions={{ duration: Infinity, closeButton: true }}
      >
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
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <SubmitButton label="Create" />
        </DialogFooter>
      </Form>
    ),
    renderTrigger: () => (
      <Button>
        <LucidePlus className="size-4" />
        Create Credential
      </Button>
    ),
  });

  return <>{dialog}</>;
};

export { CredentialCreateButton };
