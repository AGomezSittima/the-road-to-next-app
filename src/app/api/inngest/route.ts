import { serve } from "inngest/next";

import { attachmentDeletedEvent } from "@/features/attachments/events/event-attachment-deleted";
import { passwordResetEvent } from "@/features/auth/events/event-password-reset";
import {
  emailVerificationEvent,
  emailWelcomeEvent,
  proccessInvitationsEvent,
} from "@/features/auth/events/event-sign-up";
import { invitationCreatedEvent } from "@/features/invitations/events/event-invitation-created";
import { organizationDeletedCleanupEvent } from "@/features/organization/events/event-organization-deleted";
import { inngest } from "@/lib/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    emailWelcomeEvent,
    emailVerificationEvent,
    proccessInvitationsEvent,
    passwordResetEvent,
    invitationCreatedEvent,
    attachmentDeletedEvent,
    organizationDeletedCleanupEvent,
  ],
});
