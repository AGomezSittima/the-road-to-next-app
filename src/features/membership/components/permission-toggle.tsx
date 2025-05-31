"use client";

import { BanIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";

import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";

import { togglePermission } from "../actions/toggle-permission";
import { PermissionKey } from "../../permissions/type";

type PermissionToggleProps = {
  userId: string;
  organizationId: string;
  permissionKey: PermissionKey;
  permissionValue: boolean;
};

const PermissionToggle = ({
  userId,
  organizationId,
  permissionKey,
  permissionValue,
}: PermissionToggleProps) => {
  const [actionState, action] = useActionState(
    togglePermission.bind(null, {
      userId,
      organizationId,
      permissionKey,
    }),
    EMPTY_ACTION_STATE,
  );

  return (
    <Form action={action} actionState={actionState}>
      <SubmitButton
        icon={permissionValue ? <CheckIcon /> : <BanIcon />}
        size="icon"
        variant={permissionValue ? "secondary" : "outline"}
      />
    </Form>
  );
};

export { PermissionToggle };
