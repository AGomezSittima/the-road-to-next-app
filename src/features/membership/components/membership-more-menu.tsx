"use client";

import { LucideUserCog } from "lucide-react";
import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MembershipRole } from "@prisma/client";

import { updateMembershipRole } from "../actions/update-membership-role";

type MembershipMoreMenuProps = {
  userId: string;
  organizationId: string;
  membershipRole: MembershipRole;
};

const MembershipMoreMenu = ({
  userId,
  organizationId,
  membershipRole,
}: MembershipMoreMenuProps) => {
  const handleUpdateMembershipRole = async (value: string) => {
    const promise = updateMembershipRole({
      userId,
      organizationId,
      membershipRole: value as MembershipRole,
    });

    toast.promise(promise, { loading: "Updating role..." });
    const result = await promise;

    if (result.status === "ERROR") {
      toast.error(result.message);
      return;
    } else {
      toast.success(result.message);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline">
          <LucideUserCog className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Roles</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={membershipRole}
          onValueChange={handleUpdateMembershipRole}
        >
          <DropdownMenuRadioItem value="ADMIN">Admin</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="MEMBER">Member</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { MembershipMoreMenu };
