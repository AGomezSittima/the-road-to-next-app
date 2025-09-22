import { isOwner } from "@/features/auth/utils/is-owner";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";
import { User } from "@prisma/client";

import * as attachmentData from "../data";
import { AttachmentSubjectDTO } from "../dto/attachment-subject-dto";

export const deleteAttachment = async (id: string, user: User) => {
  const attachment = await attachmentData.getAttachmentById(id);

  const subject = AttachmentSubjectDTO.fromAttachment(attachment);

  if (!subject || !attachment) {
    throw new Error("Not found");
  }

  if (!isOwner(user, subject)) {
    throw new Error("Not authorized");
  }

  // TODO: Extract to DAL
  await prisma.attachment.delete({
    where: { id },
  });

  await inngest.send({
    name: appConfig.events.names.attachmentDeleted,
    data: {
      organizationId: subject.organizationId,
      entity: attachment.entity,
      entityId: subject.entityId,
      fileName: attachment.name,
      attachmentId: id,
    },
  });
};
