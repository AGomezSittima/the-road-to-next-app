import EmailWelcome from "@/emails/auth/email-welcome";
import { resend } from "@/lib/resend";

export const sendEmailWelcome = async (username: string, email: string) => {
  return await resend.emails.send({
    from: process.env.FROM_EMAIL,
    to: email,
    subject: "Welcome to TicketBounty!",
    react: <EmailWelcome toName={username} />,
  });
};
