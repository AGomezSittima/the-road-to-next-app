import React from "react";

import { Placeholder } from "@/components/placeholder";

import { getTickets } from "../queries/get-tickets";
import { ParsedSearchParams } from "../search-params";
import { TicketItem } from "./ticket-item";
import { TicketOnlyActiveOrganizationSwitch } from "./ticket-only-active-organization-switch";
import { TicketPagination } from "./ticket-pagination";
import { TicketSearchInput } from "./ticket-search-input";
import { TicketSortSelect } from "./ticket-sort-select";

type FilteringOptions = {
  searchFilter?: boolean;
  sortFilter?: boolean;
  onlyActiveOrganizationFilter?: boolean;
};

type TicketListProps = {
  searchParams: ParsedSearchParams;
  userId?: string;
  byOrganization?: boolean;
  filteringOptions?: FilteringOptions;
};

const TicketList = async ({
  userId,
  byOrganization = false,
  filteringOptions = {},
  searchParams,
}: TicketListProps) => {
  const {
    searchFilter = true,
    sortFilter = true,
    onlyActiveOrganizationFilter = true,
  } = filteringOptions;

  const { list: tickets, metadata: ticketMetadata } = await getTickets(
    userId,
    byOrganization,
    searchParams,
  );

  return (
    <div className="flex flex-1 animate-fade-in-from-top flex-col items-center gap-y-4">
      <div className="flex w-full max-w-[420px] items-center gap-x-2">
        {searchFilter && <TicketSearchInput placeholder="Search tickets ..." />}
        {sortFilter && (
          <TicketSortSelect
            options={[
              { label: "Newest", sortKey: "createdAt", sortOrder: "desc" },
              { label: "Oldest", sortKey: "createdAt", sortOrder: "asc" },
              { label: "Bounty", sortKey: "bounty", sortOrder: "desc" },
              { label: "Title", sortKey: "title", sortOrder: "asc" },
            ]}
          />
        )}
        {onlyActiveOrganizationFilter && <TicketOnlyActiveOrganizationSwitch />}
      </div>

      {tickets.length ? (
        tickets.map((ticket) => <TicketItem key={ticket.id} ticket={ticket} />)
      ) : (
        <Placeholder label="No tickets found" />
      )}

      <div className="w-full max-w-[420px]">
        <TicketPagination paginatedTicketMetadata={ticketMetadata} />
      </div>
    </div>
  );
};

export { TicketList };
