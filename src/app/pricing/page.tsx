import { getActiveOrganization } from "@/features/organization/queries/get-active-organization";
import { Products } from "@/features/stripe/components/products";
import { checkIfStripeAllowedOrRedirect } from "@/features/stripe/queries/check-if-stripe-allowed";

const PricingPage = async () => {
  checkIfStripeAllowedOrRedirect();

  const activeOrganization = await getActiveOrganization();

  return <Products organizationId={activeOrganization?.id} />;
};

export default PricingPage;
