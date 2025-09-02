"use server";

import { revalidatePath } from "next/cache";

import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";
import { ticketPath } from "@/utils/paths";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";

import { getOrganizationIdByAttachmentSubject } from "../utils/attachment-helper";

export const deleteAttachment = async (id: string) => {
  const { user } = await getAuthOrRedirect();

  const attachment = await prisma.attachment.findUniqueOrThrow({
    where: { id },
    include: { ticket: true, comment: { include: { ticket: true } } },
  });

  const subject = attachment.ticket ?? attachment.comment;

  if (!subject) {
    return toActionState("ERROR", "Subject not found");
  }

  if (!isOwner(user, subject)) {
    return toActionState("ERROR", "Not authorized");
  }

  try {
    await prisma.attachment.delete({
      where: { id },
    });

    const organizationId = getOrganizationIdByAttachmentSubject(
      attachment.entity,
      subject,
    );

    await inngest.send({
      name: appConfig.events.names.attachmentDeleted,
      data: {
        organizationId: organizationId,
        entity: attachment.entity,
        entityId: subject.id,
        fileName: attachment.name,
        attachmentId: id,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketPath(id));

  return toActionState("SUCCESS", "Attachment deleted");
};
