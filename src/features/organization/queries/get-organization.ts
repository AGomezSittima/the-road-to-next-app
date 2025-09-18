import { getAuth } from "@/features/auth/queries/get-auth";
import { prisma } from "@/lib/prisma";

export const getOrganizationById = async (organizationId: string) => {
  const { user } = await getAuth();

  if (!user) {
    return null;
  }

  const organization = await prisma.organization.findFirst({
    where: {
      id: organizationId,
    },
  });

  return organization;
};
