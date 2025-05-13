import { format } from "date-fns";
import {
  LucideArrowLeftRight,
  LucideArrowUpRightFromSquare,
  LucidePen,
} from "lucide-react";
import Link from "next/link";

import { SubmitButton } from "@/components/form/submit-button";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MembershipDeleteButton } from "@/features/membership/components/membership-delete-button";
import { membershipsPath } from "@/utils/paths";

import { getOrganizationsByUser } from "../queries/get-organization-by-user";
import { OrganizationDeleteButton } from "./organization-delete-button";
import { OrganizationSwitchButton } from "./organization-switch-button";

type OrganizationTableProps = {
  limitedAccess?: boolean;
};

// TODO: Change to Data Table
const OrganizationTable = async ({ limitedAccess }: OrganizationTableProps) => {
  const organizations = await getOrganizationsByUser();

  const hasActive = organizations.some(
    (organization) => organization.membershipByUser.isActive,
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Joined At</TableHead>
          <TableHead>Members</TableHead>
          <TableHead>My Role</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {organizations.map((organization) => {
          const isActive = organization.membershipByUser.isActive;

          const switchButton = (
            <OrganizationSwitchButton
              organizationId={organization.id}
              trigger={
                <SubmitButton
                  label={
                    !hasActive ? "Activate" : isActive ? "Active" : "Switch"
                  }
                  icon={<LucideArrowLeftRight className="size-4" />}
                  variant={
                    !hasActive ? "secondary" : isActive ? "default" : "outline"
                  }
                  disabled={isActive}
                />
              }
            />
          );

          const detailButton = (
            <Button variant="outline" size="icon" asChild>
              <Link href={membershipsPath(organization.id)}>
                <LucideArrowUpRightFromSquare className="size-4" />
              </Link>
            </Button>
          );

          const editButton = (
            <Button variant="outline" size="icon">
              <LucidePen className="size-4" />
            </Button>
          );

          const leaveButton = (
            <MembershipDeleteButton
              userId={organization.membershipByUser.userId}
              organizationId={organization.id}
            />
          );

          const deleteButton = (
            <OrganizationDeleteButton organizationId={organization.id} />
          );

          const buttons = (
            <>
              {switchButton}
              {limitedAccess ? null : detailButton}
              {limitedAccess ? null : editButton}
              {limitedAccess ? null : leaveButton}
              {limitedAccess ? null : deleteButton}
            </>
          );

          return (
            <TableRow key={organization.id}>
              <TableCell>{organization.id}</TableCell>
              <TableCell>{organization.name}</TableCell>
              <TableCell>
                {format(
                  organization.membershipByUser.joinedAt,
                  "yyyy-MM-dd, HH:mm",
                )}
              </TableCell>
              <TableCell>{organization._count.memberships}</TableCell>
              <TableCell>{organization.membershipByUser.role}</TableCell>
              <TableCell className="flex justify-end gap-x-2">
                {buttons}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export { OrganizationTable };
