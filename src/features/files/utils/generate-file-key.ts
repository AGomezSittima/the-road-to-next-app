import { AttachmentEntity } from "@prisma/client";

type GenerateTicketAttachmentKeyArgs = {
  organizationId: string;
  entity: AttachmentEntity;
  entityId: string;
  fileName: string;
  attachmentId: string;
};

export const generateAttachmentKey = ({
  organizationId,
  entity,
  entityId,
  fileName,
  attachmentId,
}: GenerateTicketAttachmentKeyArgs) => {
  return `${organizationId}/${entity}/${entityId}/${attachmentId}-${fileName}`;
};
