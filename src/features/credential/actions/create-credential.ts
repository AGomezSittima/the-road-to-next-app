"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import { credentialsPath } from "@/utils/paths";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";

import { generateCredential } from "../utils/generate-credential";

const createCredentialsSchema = z.object({
  name: z.string().min(1, { message: "Is required" }).max(191),
});

export const createCredential = async (
  organizationId: string,
  _actionState: ActionState,
  formData: FormData,
) => {
  const { user } = await getAdminOrRedirect(organizationId);

  let secret;
  try {
    const { name } = createCredentialsSchema.parse(
      Object.fromEntries(formData),
    );

    secret = await generateCredential(user.id, organizationId, name);
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  revalidatePath(credentialsPath(organizationId));

  return toActionState(
    "SUCCESS",
    `Copy the secret, we will not show it again: ${secret}`,
  );
};
