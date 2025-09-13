import Link from "next/link";

import { Heading } from "@/components/heading";
import { Placeholder } from "@/components/placeholder";
import { Button } from "@/components/ui/button";
import { pricingPath } from "@/utils/paths";

import { OrganizationBreadcrumbs } from "../_navigation/tabs";

type SubscriptionPageProps = {
  params: Promise<{ organizationId: string }>;
};

const SubscriptionPage = async ({ params }: SubscriptionPageProps) => {
  const { organizationId } = await params;

  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <Heading
        title="Subscription"
        description="Manage your subscription"
        tabs={<OrganizationBreadcrumbs />}
      />

      <Placeholder
        label="No subscription for this organization"
        button={
          <Button asChild>
            <Link href={pricingPath()}>Go to Pricing</Link>
          </Button>
        }
      />
    </div>
  );
};

export default SubscriptionPage;
