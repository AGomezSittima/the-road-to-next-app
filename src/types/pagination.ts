export type PaginationMetadata = {
  count: number;
  hasNextPage: boolean;
  cursor?: string;
};

export type PaginatedData<T> = {
  list: T[];
  metadata: PaginationMetadata;
};
