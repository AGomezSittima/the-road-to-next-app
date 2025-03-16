"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type SortSelectOption = {
  label: string;
  sortKey: string;
  sortOrder: string;
};

type SortObject = {
  sortKey: string;
  sortOrder: string;
};

type SortSelectProps = {
  value: SortObject;
  onChange: (sortKey: string, sortOrder: string) => void;
  options: SortSelectOption[];
};

const SortSelect = ({ value, onChange, options }: SortSelectProps) => {
  const handleSort = (compositeKey: string) => {
    const [sortKey, sortOrder] = compositeKey.split("_");

    onChange(sortKey, sortOrder);
  };

  return (
    <Select
      onValueChange={handleSort}
      defaultValue={value.sortKey + "_" + value.sortOrder}
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

export { SortSelect, type SortSelectOption };
