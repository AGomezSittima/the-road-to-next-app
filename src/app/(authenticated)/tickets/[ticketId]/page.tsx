import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { Separator } from "@/components/ui/separator";
import { Attachments } from "@/features/attachments/components/attachments";
import { Comments } from "@/features/comment/components/comments/comments";
import { getComments } from "@/features/comment/queries/get-comments";
import { ReferencedTickets } from "@/features/ticket/components/referenced-tickets";
import { TicketItem } from "@/features/ticket/components/ticket-item";
import { getTicket } from "@/features/ticket/queries/get-ticket";
import { homePath } from "@/utils/paths";

type TicketPageProps = {
  params: Promise<{
    ticketId: string;
  }>;
};

const TicketPage = async ({ params }: TicketPageProps) => {
  const { ticketId } = await params;

  const [ticket, paginatedComments] = await Promise.all([
    getTicket(ticketId),
    getComments(ticketId),
  ]);

  if (!ticket) notFound();

  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <Breadcrumbs
        breadcrumbs={[
          { title: "Tickets", href: homePath() },
          { title: ticket.title },
        ]}
      />

      <Separator />

      <div className="flex animate-fade-in-from-top justify-center">
        <TicketItem
          ticket={ticket}
          attachments={
            <Attachments
              entity="TICKET"
              entityId={ticket.id}
              isOwner={ticket.isOwner}
            />
          }
          referencedTickets={<ReferencedTickets ticketId={ticket.id} />}
          comments={
            <Comments
              ticketId={ticket.id}
              paginatedComments={paginatedComments}
            />
          }
          isDetail
        />
      </div>
    </div>
  );
};

export default TicketPage;
