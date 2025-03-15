import { appConfig } from "@/utils/app-config";

export type SearchParams = {
  [appConfig.paramsKeys.ticketSearch]: string | string[] | undefined;
  [appConfig.paramsKeys.ticketSort]: string | string[] | undefined;
};
