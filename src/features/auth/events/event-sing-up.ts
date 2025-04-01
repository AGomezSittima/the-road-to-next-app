import { sendEmailWelcome } from "@/features/auth/emails/send-email-welcome";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";

import { sendEmailVerification } from "../emails/send-email-verification";
import { generateEmailVerificationCode } from "../utils/generate-email-verification-code";

export type SignUpEventArgs = {
  data: {
    userId: string;
  };
};

export const emailVerificationEvent = inngest.createFunction(
  { id: "send-verification-email" },
  { event: appConfig.events.names.signUp },
  async ({ event }) => {
    const { userId } = event.data;

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    const verificationCode = await generateEmailVerificationCode(
      user.id,
      user.email,
    );

    const result = await sendEmailVerification(
      user.username,
      user.email,
      verificationCode,
    );

    if (result.error) {
      throw new Error(`${result.error.name}: ${result.error.message}`);
    }

    return { event, body: result };
  },
);

export const emailWelcomeEvent = inngest.createFunction(
  { id: "send-welcome-email" },
  { event: appConfig.events.names.signUp },
  async ({ event, step }) => {
    await step.sleep("wait", appConfig.events.delays.welcomeEmailDelayInMS);
    await step.run("send-email", async () => {
      const { userId } = event.data;

      const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
      });

      const result = await sendEmailWelcome(user.username, user.email);

      if (result.error) {
        throw new Error(`${result.error.name}: ${result.error.message}`);
      }

      return { event, body: result };
    });
  },
);
