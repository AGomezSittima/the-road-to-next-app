import { Section, Text } from "@react-email/components";

import EmailLayout from "../components/email-layout";

type EmailVerificationProps = {
  toName: string;
  code: string;
};

const EmailVerification = ({ toName, code }: EmailVerificationProps) => {
  return (
    <EmailLayout
      title="Email Verification"
      preview="TicketBounty email verification code"
    >
      <Section>
        <Text>
          Hello <strong className="font-bold">{toName}</strong>,
        </Text>
        <Text>
          Please verify your email address by using the following code:
        </Text>
      </Section>
      <Section className="text-center">
        <Text className="m-2 self-center rounded bg-purple-700 p-2 text-center text-white">
          {code}
        </Text>
      </Section>
    </EmailLayout>
  );
};

EmailVerification.PreviewProps = {
  toName: "Max Power",
  code: "ABCDEFGH",
};

export default EmailVerification;
