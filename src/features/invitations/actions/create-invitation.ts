"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import { prisma } from "@/lib/prisma";
import { invitationsPath } from "@/utils/paths";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";

const createInvitationSchema = z.object({
  email: z.string().min(1, { message: "Is required" }).max(191).email(),
});

export const createInvitation = async (
  organizationId: string,
  _actionState: ActionState,
  formData: FormData,
) => {
  await getAdminOrRedirect(organizationId);

  try {
    const { email } = createInvitationSchema.parse(
      Object.fromEntries(formData),
    );

    const targetMembership = await prisma.membership.findFirst({
      where: { organizationId, user: { email } },
    });

    if (targetMembership) {
      return toActionState(
        "ERROR",
        "User is already a member of this organization",
      );
    }

    // TODO: Create invite link
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(invitationsPath(organizationId));

  return toActionState("SUCCESS", "User invited to organization");
};
