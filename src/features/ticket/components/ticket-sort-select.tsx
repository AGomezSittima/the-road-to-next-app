"use client";

import { useQueryStates } from "nuqs";

import { SortSelect, SortSelectOption } from "@/components/sort-select";
import { appConfig } from "@/utils/app-config";

import { sortOptions, sortParser } from "../search-params";

type TicketSortSelectProps = {
  options: SortSelectOption[];
};

const TicketSortSelect = ({ options }: TicketSortSelectProps) => {
  const [sort, setSort] = useQueryStates(sortParser, sortOptions);

  const handleSort = (sortKey: string, sortOrder: string) => {
    setSort({
      [appConfig.paramsKeys.ticketSortKey]: sortKey,
      [appConfig.paramsKeys.ticketSortOrder]: sortOrder,
    });
  };

  return (
    <SortSelect
      options={options}
      value={{
        sortKey: sort[appConfig.paramsKeys.ticketSortKey],
        sortOrder: sort[appConfig.paramsKeys.ticketSortOrder],
      }}
      onChange={handleSort}
    />
  );
};

export { TicketSortSelect };
