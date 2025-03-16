import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";

import { appConfig } from "@/utils/app-config";

export const searchParser = parseAsString
  .withDefault("")
  .withOptions({ shallow: false, clearOnDefault: true });

export const sortParser = {
  [appConfig.paramsKeys.ticketSortKey]: parseAsString.withDefault("createdAt"),
  [appConfig.paramsKeys.ticketSortOrder]: parseAsString.withDefault("desc"),
};

export const paginationParser = {
  page: parseAsInteger.withDefault(0),
  size: parseAsInteger.withDefault(2),
};

export const sortOptions = { shallow: false, clearOnDefault: true };

export const paginationOptions = { shallow: false, clearOnDefault: true };

export const searchParamsCache = createSearchParamsCache({
  [appConfig.paramsKeys.ticketSearch]: searchParser,
  [appConfig.paramsKeys.ticketSortKey]:
    sortParser[appConfig.paramsKeys.ticketSortKey],
  [appConfig.paramsKeys.ticketSortOrder]:
    sortParser[appConfig.paramsKeys.ticketSortOrder],
  ...paginationParser,
});

export type ParsedSearchParams = Awaited<
  ReturnType<typeof searchParamsCache.parse>
>;
