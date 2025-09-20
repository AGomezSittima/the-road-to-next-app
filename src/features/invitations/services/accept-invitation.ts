import { getUserByEmail } from "@/features/auth/queries/get-user";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/utils/crypto";

import { getInvitationByTokenHash } from "../queries/get-invitation";

export const acceptInvitation = async (tokenId: string) => {
  const tokenHash = hashToken(tokenId);

  const invitation = await getInvitationByTokenHash(tokenHash);

  if (!invitation) {
    throw new Error("Revoked or invalid invitation token");
  }

  const user = await getUserByEmail(invitation.email);

  // TODO: Invitation Data Layer
  // TODO:  Membership Service Layer
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
    await prisma.invitation.update({
      where: { tokenHash },
      data: { status: "ACCEPTED_WITHOUT_ACCOUNT" },
    });
  }
};
