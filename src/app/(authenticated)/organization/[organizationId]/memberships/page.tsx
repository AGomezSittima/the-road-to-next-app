import { Suspense } from "react";

import { Heading } from "@/components/heading";
import { Spinner } from "@/components/spinner";
import { MembershipTable } from "@/features/membership/components/membership-table";

type MembershipsPageProps = {
  params: Promise<{
    organizationId: string;
  }>;
};

const MembershipsPage = async ({ params }: MembershipsPageProps) => {
  const { organizationId } = await params;

  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <Heading
        title="Memberships"
        description="Manage members in your organization"
      />

      <Suspense fallback={<Spinner />}>
        <MembershipTable organizationId={organizationId} />
      </Suspense>
    </div>
  );
};

export default MembershipsPage;
