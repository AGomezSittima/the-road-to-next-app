import { sendEmailPasswordReset } from "@/features/auth/emails/send-email-password-reset";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";

import { generatePasswordResetLink } from "../utils/generate-password-reset-link";

export type PasswordResetEventArgs = {
  data: {
    userId: string;
  };
};

export const passwordResetEvent = inngest.createFunction(
  { id: "send-password-reset" },
  { event: appConfig.events.names.passwordReset },
  async ({ event }) => {
    const { userId } = event.data;

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    const passwordResetLink = await generatePasswordResetLink(user.id);

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
