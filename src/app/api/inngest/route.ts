import { serve } from "inngest/next";

import { attachmentDeletedEvent } from "@/features/attachments/events/event-attachment-deleted";
import { passwordResetEvent } from "@/features/auth/events/event-password-reset";
import {
  emailVerificationEvent,
  emailWelcomeEvent,
  proccessInvitationsEvent,
} from "@/features/auth/events/event-sign-up";
import { invitationCreatedEvent } from "@/features/invitations/events/event-invitation-created";
import { organizationCreatedEvent } from "@/features/organization/events/event-organization-created";
import {
  periodicS3ObjectsCleanup,
  s3ObjectsCleanupOnDependencyDeletedEvent,
} from "@/features/s3/events/event-s3-objects-cleanup";
import { inngest } from "@/lib/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    emailWelcomeEvent,
    emailVerificationEvent,
    organizationCreatedEvent,
    proccessInvitationsEvent,
    passwordResetEvent,
    invitationCreatedEvent,
    attachmentDeletedEvent,
    periodicS3ObjectsCleanup,
    s3ObjectsCleanupOnDependencyDeletedEvent,
  ],
});
