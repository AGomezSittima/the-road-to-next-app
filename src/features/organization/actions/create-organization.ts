"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { setCookieByKey } from "@/actions/cookies";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { appConfig } from "@/utils/app-config";
import { membershipsPath, ticketsPath } from "@/utils/paths";
import { ActionState, fromErrorToActionState } from "@/utils/to-action-state";

import * as organizationService from "../service";

const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Is required" })
    .max(191, { message: "Too many characters (max 191 characters)" }),
});

export const createOrganization = async (
  _actionState: ActionState,
  formData: FormData,
) => {
  const { user } = await getAuthOrRedirect({
    checkOrganization: false,
    checkActiveOrgananization: false,
  });

  let organization;
  try {
    const { name } = createOrganizationSchema.parse(
      Object.fromEntries(formData),
    );

    organization = await organizationService.createOrganization(
      user.id,
      name,
      user.email,
    );
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  await setCookieByKey(
    appConfig.cookiesKeys.toast,
    JSON.stringify({
      message: "Organization created",
      link: membershipsPath(organization.id),
    }),
  );

  redirect(ticketsPath());
};
