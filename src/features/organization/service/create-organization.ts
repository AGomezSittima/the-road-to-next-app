import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";

export const createOrganization = async (
  userId: string,
  name: string,
  email: string,
) => {
  const organization = await prisma.$transaction(async (tx) => {
    // TODO: Extract to DAL
    const organization = await tx.organization.create({
      data: {
        name,
        memberships: {
          create: { userId, isActive: true, role: "ADMIN" },
        },
      },
    });

    // TODO: Extract to service
    await tx.membership.updateMany({
      where: {
        userId,
        organizationId: {
          not: organization.id,
        },
      },
      data: {
        isActive: false,
      },
    });

    return organization;
  });

  await inngest.send({
    name: appConfig.events.names.organizationCreated,
    data: {
      organizationId: organization.id,
      byEmail: email,
    },
  });

  return organization;
};
