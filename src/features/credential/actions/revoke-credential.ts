"use server";

import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import { prisma } from "@/lib/prisma";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";

export const revokeCredential = async ({
  credentialId,
  organizationId,
}: {
  credentialId: string;
  organizationId: string;
}) => {
  await getAdminOrRedirect(organizationId);

  try {
    await prisma.credential.update({
      where: { id: credentialId },
      data: {
        revokedAt: new Date(),
      },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  return toActionState("SUCCESS", "Credential revoked");
};
