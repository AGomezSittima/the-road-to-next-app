import { LucidePlus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { Heading } from "@/components/heading";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { OrganizationTable } from "@/features/organization/components/organization-table";
import { organizationCreatePath } from "@/utils/paths";

const OrganizationPage = () => {
  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <Heading
        title="Organization"
        description="All your organizations"
        actions={
          <Button asChild>
            <Link href={organizationCreatePath()}>
              <LucidePlus className="size-4" />
              Create organization
            </Link>
          </Button>
        }
      />
      <Suspense fallback={<Spinner />}>
        <OrganizationTable />
      </Suspense>
    </div>
  );
};

export default OrganizationPage;
