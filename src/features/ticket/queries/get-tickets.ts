"use server";

import { getAuth } from "@/features/auth/queries/get-auth";
import { isOwner } from "@/features/auth/utils/is-owner";
import { getActiveOrganization } from "@/features/organization/queries/get-active-organization";
import { getOrganizationsByUser } from "@/features/organization/queries/get-organization-by-user";
import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";

import { ParsedSearchParams } from "../search-params";

export const getTickets = async (
  userId: string | undefined,
  byOrganization: boolean,
  searchParams: ParsedSearchParams,
) => {
  const { user } = await getAuth();

  const activeOrganization = await getActiveOrganization();

  const where = {
    userId,
    title: { contains: searchParams.search, mode: "insensitive" as const },
    ...(byOrganization && activeOrganization
      ? { organizationId: activeOrganization.id }
      : {}),
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
      include: {
        user: { select: { username: true } },
        organization: {
          include: { memberships: true },
        },
      },
    }),
    // Get count
    prisma.ticket.count({
      where,
    }),
  ]);

  const organizationsByUser = await getOrganizationsByUser();

  return {
    list: tickets.map((ticket) => {
      const isTicketOwner = isOwner(user, ticket);

      const organization = organizationsByUser.find(
        (organization) => organization.id === ticket.organizationId,
      );

      return {
        ...ticket,
        isOwner: isTicketOwner,
        permissions: {
          canDeleteTicket:
            isTicketOwner && !!organization?.membershipByUser.canDeleteTicket,
          canUpdateTicket:
            isTicketOwner && !!organization?.membershipByUser.canUpdateTicket,
        },
      };
    }),
    metadata: { count, hasNextPage: count > skip + take },
  };
};
