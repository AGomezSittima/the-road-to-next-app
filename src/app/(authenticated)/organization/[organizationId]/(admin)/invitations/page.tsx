import { Suspense } from "react";

import { Heading } from "@/components/heading";
import { Spinner } from "@/components/spinner";
import { InvitationsList } from "@/features/invitations/components/invitations-list";

import { OrganizationBreadcrumbs } from "../_navigation/tabs";

type InvitationsPageProps = {
  params: Promise<{
    organizationId: string;
  }>;
};

const MembershipsPage = async ({ params }: InvitationsPageProps) => {
  const { organizationId } = await params;

  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <Heading
        title="Invitations"
        description="Manage your organization's invitations"
        tabs={<OrganizationBreadcrumbs />}
      />

      <Suspense fallback={<Spinner />}>
        <InvitationsList organizationId={organizationId} />
      </Suspense>
    </div>
  );
};

export default MembershipsPage;
