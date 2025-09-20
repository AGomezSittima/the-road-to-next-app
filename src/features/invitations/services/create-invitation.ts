import { getMembershipInOrganizationByEmail } from "@/features/membership/queries/get-membership";
import { getStripeProvisioningByOrganization } from "@/features/stripe/queries/get-stripe-provisioning";
import { inngest } from "@/lib/inngest";
import { appConfig } from "@/utils/app-config";

import { generateInvitationLink } from "../utils/generate-invitation-link";

export const createInvitation = async (
  userId: string,
  organizationId: string,
  email: string,
) => {
  const { allowedMembers, currentMembers } =
    await getStripeProvisioningByOrganization(organizationId);

  if (allowedMembers <= currentMembers) {
    throw new Error("Upgrade your subscription to invite more members");
  }

  const targetMembership = await getMembershipInOrganizationByEmail({
    organizationId,
    email,
  });

  if (targetMembership) {
    throw new Error("User is already a member of this organization");
  }

  const emailInvitationLink = await generateInvitationLink(
    userId,
    organizationId,
    email,
  );

  await inngest.send({
    name: appConfig.events.names.invitationCreated,
    data: {
      userId,
      organizationId,
      email,
      emailInvitationLink,
    },
  });
};
