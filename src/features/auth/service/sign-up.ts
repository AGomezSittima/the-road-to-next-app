import { hashPassword } from "@/features/auth/lib/password";
import { inngest } from "@/lib/inngest";
import { appConfig } from "@/utils/app-config";

import * as authDataAccess from "../data";

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

    user = await authDataAccess.createUser(data, passwordHash);

    await inngest.send({
      name: appConfig.events.names.signUp,
      data: { userId: user.id },
    });
  } catch (error) {
    throw error;
  }

  return user;
};
