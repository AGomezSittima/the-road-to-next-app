import { createSearchParamsCache, parseAsString } from "nuqs/server";

import { appConfig } from "@/utils/app-config";

export const searchParamsCache = createSearchParamsCache({
  [appConfig.paramsKeys.ticketSearch]: parseAsString.withDefault(""),
  [appConfig.paramsKeys.ticketSort]: parseAsString.withDefault("newest"),
});

export type ParsedSearchParams = Awaited<
  ReturnType<typeof searchParamsCache.parse>
>;
