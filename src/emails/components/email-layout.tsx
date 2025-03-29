import React from "react";

import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Row,
  Section,
  Tailwind,
} from "@react-email/components";

type EmailLayoutProps = {
  title: string;
  preview: string;
  children: React.ReactNode;
};

const EmailLayout = ({ title, preview, children }: EmailLayoutProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="m-8 font-sans">
          <Preview>{preview}</Preview>
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
            <Heading as="h2" className="text-lg font-bold">
              {title}
            </Heading>
            {children}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailLayout;
