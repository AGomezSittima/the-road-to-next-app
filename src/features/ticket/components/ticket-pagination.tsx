"use client";

import { useQueryState, useQueryStates } from "nuqs";
import { useEffect, useRef } from "react";

import { Pagination } from "@/components/pagination";
import { PaginationMetadata } from "@/lib/types";
import { appConfig } from "@/utils/app-config";

import {
  paginationOptions,
  paginationParser,
  searchParser,
} from "../search-params";

type TicketPaginationProps = {
  paginatedTicketMetadata: PaginationMetadata;
};

const TicketPagination = ({
  paginatedTicketMetadata,
}: TicketPaginationProps) => {
  const [pagination, setPagination] = useQueryStates(
    paginationParser,
    paginationOptions,
  );

  const [search] = useQueryState(
    appConfig.paramsKeys.ticketSearch,
    searchParser,
  );
  const prevSearch = useRef(search);

  useEffect(() => {
    if (search === prevSearch.current) return;

    prevSearch.current = search;

    setPagination({ ...pagination, page: 0 });
  }, [search, pagination, setPagination]);

  return (
    <Pagination
      pagination={pagination}
      onPagination={setPagination}
      paginatedMetadata={paginatedTicketMetadata}
    />
  );
};

export { TicketPagination };
