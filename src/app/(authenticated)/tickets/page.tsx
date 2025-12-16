import { Metadata } from "next";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";

import { CardCompact } from "@/components/card-compact";
import { Heading } from "@/components/heading";
import { Spinner } from "@/components/spinner";
import { getAuth } from "@/features/auth/queries/get-auth";
import { TicketList } from "@/features/ticket/components/ticket-list";
import { TicketUpsertForm } from "@/features/ticket/components/ticket-upsert-form";
import { searchParamsCache } from "@/features/ticket/search-params";

type TicketsPageProps = {
  searchParams: Promise<SearchParams>;
};

export const metadata: Metadata = {
  title: "My Tickets",
};

const TicketsPage = async ({ searchParams }: TicketsPageProps) => {
  const { user } = await getAuth();

  return (
    <>
      <div className="flex flex-1 flex-col gap-y-8">
        <Heading
          title="My Tickets"
          description="All your tickets in one place"
        />

        <CardCompact
          title="Create Ticket"
          description="A new ticket will be created"
          className="w-full max-w-[420px] self-center"
          content={<TicketUpsertForm />}
        />

        <Suspense fallback={<Spinner />}>
          <TicketList
            searchParams={searchParamsCache.parse(await searchParams)}
            userId={user?.id}
          />
        </Suspense>
      </div>
    </>
  );
};

export default TicketsPage;
