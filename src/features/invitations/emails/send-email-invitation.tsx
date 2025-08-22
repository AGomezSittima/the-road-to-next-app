import EmailInvitation from "@/emails/invitations/email-invitation";
import { resend } from "@/lib/resend";
import { appConfig } from "@/utils/app-config";

export const sendEmailInvitation = async (
  username: string,
  organizationName: string,
  email: string,
  emailInvitationLink: string,
) => {
  return await resend.emails.send({
    from: appConfig.emails.app,
    to: email,
    subject: `Invitation to ${organizationName} from TicketBounty`,
    react: (
      <EmailInvitation
        fromUser={username}
        fromOrganization={organizationName}
        url={emailInvitationLink}
      />
    ),
  });
};
