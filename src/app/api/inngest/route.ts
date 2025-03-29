import { serve } from "inngest/next";

import { passwordResetFunction } from "@/features/auth/events/event-password-reset";
import { singUpFunction } from "@/features/auth/events/event-sing-up";
import { inngest } from "@/lib/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [singUpFunction, passwordResetFunction],
});
