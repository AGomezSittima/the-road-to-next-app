import { AttachmentType } from "@prisma/client";

export const getAttachmentTypeFromFileType = (
  fileType: string,
): AttachmentType => {
  const fileGroup = fileType.split("/")[0];

  switch (fileGroup) {
    case "image":
      return "IMAGE";
    case "application":
      return "DOCUMENT";
    default:
      throw new Error("Invalid file group");
  }
};
