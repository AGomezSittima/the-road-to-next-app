import { sendEmailPasswordReset } from "@/features/auth/emails/send-email-password-reset";
import { inngest } from "@/lib/inngest";
import { appConfig } from "@/utils/app-config";

import { getUserByIdOrThrow } from "../queries/get-user";
import * as authService from "../service";

export type PasswordResetEventArgs = {
  data: {
    userId: string;
  };
};

export const sendPasswordResetEmailFunction = inngest.createFunction(
  { id: "send-password-reset-email" },
  { event: appConfig.events.names.passwordReset },
  async ({ event }) => {
    const { userId } = event.data;

    const user = await getUserByIdOrThrow(userId);

    const passwordResetLink = await authService.generatePasswordResetLink(
      user.id,
    );

    const result = await sendEmailPasswordReset(
      user.username,
      user.email,
      passwordResetLink,
    );

    if (result.error) {
      throw new Error(`${result.error.name}: ${result.error.message}`);
    }

    return { event, body: result };
  },
);
