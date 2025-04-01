import EmailVerification from "@/emails/auth/email-verification";
import { resend } from "@/lib/resend";
import { appConfig } from "@/utils/app-config";

export const sendEmailVerification = async (
  username: string,
  email: string,
  verificationCode: string,
) => {
  return await resend.emails.send({
    from: appConfig.emails.app,
    to: email,
    subject: "Email Verification from TicketBounty",
    react: <EmailVerification toName={username} code={verificationCode} />,
  });
};
