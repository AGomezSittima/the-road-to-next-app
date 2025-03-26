import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type EmailPasswordResetProps = {
  toName: string;
  url: string;
};

const EmailPasswordReset = ({ toName, url }: EmailPasswordResetProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="m-8 font-sans">
          <Preview>TicketBounty reset your password</Preview>
          <Heading className="text-center text-xl font-bold">
            TicketBounty
          </Heading>
          <Section>
            <Row>
              <Column className="h-[2px] w-1/3 rounded-l bg-black/10" />
              <Column className="h-[2px] w-1/3 rounded bg-purple-700" />
              <Column className="h-[2px] w-1/3 rounded-r bg-black/10" />
            </Row>
          </Section>
          <Container>
            <Section>
              <Text>
                Hello <strong className="font-bold">{toName}</strong>,
              </Text>
              <Text>
                Someone recently requested a password change for your
                TicketBounty account. If it was you, you can set a new password
                here:
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
                If you don&apos;t want to change your password or didn&apos;t
                request this, just ignore and delete this message.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

EmailPasswordReset.PreviewProps = {
  toName: "Max Power",
  url: "https://localhost:3000/password-reset/abc123",
};

export default EmailPasswordReset;
