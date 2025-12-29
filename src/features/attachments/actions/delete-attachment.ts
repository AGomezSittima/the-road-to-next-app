"use server";

import { revalidatePath } from "next/cache";

import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { ticketPath } from "@/utils/paths";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";

import { checkIfAttachmentsAreAllowed } from "../queries/check-if-attachments-allowed";
import * as attachmentService from "../service";

export const deleteAttachment = async (id: string) => {
  const { user } = await getAuthOrRedirect();

  if (!checkIfAttachmentsAreAllowed()) {
    return toActionState("ERROR", "Attachments are not allowed");
  }

  try {
    await attachmentService.deleteAttachment(id, user);
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketPath(id));

  return toActionState("SUCCESS", "Attachment deleted");
};
