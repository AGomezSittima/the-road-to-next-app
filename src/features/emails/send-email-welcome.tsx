import EmailWelcome from "@/emails/app/email-welcome";
import { resend } from "@/lib/resend";
import { appConfig } from "@/utils/app-config";

export const sendEmailWelcome = async (username: string, email: string) => {
  return await resend.emails.send({
    from: appConfig.emails.app,
    to: email,
    subject: "Welcome to TicketBounty!",
    react: <EmailWelcome toName={username} />,
  });
};
