export const appConfig = {
  cookiesKeys: { toast: "toast", authSession: "auth_session" },
  paramsKeys: {
    ticketSearch: "search",
    ticketSortKey: "sortKey",
    ticketSortOrder: "sortOrder",
  },
  authSessions: {
    expirationTimeInMS: 1000 * 60 * 30, // 30 minutes
    refreshIntervalRatio: 0.5, // Half of the expiration date
  },
  debounceDuration: 250, // 250 ms
  comments: { commentsPerPage: 2 },
} as const;
