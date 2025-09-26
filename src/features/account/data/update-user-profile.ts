import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type UpdateUserProfileParams = {
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
};

export const updateUserProfile = async ({
  id,
  username,
  firstName,
  lastName,
}: UpdateUserProfileParams) => {
  try {
    await prisma.user.update({
      where: { id: id },
      data: {
        username: username || undefined,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
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
