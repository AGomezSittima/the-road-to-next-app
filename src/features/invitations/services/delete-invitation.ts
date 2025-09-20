import { prisma } from "@/lib/prisma";

import { getInvitationInOrganizationByEmail } from "../queries/get-invitation";

type DeleteInvitationArgs = {
  email: string;
  organizationId: string;
};

export const deleteInvitation = async ({
  email,
  organizationId,
}: DeleteInvitationArgs) => {
  const invitation = getInvitationInOrganizationByEmail(organizationId, email);

  if (!invitation) {
    throw new Error("Invitation not found");
  }

  await prisma.invitation.delete({
    where: { invitationId: { email, organizationId } },
  });
};
