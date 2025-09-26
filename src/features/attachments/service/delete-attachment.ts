import { isOwner } from "@/features/auth/utils/is-owner";
import { inngest } from "@/lib/inngest";
import { appConfig } from "@/utils/app-config";
import { User } from "@prisma/client";

import * as attachmentDataAccess from "../data";
import { AttachmentSubjectDTO } from "../dto/attachment-subject-dto";
import { getAttachmentById } from "../queries/get-attachment";

export const deleteAttachment = async (id: string, user: User) => {
  const attachment = await getAttachmentById(id);

  const subject = AttachmentSubjectDTO.fromAttachment(attachment);

  if (!subject || !attachment) {
    throw new Error("Not found");
  }

  if (!isOwner(user, subject)) {
    throw new Error("Not authorized");
  }

  await attachmentDataAccess.deleteAttachment(id);

  // TODO: Extract to abtraction FileUpload file
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
