import { serve } from "inngest/next";

import { passwordResetEvent } from "@/features/auth/events/event-password-reset";
import {
  emailVerificationEvent,
  emailWelcomeEvent,
} from "@/features/auth/events/event-sing-up";
import { inngest } from "@/lib/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [emailWelcomeEvent, emailVerificationEvent, passwordResetEvent],
});
