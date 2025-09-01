import { NextRequest } from "next/server";

import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { generateAttachmentS3Key } from "@/features/s3/utils/generate-s3-key";
import { s3 } from "@/lib/aws";
import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ attachmentId: string }> },
) {
  await getAuthOrRedirect();

  const { attachmentId } = await params;

  const attachment = await prisma.attachment.findUniqueOrThrow({
    where: { id: attachmentId },
    include: { ticket: true },
  });

  const attachmentS3Key = generateAttachmentS3Key({
    organizationId: attachment.ticket.organizationId,
    ticketId: attachment.ticket.id,
    fileName: attachment.name,
    attachmentId: attachment.id,
  });

  const presignedUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: attachmentS3Key,
    }),
    { expiresIn: appConfig.aws.s3.presignedUrlExpirationInSeconds },
  );

  const response = await fetch(presignedUrl);

  const headers = new Headers();
  headers.append(
    "content-disposition",
    `attachment; filename="${attachment.name}"`,
  );

  return new Response(response.body, { headers });
}
