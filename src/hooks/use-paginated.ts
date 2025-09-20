import { PaginatedData } from "@/types/pagination";
import {
  QueryFunction,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";

type UsePaginatedArgs<K> = {
  queryKey: string[];
  queryFn: QueryFunction<K, string[], string | undefined>;
  initialPaginatedData: K;
};

export const usePaginated = <T, K extends PaginatedData<T>>({
  queryKey,
  queryFn,
  initialPaginatedData,
}: UsePaginatedArgs<K>) => {
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey,
      queryFn,
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) =>
        lastPage.metadata.hasNextPage ? lastPage.metadata.cursor : undefined,
      initialData: {
        pages: [initialPaginatedData],
        pageParams: [undefined],
      },
    });

  return {
    queryClient,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    invalidateQueries: () => queryClient.invalidateQueries({ queryKey }),
  };
};
