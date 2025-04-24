import { Suspense } from "react";

import { Heading } from "@/components/heading";
import { Spinner } from "@/components/spinner";
import { OrganizationList } from "@/features/organization/components/organization-list";

const OrganizationPage = () => {
  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <Heading title="Organization" description="All your organizations" />
      <Suspense fallback={<Spinner />}>
        <OrganizationList />
      </Suspense>
    </div>
  );
};

export default OrganizationPage;
