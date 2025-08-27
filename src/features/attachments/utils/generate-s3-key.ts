type GenerateS3KeyArgs = {
  organizationId: string;
  ticketId: string;
  fileName: string;
  attachmentId: string;
};

export const generateS3Key = ({
  organizationId,
  ticketId,
  fileName,
  attachmentId,
}: GenerateS3KeyArgs) => {
  return `${organizationId}/${ticketId}/${attachmentId}-${fileName}`;
};
