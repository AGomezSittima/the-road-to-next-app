"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import * as authDataAccess from "@/features/auth/data";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { accountProfilePath } from "@/utils/paths";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";

const updateProfileSchema = z
  .object({
    username: z
      .string()
      .max(191, { message: "Too many characters (max 191 characters)" })
      .refine(
        (value) => !value.includes(" "),
        "Username cannot contain spaces",
      ),
    firstName: z
      .string()
      .max(191, { message: "Too many characters (max 191 characters)" }),
    lastName: z
      .string()
      .max(191, { message: "Too many characters (max 191 characters)" }),
  })
  .superRefine(({ username, firstName, lastName }, ctx) => {
    if (!username && !firstName && !lastName) {
      ctx.addIssue({
        code: "custom",
        message: "At least one field should not be empty",
      });
    }
  });

export const updateProfile = async (
  _actionState: ActionState,
  formData: FormData,
) => {
  const { user } = await getAuthOrRedirect();

  try {
    const { username, firstName, lastName } = updateProfileSchema.parse(
      Object.fromEntries(formData),
    );

    await authDataAccess.updateUser({
      id: user.id,
      username,
      firstName,
      lastName,
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  revalidatePath(accountProfilePath());

  return toActionState("SUCCESS", "Profile updated");
};
