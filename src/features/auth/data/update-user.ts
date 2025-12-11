import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type UpdateUserParams = {
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  passwordHash?: string;
  emailVerified?: boolean;
};

export const updateUser = async ({
  id,
  username,
  firstName,
  lastName,
  passwordHash,
  emailVerified,
}: UpdateUserParams) => {
  try {
    await prisma.user.update({
      where: { id: id },
      data: {
        username: username || undefined,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        passwordHash: passwordHash || undefined,
        emailVerified: emailVerified,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("Username is already in use");
    }

    throw error;
  }
};
