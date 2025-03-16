"use client";

import { useQueryStates } from "nuqs";

import { sortOptions, sortParser } from "@/features/ticket/search-params";
import { appConfig } from "@/utils/app-config";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Option = {
  label: string;
  sortKey: string;
  sortOrder: string;
};

type SortSelectProps = {
  options: Option[];
};

const SortSelect = ({ options }: SortSelectProps) => {
  const [sort, setSort] = useQueryStates(sortParser, sortOptions);

  const handleSort = (compositeKey: string) => {
    const [sortKey, sortOrder] = compositeKey.split("_");

    setSort({
      [appConfig.paramsKeys.ticketSortKey]: sortKey,
      [appConfig.paramsKeys.ticketSortOrder]: sortOrder,
    });
  };

  return (
    <Select
      onValueChange={handleSort}
      defaultValue={sort.sortKey + "_" + sort.sortOrder}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.sortKey + option.sortOrder}
            value={option.sortKey + "_" + option.sortOrder}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export { SortSelect };
