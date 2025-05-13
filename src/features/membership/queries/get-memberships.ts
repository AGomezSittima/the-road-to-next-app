"use server";

import { prisma } from "@/lib/prisma";

import { getAdminOrRedirect } from "./get-admin-or-redirect";

export const getMemberships = async (organizationId: string) => {
  await getAdminOrRedirect(organizationId);

  return await prisma.membership.findMany({
    where: {
      organizationId,
    },
    include: {
      user: {
        select: {
          username: true,
          email: true,
          emailVerified: true,
        },
      },
    },
  });
};
