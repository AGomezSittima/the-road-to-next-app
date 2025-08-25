"use server";

import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import { prisma } from "@/lib/prisma";
import { toActionState } from "@/utils/to-action-state";

type DeleteInvitationArgs = {
  email: string;
  organizationId: string;
};

export const deleteInvitation = async ({
  email,
  organizationId,
}: DeleteInvitationArgs) => {
  await getAdminOrRedirect(organizationId);

  const invitation = await prisma.invitation.findUnique({
    where: { invitationId: { email, organizationId } },
  });

  if (!invitation) {
    return toActionState("ERROR", "Invitation not found");
  }

  await prisma.invitation.delete({
    where: { invitationId: { email, organizationId } },
  });

  return toActionState("SUCCESS", "Invitation revoked");
};
