import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";

import { ParsedSearchParams } from "../search-params";

export const getTickets = async (
  userId: string | undefined,
  searchParams: ParsedSearchParams,
) => {
  const where = {
    userId,
    title: { contains: searchParams.search, mode: "insensitive" as const },
  };
  const skip = searchParams.page * searchParams.size;
  const take = searchParams.size;

  const [tickets, count] = await prisma.$transaction([
    // Get tickets
    prisma.ticket.findMany({
      where,
      skip,
      take,
      orderBy: {
        [searchParams[appConfig.paramsKeys.ticketSortKey]]:
          searchParams[appConfig.paramsKeys.ticketSortOrder],
      },
      include: { user: { select: { username: true } } },
    }),
    // Get count
    prisma.ticket.count({
      where,
    }),
  ]);

  return {
    list: tickets,
    metadata: { count, hasNextPage: count > skip + take },
  };
};
