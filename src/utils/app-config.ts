export const appConfig = {
  cookiesKeys: { toast: "toast", authSession: "auth_session" },
  paramsKeys: {
    ticketSearch: "search",
    ticketSortKey: "sortKey",
    ticketSortOrder: "sortOrder",
    ticketOnlyActiveOrganization: "onlyActiveOrganization",
  },
  authSessions: {
    expirationTimeInMs: 1000 * 60 * 30, // 30 minutes
    refreshIntervalRatio: 0.5, // Half of the expiration date
  },
  emailVerification: {
    expirationTimeInMs: 1000 * 60 * 15, // 15 minutes
    emailResendIntervalInSeconds: 60, // 30 seconds
  },
  passwordReset: {
    expirationTimeInMs: 1000 * 60 * 60 * 2, // 2 hours
  },
  debounce: {
    sm: 150, // 150ms
    md: 250, // 250ms
    lg: 500, // 500ms
  },
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
      organizationCreated: "app/organization.created",
      invitationCreated: "app/invitations.invitation-created",
      attachmentDeleted: "app/attachments.attachment-deleted",
      filesCleanup: "app/files.cleanup",
    },
  },
  emails: {
    app: "no-reply@app.agomezsittima.org",
  },
  crypto: {
    emailVerificationCodeLength: 8,
  },
  aws: {
    s3: {
      presignedUrlExpirationInSeconds: 5 * 60, // 5 minutes
    },
  },
} as const;
