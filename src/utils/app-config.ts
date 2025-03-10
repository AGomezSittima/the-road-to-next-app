export const appConfig = {
  cookiesKeys: { toast: "toast", authSession: "auth_session" },
  authSessions: {
    expirationTimeInMS: 1000 * 60 * 30, // 30 minutes
    refreshIntervalRatio: 0.5, // Half of the expiration date
  },
} as const;
