import { notFound } from "next/navigation";

import { CardCompact } from "@/components/card-compact";
import { getAuth } from "@/features/auth/queries/get-auth";
import { isOwner } from "@/features/auth/utils/is-owner";
import { TicketUpsertForm } from "@/features/ticket/components/ticket-upsert-form";
import { getTicket } from "@/features/ticket/queries/get-ticket";

type TicketEditPageProps = {
  params: Promise<{
    ticketId: string;
  }>;
};

const TicketUpdatePage = async ({ params }: TicketEditPageProps) => {
  const { user } = await getAuth();

  const { ticketId } = await params;
  const ticket = await getTicket(ticketId);

  const ticketFound = !!ticket;
  const isTicketOwner = isOwner(user, ticket);

  if (!ticketFound || !isTicketOwner) notFound();

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <CardCompact
        title="Edit Ticket"
        description="Edit an existing ticket"
        className="w-full max-w-[420px] animate-fade-in-from-top"
        content={<TicketUpsertForm ticket={ticket} />}
      />
    </div>
  );
};

export default TicketUpdatePage;
