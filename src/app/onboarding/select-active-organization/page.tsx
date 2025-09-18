import { LucidePlus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { Heading } from "@/components/heading";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { OrganizationTable } from "@/features/organization/components/organization-table";
import { getOrganizationsByUser } from "@/features/organization/queries/get-organizations-by-user";
import { onboardingPath, organizationsPath } from "@/utils/paths";
const SelectActiveOrganizationPage = async () => {
  const organizations = await getOrganizationsByUser();

  const hasActive = organizations.some(
    (organization) => organization.membershipByUser.isActive,
  );

  if (hasActive) {
    redirect(organizationsPath());
  }

  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <Heading
        title="Select Organization"
        description="Pick an organization to work with"
        actions={
          <Button asChild>
            <Link href={onboardingPath()}>
              <LucidePlus className="size-4" />
              Create organization
            </Link>
          </Button>
        }
      />
      <Suspense fallback={<Spinner />}>
        <OrganizationTable limitedAccess />
      </Suspense>
    </div>
  );
};

export default SelectActiveOrganizationPage;
