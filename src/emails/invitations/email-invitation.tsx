import { Button, Section, Text } from "@react-email/components";

import EmailLayout from "../components/email-layout";

type EmailInvitationProps = {
  fromUser: string;
  fromOrganization: string;
  url: string;
};

const EmailInvitation = ({
  fromUser,
  fromOrganization,
  url,
}: EmailInvitationProps) => {
  return (
    <EmailLayout
      title="Organization Invitation"
      preview="TicketBounty - You have been invited to join an organization"
    >
      <Section>
        <Text className="text-center">
          <strong className="font-bold">{fromUser}</strong> has invited you to
          join <strong className="font-bold">{fromOrganization}</strong>. Click
          the link below to accept the invitation.
        </Text>
      </Section>
      <Section className="text-center">
        <Button
          href={url}
          className="m-2 self-center rounded bg-purple-700 p-2 text-center text-white"
        >
          Accept Invitation
        </Button>
      </Section>
    </EmailLayout>
  );
};

EmailInvitation.PreviewProps = {
  fromUser: "Max Power",
  fromOrganization: "ACME Corp",
  url: "http://localhost:3000/email-invitation/abc123",
} as EmailInvitationProps;

export default EmailInvitation;
