"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { setCookieByKey } from "@/actions/cookies";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";
import { ticketsPath } from "@/utils/paths";
import { ActionState, fromErrorToActionState } from "@/utils/to-action-state";

const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Is required" })
    .max(191, { message: "Too many characters (max 191 characters)" }),
});

export const createOrganization = async (
  _actionState: ActionState,
  formData: FormData,
) => {
  const { user } = await getAuthOrRedirect({
    checkOrganization: false,
    checkActiveOrgananization: false,
  });

  try {
    const { name } = createOrganizationSchema.parse(
      Object.fromEntries(formData),
    );

    await prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name,
          memberships: {
            create: { userId: user.id, isActive: true, role: "ADMIN" },
          },
        },
      });

      await tx.membership.updateMany({
        where: {
          userId: user.id,
          organizationId: {
            not: organization.id,
          },
        },
        data: {
          isActive: false,
        },
      });
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  await setCookieByKey(appConfig.cookiesKeys.toast, "Organization created");
  redirect(ticketsPath());
};
