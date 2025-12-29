import { LucideSettings } from "lucide-react";
import { Suspense } from "react";

import { Heading } from "@/components/heading";
import { Spinner } from "@/components/spinner";
import { getOrganizationById } from "@/features/organization/queries/get-organization";
import { CustomerPortalForm } from "@/features/stripe/components/customer-portal-form";
import { Products } from "@/features/stripe/components/products";
import { checkIfStripeAllowedOrRedirect } from "@/features/stripe/queries/check-if-stripe-allowed";

import { OrganizationBreadcrumbs } from "../_navigation/tabs";

type SubscriptionPageProps = {
  params: Promise<{ organizationId: string }>;
};

const SubscriptionPage = async ({ params }: SubscriptionPageProps) => {
  checkIfStripeAllowedOrRedirect();

  const { organizationId } = await params;

  const organization = await getOrganizationById(organizationId);

  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <Heading
        title="Subscription"
        description="Manage your subscription"
        breadcrumbs={
          <OrganizationBreadcrumbs organizationName={organization?.name} />
        }
        actions={
          <CustomerPortalForm organizationId={organizationId}>
            <>
              <LucideSettings className="size-4" />
              Manage Subscription
            </>
          </CustomerPortalForm>
        }
      />

      <Suspense fallback={<Spinner />}>
        <Products organizationId={organizationId} />
      </Suspense>
    </div>
  );
};

export default SubscriptionPage;
