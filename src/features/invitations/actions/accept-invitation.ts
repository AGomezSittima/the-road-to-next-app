"use server";

import { redirect } from "next/navigation";

import { setCookieByKey } from "@/actions/cookies";
import { getAuth } from "@/features/auth/queries/get-auth";
import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";
import { hashToken } from "@/utils/crypto";
import { organizationsPath, signInPath } from "@/utils/paths";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";

export const acceptInvitation = async (tokenId: string) => {
  const { user: signedInUser } = await getAuth();

  try {
    const tokenHash = hashToken(tokenId);

    const invitation = await prisma.invitation.findUnique({
      where: { tokenHash },
    });

    if (!invitation) {
      return toActionState("ERROR", "Revoked or invalid invitation token");
    }

    const user = await prisma.user.findUnique({
      where: { email: invitation.email },
    });

    if (user) {
      await prisma.$transaction([
        prisma.invitation.delete({ where: { tokenHash } }),
        prisma.membership.create({
          data: {
            userId: user.id,
            organizationId: invitation.organizationId,
            role: "MEMBER",
            isActive: false,
          },
        }),
      ]);
    } else {
    }

    await setCookieByKey(appConfig.cookiesKeys.toast, "Invitation accepted");
  } catch (error) {
    return fromErrorToActionState(error);
  }

  redirect(signedInUser ? organizationsPath() : signInPath());
};
