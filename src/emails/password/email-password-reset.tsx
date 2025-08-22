import { Button, Section, Text } from "@react-email/components";

import EmailLayout from "../components/email-layout";

type EmailPasswordResetProps = {
  toName: string;
  url: string;
};

const EmailPasswordReset = ({ toName, url }: EmailPasswordResetProps) => {
  return (
    <EmailLayout
      title="Reset your Password"
      preview="TicketBounty reset your password"
    >
      <Section>
        <Text>
          Hello <strong className="font-bold">{toName}</strong>,
        </Text>
        <Text>
          Someone recently requested a password change for your TicketBounty
          account. If it was you, you can set a new password here:
        </Text>
      </Section>
      <Section className="text-center">
        <Button
          href={url}
          className="m-2 self-center rounded bg-purple-700 p-2 text-center text-white"
        >
          Reset Password
        </Button>
      </Section>
      <Section>
        <Text>
          If you don&apos;t want to change your password or didn&apos;t request
          this, just ignore and delete this message.
        </Text>
      </Section>
    </EmailLayout>
  );
};

EmailPasswordReset.PreviewProps = {
  toName: "Max Power",
  url: "https://localhost:3000/password-reset/abc123",
} as EmailPasswordResetProps;

export default EmailPasswordReset;
