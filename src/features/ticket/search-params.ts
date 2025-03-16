import { createSearchParamsCache, parseAsString } from "nuqs/server";

import { appConfig } from "@/utils/app-config";

export const searchParser = parseAsString
  .withDefault("")
  .withOptions({ shallow: false, clearOnDefault: true });
export const sortParser = parseAsString
  .withDefault("newest")
  .withOptions({ shallow: false, clearOnDefault: true });

export const searchParamsCache = createSearchParamsCache({
  [appConfig.paramsKeys.ticketSearch]: searchParser,
  [appConfig.paramsKeys.ticketSort]: sortParser,
});

export type ParsedSearchParams = Awaited<
  ReturnType<typeof searchParamsCache.parse>
>;
