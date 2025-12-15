import { Suspense } from "react";

import { Heading } from "@/components/heading";
import { Spinner } from "@/components/spinner";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { InvitationCreateButton } from "@/features/invitations/components/invitation-create-button";
import { MembershipTable } from "@/features/membership/components/membership-table";
import { getOrganizationById } from "@/features/organization/queries/get-organization";

import { OrganizationBreadcrumbs } from "../_navigation/tabs";

type MembershipsPageProps = {
  params: Promise<{
    organizationId: string;
  }>;
};

const MembershipsPage = async ({ params }: MembershipsPageProps) => {
  const { organizationId } = await params;
  const { user } = await getAuthOrRedirect();

  const organization = await getOrganizationById(organizationId);

  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <Heading
        title="Memberships"
        description="Manage members in your organization"
        breadcrumbs={
          <OrganizationBreadcrumbs organizationName={organization?.name} />
        }
        actions={<InvitationCreateButton organizationId={organizationId} />}
      />

      <Suspense fallback={<Spinner />}>
        <MembershipTable
          organizationId={organizationId}
          signedUserId={user.id}
        />
      </Suspense>
    </div>
  );
};

export default MembershipsPage;
