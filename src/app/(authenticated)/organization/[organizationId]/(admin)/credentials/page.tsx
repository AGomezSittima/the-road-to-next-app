import { Suspense } from "react";

import { Heading } from "@/components/heading";
import { Spinner } from "@/components/spinner";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { CredentialCreateButton } from "@/features/credential/components/credential-create-button";
import { CredentialsTable } from "@/features/credential/components/credentials-table";

import { OrganizationBreadcrumbs } from "../_navigation/tabs";

type CredentialsPageProps = {
  params: Promise<{
    organizationId: string;
  }>;
};

const CredentialsPage = async ({ params }: CredentialsPageProps) => {
  const { organizationId } = await params;
  const { user } = await getAuthOrRedirect();

  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <Heading
        title="Credentials"
        description="Manage your organization's API secrets"
        tabs={<OrganizationBreadcrumbs />}
        actions={<CredentialCreateButton organizationId={organizationId} />}
      />

      <Suspense fallback={<Spinner />}>
        <CredentialsTable
          organizationId={organizationId}
          signedUserId={user.id}
        />
      </Suspense>
    </div>
  );
};

export default CredentialsPage;
