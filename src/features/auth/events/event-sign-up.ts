import { sendEmailWelcome } from "@/features/auth/emails/send-email-welcome";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";

import { getUserByIdOrThrow } from "../queries/get-user";
import * as authService from "../service";

export type SignUpEventArgs = {
  data: {
    userId: string;
  };
};

export const sendVerificationEmailFunction = inngest.createFunction(
  { id: "send-verification-email" },
  { event: appConfig.events.names.signUp },
  async ({ event }) => {
    const { userId } = event.data;

    const user = await getUserByIdOrThrow(userId);

    const result = authService.sendVerificationEmail(user);

    return { event, body: result };
  },
);

export const sendWelcomeEmailFunction = inngest.createFunction(
  { id: "send-welcome-email" },
  { event: appConfig.events.names.signUp },
  async ({ event, step }) => {
    await step.sleep("wait", appConfig.events.delays.welcomeEmailDelayInMS);
    await step.run("send-email", async () => {
      const { userId } = event.data;

      const user = await getUserByIdOrThrow(userId);

      const result = await sendEmailWelcome(user.username, user.email);

      if (result.error) {
        throw new Error(`${result.error.name}: ${result.error.message}`);
      }

      return { event, body: result };
    });
  },
);

export const proccessInvitationsFunction = inngest.createFunction(
  { id: "proccess-invitations" },
  { event: appConfig.events.names.signUp },
  async ({ event }) => {
    const { userId } = event.data;

    const user = await getUserByIdOrThrow(userId);

    // TODO: Extract to DAL
    const invitations = await prisma.invitation.findMany({
      where: { email: user.email, status: "ACCEPTED_WITHOUT_ACCOUNT" },
    });

    if (invitations.length === 0) {
      return { event, body: "No invitations to process" };
    }

    // TODO: Extract to DAL
    await prisma.$transaction([
      prisma.invitation.deleteMany({
        where: { email: user.email, status: "ACCEPTED_WITHOUT_ACCOUNT" },
      }),
      prisma.membership.createMany({
        data: invitations.map((invitation) => ({
          userId: user.id,
          organizationId: invitation.organizationId,
          role: "MEMBER",
          isActive: false,
        })),
      }),
    ]);

    return { event, body: `${invitations.length} invitations processed` };
  },
);
