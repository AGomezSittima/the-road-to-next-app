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
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {memberships.map((membership) => {
          const isSignedUser = membership.userId === signedUserId;

          const deleteButton = (
            <MembershipDeleteButton
              userId={membership.userId}
              organizationId={organizationId}
            />
          );

          const buttons = <>{deleteButton}</>; // TODO: Add buttons

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
