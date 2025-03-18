import { getAuth } from "@/features/auth/queries/get-auth";
import { isOwner } from "@/features/auth/utils/is-owner";
import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";

import { ParsedSearchParams } from "../search-params";

export const getTickets = async (
  userId: string | undefined,
  searchParams: ParsedSearchParams,
) => {
  const { user } = await getAuth();

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
    list: tickets.map((ticket) => ({
      ...ticket,
      isOwner: isOwner(user, ticket),
    })),
    metadata: { count, hasNextPage: count > skip + take },
  };
};
