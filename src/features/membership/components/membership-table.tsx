import { format } from "date-fns";
import { LucideBan, LucideCheck } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getMemberships } from "../queries/get-memberships";
import { MembershipDeleteButton } from "./membership-delete-button";
import { MembershipMoreMenu } from "./membership-more-menu";
import { PermissionToggle } from "./permission-toggle";

type MembershipTableProps = {
  organizationId: string;
  signedUserId: string;
};

// TODO: Change to Data Table
const MembershipTable = async ({
  organizationId,
  signedUserId,
}: MembershipTableProps) => {
  const memberships = await getMemberships(organizationId);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Joined At</TableHead>
          <TableHead>Verified Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Can Delete Ticket?</TableHead>
          <TableHead>Can Update Ticket?</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {memberships.map((membership) => {
          const isSignedUser = membership.userId === signedUserId;

          const membershipMoreMenu = (
            <MembershipMoreMenu
              userId={membership.userId}
              organizationId={membership.organizationId}
              membershipRole={membership.role}
            />
          );

          const deleteButton = (
            <MembershipDeleteButton
              userId={membership.userId}
              organizationId={membership.organizationId}
            />
          );

          const buttons = (
            <>
              {membershipMoreMenu}
              {deleteButton}
            </>
          );

          return (
            <TableRow key={membership.userId}>
              <TableCell>
                {membership.user.username}&nbsp;
                <span className="text-xs text-muted-foreground">
                  {isSignedUser && "(you)"}
                </span>
              </TableCell>
              <TableCell>{membership.user.email}</TableCell>
              <TableCell>
                {format(membership.joinedAt, "yyyy-MM-dd, HH:mm")}
              </TableCell>
              <TableCell>
                {membership.user.emailVerified ? (
                  <LucideCheck />
                ) : (
                  <LucideBan />
                )}
              </TableCell>
              <TableCell>{membership.role}</TableCell>
              <TableCell>
                <PermissionToggle
                  userId={membership.userId}
                  organizationId={membership.organizationId}
                  permissionKey="canDeleteTicket"
                  permissionValue={membership.canDeleteTicket}
                />
              </TableCell>
              <TableCell>
                <PermissionToggle
                  userId={membership.userId}
                  organizationId={membership.organizationId}
                  permissionKey="canUpdateTicket"
                  permissionValue={membership.canUpdateTicket}
                />
              </TableCell>
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

export { MembershipTable };
