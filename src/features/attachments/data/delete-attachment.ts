import { prisma } from "@/lib/prisma";

export const deleteAttachment = async (id: string) => {
  await prisma.attachment.delete({
    where: { id },
  });
};
