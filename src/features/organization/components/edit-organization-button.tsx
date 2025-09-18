"use client";

import { LucidePen } from "lucide-react";
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

import { updateOrganizationName } from "../actions/update-organization-name";

type EditOrganizationButtonProps = {
  organizationId: string;
  placeholder?: string;
};

enum FormFields {
  Name = "name",
}
<Button variant="outline" size="icon">
  <LucidePen className="size-4" />
</Button>;
const EditOrganizationButton = ({
  organizationId,
  placeholder,
}: EditOrganizationButtonProps) => {
  const [open, setOpen] = useState(false);

  const [actionState, action] = useActionState(
    updateOrganizationName.bind(null, organizationId),
    EMPTY_ACTION_STATE,
  );

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <LucidePen className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Organization</DialogTitle>
          <DialogDescription>
            Update your organization&apos;s name
          </DialogDescription>
        </DialogHeader>
        {/* TODO: Extract component */}
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
                  placeholder={placeholder}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div />
                <div className="col-span-3">
                  <FieldError
                    actionState={actionState}
                    name={FormFields.Name}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <SubmitButton label="Update" />
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { EditOrganizationButton };
