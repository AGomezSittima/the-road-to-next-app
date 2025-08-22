export const appConfig = {
  cookiesKeys: { toast: "toast", authSession: "auth_session" },
  paramsKeys: {
    ticketSearch: "search",
    ticketSortKey: "sortKey",
    ticketSortOrder: "sortOrder",
  },
  authSessions: {
    expirationTimeInMs: 1000 * 60 * 30, // 30 minutes
    refreshIntervalRatio: 0.5, // Half of the expiration date
  },
  emailVerification: {
    expirationTimeInMs: 1000 * 60 * 15, // 15 minutes
  },
  passwordReset: {
    expirationTimeInMs: 1000 * 60 * 60 * 2, // 2 hours
  },
  debounceDuration: 250, // 250 ms
  comments: { commentsPerPage: 2 },
  queryClient: {
    staleTime: 60 * 1000,
  },
  events: {
    delays: {
      welcomeEmailDelayInMS: 1000 * 60 * 30, // 30 minutes
    },
    names: {
      signUp: "app/auth.sign-up",
      passwordReset: "app/auth.password-reset",
      invitationCreated: "app/invitations.invitation-created",
    },
  },
  emails: {
    app: "no-reply@app.agomezsittima.org",
  },
  crypto: {
    emailVerificationCodeLength: 8,
  },
} as const;
