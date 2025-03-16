"use client";

import { useQueryState } from "nuqs";
import { useDebouncedCallback } from "use-debounce";

import { searchParser } from "@/features/ticket/search-params";
import { appConfig } from "@/utils/app-config";

import { Input } from "./ui/input";

type SearchInputProps = {
  placeholder: string;
};

const SearchInput = ({ placeholder }: SearchInputProps) => {
  const [search, setSearch] = useQueryState(
    appConfig.paramsKeys.ticketSearch,
    searchParser,
  );

  const handleSearch = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      setSearch(value);
    },
    appConfig.debounceDuration,
  );

  return (
    <Input
      defaultValue={search}
      placeholder={placeholder}
      onChange={handleSearch}
    />
  );
};

export { SearchInput };
