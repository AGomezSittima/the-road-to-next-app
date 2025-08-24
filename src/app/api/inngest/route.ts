import { serve } from "inngest/next";

import { passwordResetEvent } from "@/features/auth/events/event-password-reset";
import {
  emailVerificationEvent,
  emailWelcomeEvent,
  proccessInvitationsEvent,
} from "@/features/auth/events/event-sing-up";
import { invitationCreatedEvent } from "@/features/invitations/events/event-invitation-created";
import { inngest } from "@/lib/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    emailWelcomeEvent,
    emailVerificationEvent,
    proccessInvitationsEvent,
    passwordResetEvent,
    invitationCreatedEvent,
  ],
});
