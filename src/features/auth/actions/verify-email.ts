"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { setCookieByKey } from "@/actions/cookies";
import { setSessionTokenCookie } from "@/features/auth/lib/cookies";
import { createSession } from "@/features/auth/lib/session";
import { appConfig } from "@/utils/app-config";
import { generateRandomToken } from "@/utils/crypto";
import { ticketsPath } from "@/utils/paths";
import { ActionState, fromErrorToActionState } from "@/utils/to-action-state";

import { getAuthOrRedirect } from "../queries/get-auth-or-redirect";
import * as authService from "../service";

const verifyEmailSchema = z.object({
  code: z.string().length(appConfig.crypto.emailVerificationCodeLength, {
    message: `Code must be exactly ${appConfig.crypto.emailVerificationCodeLength} characters`,
  }),
});

export const verifyEmail = async (
  _actionState: ActionState,
  formData: FormData,
) => {
  const { user } = await getAuthOrRedirect({
    checkEmailVerified: false,
    checkOrganization: false,
    checkActiveOrgananization: false,
  });

  try {
    const { code } = verifyEmailSchema.parse(Object.fromEntries(formData));

    await authService.verifyEmail(code, user);

    const sessionToken = generateRandomToken();
    const session = await createSession(sessionToken, user.id);

    await setSessionTokenCookie(sessionToken, session.expiresAt);
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  await setCookieByKey(appConfig.cookiesKeys.toast, "Email verified");

  redirect(ticketsPath());
};
