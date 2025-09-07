import { LucideArrowUpRightFromSquare } from "lucide-react";
import Link from "next/link";

import { CardCompact } from "@/components/card-compact";
import { ticketPath } from "@/utils/paths";

import { getReferencedTickets } from "../queries/get-referenced-tickets";

type ReferencedTicketsProps = {
  ticketId: string;
};

const ReferencedTickets = async ({ ticketId }: ReferencedTicketsProps) => {
  const referencedTickets = await getReferencedTickets(ticketId);

  if (!referencedTickets.length) return null;

  return (
    <CardCompact
      title="Referenced Tickets"
      description="Tickets that have been referenced in comments"
      content={
        <div className="mx-2 mb-4">
          {referencedTickets.map((referencedTicket) => (
            <div key={referencedTicket.id}>
              <Link
                className="flex items-center gap-x-2 text-sm"
                href={ticketPath(referencedTicket.id)}
              >
                <LucideArrowUpRightFromSquare className="size-4" />
                {referencedTicket.title}
              </Link>
            </div>
          ))}
        </div>
      }
    />
  );
};

export { ReferencedTickets };
