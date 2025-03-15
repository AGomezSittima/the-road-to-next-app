"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
  value: string;
};

type SortSelectProps = {
  defaultValue: string;
  options: Option[];
};

const SortSelect = ({ defaultValue, options }: SortSelectProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (!value || value === defaultValue) {
      params.delete(appConfig.paramsKeys.ticketSort);
    } else {
      params.set(appConfig.paramsKeys.ticketSort, value);
    }

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Select
      onValueChange={handleSort}
      defaultValue={
        searchParams.get(appConfig.paramsKeys.ticketSort) || defaultValue
      }
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export { SortSelect };
