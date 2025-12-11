import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type UserData = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
};

export const createUser = async (data: UserData, passwordHash: string) => {
  let user = null;
  try {
    user = await prisma.user.create({
      data: {
        ...data,
        passwordHash,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("Either email or username is already in use");
    }

    throw error;
  }

  return user;
};
