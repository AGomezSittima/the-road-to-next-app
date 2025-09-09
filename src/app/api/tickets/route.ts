import { getTickets } from "@/features/ticket/queries/get-tickets";
import { searchParamsCache } from "@/features/ticket/search-params";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const untypedSearchParams = Object.fromEntries(searchParams);

  const typedSearchParams = searchParamsCache.parse(untypedSearchParams);

  const { list, metadata } = await getTickets(
    undefined,
    false,
    typedSearchParams,
  );

  return Response.json({ list, metadata });
}

export async function DELETE(
  { headers }: Request,
  { params }: { params: Promise<{ ticketId: string }> },
) {
  const { ticketId } = await params;

  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });

  if (!ticket) {
    return Response.json({ error: "Ticket not found" }, { status: 404 });
  }

  await prisma.ticket.delete({
    where: {
      id: ticketId,
    },
  });

  return Response.json({ ticketId });
}
