"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

import { appConfig } from "@/utils/app-config";

import { Input } from "./ui/input";

type SearchInputProps = {
  placeholder: string;
};

const SearchInput = ({ placeholder }: SearchInputProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const params = new URLSearchParams(searchParams);

      if (value) {
        params.set(appConfig.paramsKeys.ticketSearch, value);
      } else {
        params.delete(appConfig.paramsKeys.ticketSearch);
      }

      replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    appConfig.debounceDuration,
  );

  return <Input placeholder={placeholder} onChange={handleSearch} />;
};

export { SearchInput };
