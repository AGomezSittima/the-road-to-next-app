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

import { createInvitation } from "../actions/create-invitation";

type InvitationCreateButtonProps = {
  organizationId: string;
};

enum FormFields {
  Email = "email",
}

const InvitationCreateButton = ({
  organizationId,
}: InvitationCreateButtonProps) => {
  const dialog = useFormDialog({
    title: "Invite Member",
    description: "Invite a user by email to your organization",
    action: createInvitation.bind(null, organizationId),
    // TODO: Extract form to component
    renderForm: (formAction, actionState, onClose) => (
      <Form action={formAction} actionState={actionState} onSuccess={onClose}>
        <div className="grid gap-4 py-4">
          <div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={FormFields.Email} className="text-right">
                Email
              </Label>
              <Input
                name={FormFields.Email}
                id={FormFields.Email}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div />
              <div className="col-span-3">
                <FieldError actionState={actionState} name={FormFields.Email} />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <SubmitButton label="Invite" />
        </DialogFooter>
      </Form>
    ),
    renderTrigger: () => (
      <Button>
        <LucidePlus className="size-4" />
        Invite Member
      </Button>
    ),
  });

  return <>{dialog}</>;
};

export { InvitationCreateButton };
