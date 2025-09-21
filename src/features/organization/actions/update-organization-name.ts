"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import { prisma } from "@/lib/prisma";
import { organizationsPath } from "@/utils/paths";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";

const updateOrganizationNameSchema = z.object({
  name: z.string().min(1, { message: "Is required" }).max(191),
});

export const updateOrganizationName = async (
  organizationId: string,
  _actionState: ActionState,
  formData: FormData,
) => {
  await getAdminOrRedirect(organizationId);

  try {
    const { name } = updateOrganizationNameSchema.parse(
      Object.fromEntries(formData),
    );

    await prisma.organization.update({
      where: { id: organizationId },
      data: { name },
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  revalidatePath(organizationsPath());

  return toActionState("SUCCESS", "Organization name updated");
};
