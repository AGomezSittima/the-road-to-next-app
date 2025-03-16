import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";

import { ParsedSearchParams } from "../search-params";

export const getTickets = async (
  userId: string | undefined,
  searchParams: ParsedSearchParams,
) => {
  return await prisma.ticket.findMany({
    where: {
      userId,
      title: { contains: searchParams.search, mode: "insensitive" },
    },
    orderBy: {
      [searchParams[appConfig.paramsKeys.ticketSortKey]]:
        searchParams[appConfig.paramsKeys.ticketSortOrder],
    },
    include: { user: { select: { username: true } } },
  });
};
