export const homePath = () => "/";

export const pricingPath = () => "/pricing";

export const ticketsPath = () => "/tickets";
export const ticketsByOrganizationPath = () => `${ticketsPath()}/organization`;
export const ticketPath = (ticketId: string) => `${ticketsPath()}/${ticketId}`;
export const ticketEditPath = (ticketId: string) =>
  `${ticketPath(ticketId)}/edit`;

export const signUpPath = () => "/sign-up";
export const signInPath = () => "/sign-in";

export const emailVerificationPath = () => "/email-verification";
export const emailInvitationPath = () => "/email-invitation";

export const passwordForgotPath = () => "/password-forgot";
export const passwordResetPath = () => "/password-reset";

const accountPath = () => "/account";
export const accountProfilePath = () => `${accountPath()}/profile`;
export const accountPasswordPath = () => `${accountPath()}/password`;

export const onboardingPath = () => "/onboarding";
export const selectActiveOrganizationPath = () =>
  "/onboarding/select-active-organization";

export const organizationsPath = () => "/organization";
export const organizationCreatePath = () => `${organizationsPath()}/create`;
export const membershipsPath = (organizationId: string) =>
  `${organizationsPath()}/${organizationId}/memberships`;
export const invitationsPath = (organizationId: string) =>
  `${organizationsPath()}/${organizationId}/invitations`;
export const credentialsPath = (organizationId: string) =>
  `${organizationsPath()}/${organizationId}/credentials`;
export const subscriptionPath = (organizationId: string) =>
  `${organizationsPath()}/${organizationId}/subscription`;

export const attachmentDownloadUrl = (attachmentId: string) =>
  `/api/files/attachments/${attachmentId}`;
