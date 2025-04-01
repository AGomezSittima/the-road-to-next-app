import EmailPasswordReset from "@/emails/password/email-password-reset";
import { resend } from "@/lib/resend";
import { appConfig } from "@/utils/app-config";

export const sendEmailPasswordReset = async (
  username: string,
  email: string,
  passwordResetLink: string,
) => {
  return await resend.emails.send({
    from: appConfig.emails.app,
    to: email,
    subject: "Password Reset from TicketBounty",
    react: <EmailPasswordReset toName={username} url={passwordResetLink} />,
  });
};
