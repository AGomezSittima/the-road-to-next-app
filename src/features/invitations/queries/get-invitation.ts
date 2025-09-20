import { getAuth } from "@/features/auth/queries/get-auth";
import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import { prisma } from "@/lib/prisma";

export const getInvitationByTokenHash = async (tokenHash: string) => {
  await getAuth();

  return await prisma.invitation.findUnique({
    where: { tokenHash },
  });
};

export const getInvitationInOrganizationByEmail = async (
  organizationId: string,
  email: string,
) => {
  await getAdminOrRedirect(organizationId);

  return await prisma.invitation.findUnique({
    where: { invitationId: { email, organizationId } },
  });
};
