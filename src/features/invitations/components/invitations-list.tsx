import { format } from "date-fns/format";
import { LucideTrash } from "lucide-react";

import { Placeholder } from "@/components/placeholder";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getInvitations } from "../queries/get-invitations";

type InvitationsListProps = {
  organizationId: string;
};

const InvitationsList = async ({ organizationId }: InvitationsListProps) => {
  const invitations = await getInvitations(organizationId);

  if (!invitations.length) {
    return <Placeholder label="No invitations found" />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Invited At</TableHead>
          <TableHead>Invited By</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {invitations.map((invitation) => {
          const deleteButton = (
            <Button variant="destructive" size="icon">
              <LucideTrash className="size-4" />
            </Button>
          );

          const buttons = <>{deleteButton}</>;

          return (
            <TableRow key={invitation.email}>
              <TableCell>{invitation.email}</TableCell>
              <TableCell>
                {format(invitation.createdAt, "yyyy-MM-dd, HH:mm")}
              </TableCell>
              <TableCell>
                {invitation.invitedByUser
                  ? `${invitation.invitedByUser.username} (${invitation.invitedByUser.email})`
                  : "Deleted User"}
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

export { InvitationsList };
