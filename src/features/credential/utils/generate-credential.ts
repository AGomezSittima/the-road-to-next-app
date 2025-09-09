import { prisma } from "@/lib/prisma";
import { generateRandomToken, hashToken } from "@/utils/crypto";

export const generateCredential = async (
  organizationId: string,
  name: string,
) => {
  const secret = generateRandomToken();
  const secretHash = hashToken(secret);

  await prisma.credential.create({
    data: {
      organizationId,
      name,
      secretHash,
    },
  });

  return secret;
};
