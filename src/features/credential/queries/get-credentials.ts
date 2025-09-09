import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import { prisma } from "@/lib/prisma";

export const getCredentials = async (organizationId: string) => {
  await getAdminOrRedirect(organizationId);

  return await prisma.credential.findMany({
    where: {
      organizationId,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      lastUsed: true,
    },
  });
};
