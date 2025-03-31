import { homePath } from "@/utils/paths";
import { getBaseUrl } from "@/utils/url";
import { Button, Section, Text } from "@react-email/components";

import EmailLayout from "../components/email-layout";

type EmailWelcomeProps = {
  toName: string;
};

const EmailWelcome = ({ toName }: EmailWelcomeProps) => {
  const url = getBaseUrl() + homePath();

  return (
    <EmailLayout title="Welcome!" preview="TicketBounty welcome letter">
      <Section>
        <Text>
          Welcome to TicketBounty{" "}
          <strong className="font-bold">{toName}</strong>,
        </Text>
        <Text>
          We are so happy to have you here! With TicketBounty, you can create
          and manage your tickets with ease. As well as completing other
          user&apos;s tickets, getting a reward for it.
        </Text>
      </Section>
      <Section className="text-center">
        <Button
          href={url}
          className="m-2 self-center rounded bg-purple-700 p-2 text-center text-white"
        >
          Get started
        </Button>
      </Section>
      <Section>
        <Text>Kind regards,</Text>
        <Text>The TicketBounty team</Text>
      </Section>
    </EmailLayout>
  );
};

EmailWelcome.PreviewProps = {
  toName: "Max Power",
};

export default EmailWelcome;
