import React from "react";

import { Placeholder } from "@/components/placeholder";
import { SearchInput } from "@/components/search-input";
import { SortSelect } from "@/components/sort-select";

import { getTickets } from "../queries/get-tickets";
import { ParsedSearchParams } from "../search-params";
import { TicketItem } from "./ticket-item";

type TicketListProps = {
  userId?: string;
  searchParams: ParsedSearchParams;
};

const TicketList = async ({ userId, searchParams }: TicketListProps) => {
  const tickets = await getTickets(userId, searchParams);

  return (
    <div className="flex flex-1 animate-fade-in-from-top flex-col items-center gap-y-4">
      <div className="flex w-full max-w-[420px] gap-x-2">
        <SearchInput placeholder="Search tickets ..." />
        <SortSelect
          options={[
            { label: "Newest", sortKey: "createdAt", sortOrder: "desc" },
            { label: "Oldest", sortKey: "createdAt", sortOrder: "asc" },
            { label: "Bounty", sortKey: "bounty", sortOrder: "desc" },
            { label: "Title", sortKey: "title", sortOrder: "asc" },
          ]}
        />
      </div>

      {tickets.length ? (
        tickets.map((ticket) => <TicketItem key={ticket.id} ticket={ticket} />)
      ) : (
        <Placeholder label="No tickets found" />
      )}
    </div>
  );
};

export { TicketList };
