import { EventSchemas, Inngest } from "inngest";

import { AttachmentDeletedEventArgs } from "@/features/attachments/events/event-attachment-deleted";
import { PasswordResetEventArgs } from "@/features/auth/events/event-password-reset";
import { SignUpEventArgs } from "@/features/auth/events/event-sign-up";
import { InvitationCreatedEventArgs } from "@/features/invitations/events/event-invitation-created";
import { S3ObjectsCleanupEventArgs } from "@/features/s3/events/event-s3-objects-cleanup";
import { appConfig } from "@/utils/app-config";

type Events = {
  [appConfig.events.names.signUp]: SignUpEventArgs;
  [appConfig.events.names.passwordReset]: PasswordResetEventArgs;
  [appConfig.events.names.invitationCreated]: InvitationCreatedEventArgs;
  [appConfig.events.names.attachmentDeleted]: AttachmentDeletedEventArgs;
  [appConfig.events.names.s3ObjectsCleanup]: S3ObjectsCleanupEventArgs;
};

export const inngest = new Inngest({
  id: "the-road-to-next",
  schemas: new EventSchemas().fromRecord<Events>(),
});
