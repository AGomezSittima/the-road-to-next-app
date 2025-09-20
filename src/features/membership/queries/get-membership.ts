import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { prisma } from "@/lib/prisma";

export const getMembershipInOrganizationByEmail = async ({
  organizationId,
  email,
}: {
  organizationId: string;
  email: string;
}) => {
  await getAuthOrRedirect();

  return await prisma.membership.findFirst({
    where: {
      organizationId,
      user: { email },
    },
  });
};

export const getMembershipInOrganizationByUserId = async ({
  organizationId,
  userId,
}: {
  organizationId: string;
  userId: string;
}) => {
  await getAuthOrRedirect();

  return await prisma.membership.findUnique({
    where: {
      membershipId: {
        organizationId,
        userId,
      },
    },
  });
};
