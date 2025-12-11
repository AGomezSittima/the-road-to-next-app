import { serve } from "inngest/next";

import { deleteAttachmentFromS3Function } from "@/features/attachments/events/event-attachment-deleted";
import { sendPasswordResetEmailFunction } from "@/features/auth/events/event-password-reset";
import {
  proccessInvitationsFunction,
  sendVerificationEmailFunction,
  sendWelcomeEmailFunction,
} from "@/features/auth/events/event-sign-up";
import {
  filesCleanupFunction,
  periodicFilesCleanupFunction,
} from "@/features/files/events/event-files-cleanup";
import { sendInvitationEmailFunction } from "@/features/invitations/events/event-invitation-created";
import { createStripeCustomerFunction } from "@/features/organization/events/event-organization-created";
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
    periodicFilesCleanupFunction,
    filesCleanupFunction,
  ],
});
