type GenerateTicketAttachmentS3KeyArgs = {
  organizationId: string;
  ticketId: string;
  fileName: string;
  attachmentId: string;
};

export const generateTicketAttachmentS3Key = ({
  organizationId,
  ticketId,
  fileName,
  attachmentId,
}: GenerateTicketAttachmentS3KeyArgs) => {
  return `${organizationId}/${ticketId}/${attachmentId}-${fileName}`;
};
