"use client";

import { useDebouncedCallback } from "use-debounce";

import { appConfig } from "@/utils/app-config";

import { Input } from "./ui/input";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

const SearchInput = ({ value, onChange, placeholder }: SearchInputProps) => {
  const handleSearch = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      onChange(value);
    },
    appConfig.debounceDuration,
  );

  return (
    <Input
      defaultValue={value}
      placeholder={placeholder}
      onChange={handleSearch}
    />
  );
};

export { SearchInput };
