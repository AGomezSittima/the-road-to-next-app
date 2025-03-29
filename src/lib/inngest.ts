import { EventSchemas, Inngest } from "inngest";

import { PasswordResetEventArgs } from "@/features/auth/events/event-password-reset";
import { SignUpEventArgs } from "@/features/auth/events/event-sing-up";
import { appConfig } from "@/utils/app-config";

type Events = {
  [appConfig.events.names.signUp]: SignUpEventArgs;
  [appConfig.events.names.passwordReset]: PasswordResetEventArgs;
};

export const inngest = new Inngest({
  id: "the-road-to-next",
  schemas: new EventSchemas().fromRecord<Events>(),
});
