import { prisma } from "@/lib/prisma";

import { getAuth } from "./get-auth";

// TODO: Create a User DTO only with essential information
export const getUserByEmail = async (email: string) => {
  await getAuth();

  return await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      username: true,
      email: true,
      firstName: true,
      lastName: true,
    },
  });
};
