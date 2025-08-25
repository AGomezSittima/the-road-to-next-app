import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";

export const deleteAttachment = async (id: string) => {
  const { user } = await getAuthOrRedirect();

  const attachment = await prisma.attachment.findUniqueOrThrow({
    where: { id },
    include: { ticket: true },
  });

  if (!isOwner(user, attachment.ticket)) {
    return toActionState("ERROR", "Not authorized");
  }

  try {
    await prisma.attachment.delete({
      where: { id },
    });

    await inngest.send({
      name: appConfig.events.names.attachmentDeleted,
      data: {
        attachmentId: id,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  return toActionState("SUCCESS", "Attachment deleted");
};
