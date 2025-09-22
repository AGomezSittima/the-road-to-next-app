import { inngest } from "@/lib/inngest";
import { appConfig } from "@/utils/app-config";
import { User } from "@prisma/client";

import { verifyPasswordHash } from "../lib/password";

const ERROR_INVALID_USER = "Incorrect password";

export const changePassword = async (password: string, user: User) => {
  const validPassword = await verifyPasswordHash(user.passwordHash, password);

  if (!validPassword) {
    throw new Error(ERROR_INVALID_USER);
  }

  await inngest.send({
    name: appConfig.events.names.passwordReset,
    data: { userId: user.id },
  });
};
