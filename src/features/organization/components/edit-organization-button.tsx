"use client";

import { LucidePen } from "lucide-react";

import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormDialog } from "@/hooks/use-form-dialog";

import { updateOrganizationName } from "../actions/update-organization-name";

type EditOrganizationButtonProps = {
  organizationId: string;
  placeholder?: string;
};

enum FormFields {
  Name = "name",
}

const EditOrganizationButton = ({
  organizationId,
  placeholder,
}: EditOrganizationButtonProps) => {
  const dialog = useFormDialog({
    title: "Update Organization",
    description: "Update your organization's name",
    action: updateOrganizationName.bind(null, organizationId),
    // TODO: Extract form to component
    renderForm: (formAction, actionState, onClose) => (
      <Form action={formAction} actionState={actionState} onSuccess={onClose}>
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
                placeholder={placeholder}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div />
              <div className="col-span-3">
                <FieldError actionState={actionState} name={FormFields.Name} />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <SubmitButton label="Update" />
        </DialogFooter>
      </Form>
    ),
    renderTrigger: () => (
      <Button variant="outline" size="icon">
        <LucidePen className="size-4" />
      </Button>
    ),
  });

  return <>{dialog}</>;
};

export { EditOrganizationButton };
