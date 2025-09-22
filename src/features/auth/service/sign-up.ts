import { hashPassword } from "@/features/auth/lib/password";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";
import { Prisma } from "@prisma/client";

export const signUp = async (
  password: string,
  data: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  },
) => {
  let user = null;

  try {
    const passwordHash = await hashPassword(password);

    user = await prisma.user.create({
      data: {
        ...data,
        passwordHash,
      },
    });

    await inngest.send({
      name: appConfig.events.names.signUp,
      data: { userId: user.id },
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
