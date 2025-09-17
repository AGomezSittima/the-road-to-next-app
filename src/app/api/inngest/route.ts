import { serve } from "inngest/next";

import { deleteAttachmentFromS3Function } from "@/features/attachments/events/event-attachment-deleted";
import { sendPasswordResetEmailFunction } from "@/features/auth/events/event-password-reset";
import {
  sendVerificationEmailFunction,
  sendWelcomeEmailFunction,
  proccessInvitationsFunction,
} from "@/features/auth/events/event-sign-up";
import { sendInvitationEmailFunction } from "@/features/invitations/events/event-invitation-created";
import { createStripeCustomerFunction } from "@/features/organization/events/event-organization-created";
import {
  periodicS3ObjectsCleanupFunction,
  s3ObjectsCleanupFunction,
} from "@/features/s3/events/event-s3-objects-cleanup";
import { inngest } from "@/lib/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    sendWelcomeEmailFunction,
    sendVerificationEmailFunction,
    createStripeCustomerFunction,
    proccessInvitationsFunction,
    sendPasswordResetEmailFunction,
    sendInvitationEmailFunction,
    deleteAttachmentFromS3Function,
    periodicS3ObjectsCleanupFunction,
    s3ObjectsCleanupFunction,
  ],
});
