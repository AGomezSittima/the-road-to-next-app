import { sendEmailWelcome } from "@/features/emails/send-email-welcome";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";

export type SignUpEventArgs = {
  data: {
    userId: string;
  };
};

export const singUpFunction = inngest.createFunction(
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
