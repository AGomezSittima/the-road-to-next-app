import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";

import { sendEmailInvitation } from "../emails/send-email-invitation";

export type InvitationCreatedEventArgs = {
  data: {
    userId: string;
    organizationId: string;
    email: string;
    emailInvitationLink: string;
  };
};

export const sendInvitationEmailFunction = inngest.createFunction(
  { id: "send-invitation-email-function" },
  { event: appConfig.events.names.invitationCreated },
  async ({ event }) => {
    const { userId, organizationId, email, emailInvitationLink } = event.data;

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    const organization = await prisma.organization.findUniqueOrThrow({
      where: { id: organizationId },
    });

    const result = await sendEmailInvitation(
      user.username,
      organization.name,
      email,
      emailInvitationLink,
    );

    if (result.error) {
      throw new Error(`${result.error.name}: ${result.error.message}`);
    }

    return { event, body: result };
  },
);
