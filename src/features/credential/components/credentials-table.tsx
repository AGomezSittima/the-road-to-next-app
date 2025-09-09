import { format } from "date-fns";

import { Placeholder } from "@/components/placeholder";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { getCredentials } from "../queries/get-credentials";
import { CredentialRevokeButton } from "./credential-revoke-button";

type CredentialsTableProps = {
  organizationId: string;
};

const CredentialsTable = async ({ organizationId }: CredentialsTableProps) => {
  const credentials = await getCredentials(organizationId);

  if (!credentials.length) {
    return <Placeholder label="No credentials for this organization" />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Last Used</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {credentials.map((credential) => {
          const revokeButton = credential.revokedAt ? null : (
            <CredentialRevokeButton
              credentialId={credential.id}
              organizationId={organizationId}
            />
          );

          const buttons = <>{revokeButton}</>;

          return (
            <TableRow
              key={credential.id}
              className={cn(credential.revokedAt && "text-muted-foreground")}
            >
              <TableCell>
                {credential.name}
                {credential.revokedAt && (
                  <>
                    &nbsp;<span className="text-xs">(revoked)</span>
                  </>
                )}
              </TableCell>
              <TableCell>
                {format(credential.createdAt, "yyyy-MM-dd, HH:mm")}
              </TableCell>
              <TableCell>
                {credential.lastUsed
                  ? format(credential.lastUsed, "yyyy-MM-dd, HH:mm")
                  : "Never"}
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

export { CredentialsTable };
