import { AttachmentEntity } from "@prisma/client";

type GenerateTicketAttachmentS3KeyArgs = {
  organizationId: string;
  entity: AttachmentEntity;
  entityId: string;
  fileName: string;
  attachmentId: string;
};

export const generateAttachmentS3Key = ({
  organizationId,
  entity,
  entityId,
  fileName,
  attachmentId,
}: GenerateTicketAttachmentS3KeyArgs) => {
  return `${organizationId}/${entity}/${entityId}/${attachmentId}-${fileName}`;
};
