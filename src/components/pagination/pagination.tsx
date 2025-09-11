import { useTransition } from "react";

import { PaginationMetadata } from "@/types/pagination";

import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { PAGE_SIZES } from "./constants";

type PageAndSize = {
  page: number;
  size: number;
};

type PaginationProps = {
  pagination: PageAndSize;
  onPagination: (pagination: PageAndSize) => void;
  paginatedMetadata: PaginationMetadata;
};

const Pagination = ({
  pagination,
  onPagination,
  paginatedMetadata: { count, hasNextPage },
}: PaginationProps) => {
  const [isPending, startTransition] = useTransition();

  const handleChangeSize = (size: string) => {
    onPagination({ page: 0, size: parseInt(size) });
  };

  const handlePreviousPage = () => {
    startTransition(() => {
      onPagination({ ...pagination, page: pagination.page - 1 });
    });
  };

  const handleNextPage = () => {
    startTransition(() => {
      onPagination({ ...pagination, page: pagination.page + 1 });
    });
  };

  const startOffset = Math.min(pagination.page * pagination.size + 1, count);
  const endOffset = Math.min(startOffset - 1 + pagination.size, count);

  const label = `${startOffset} - ${endOffset} of ${count}`;

  const sizeButton = (
    <Select
      onValueChange={handleChangeSize}
      defaultValue={pagination.size.toString()}
    >
      <SelectTrigger className="h-[36px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PAGE_SIZES.map((size) => (
          <SelectItem key={`page-size-${size}`} value={size.toString()}>
            {size}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const previousButton = (
    <Button
      variant="outline"
      size="sm"
      disabled={pagination.page <= 0 || isPending}
      onClick={handlePreviousPage}
    >
      Previous
    </Button>
  );

  const nextButton = (
    <Button
      variant="outline"
      size="sm"
      disabled={!hasNextPage || isPending}
      onClick={handleNextPage}
    >
      Next
    </Button>
  );

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex gap-x-2">
        {sizeButton}
        {previousButton}
        {nextButton}
      </div>
    </div>
  );
};

export { Pagination };
