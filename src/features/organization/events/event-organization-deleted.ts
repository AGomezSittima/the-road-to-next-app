import { s3 } from "@/lib/aws";
import { inngest } from "@/lib/inngest";
import { appConfig } from "@/utils/app-config";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";

export type OrganizationDeletedEventArgs = {
  data: {
    organizationId: string;
    attachmentsKeys: {
      Objects: {
        Key: string;
      }[];
    };
  };
};

export const organizationDeletedCleanupEvent = inngest.createFunction(
  { id: "organization-deleted-cleanup", retries: 5 },
  {
    event: appConfig.events.names.organizationDeleted,
  },
  async ({ event, step }) => {
    const { attachmentsKeys } = event.data;

    await step
      .run(
        "delete-attachments-s3",
        async () =>
          await s3.send(
            new DeleteObjectsCommand({
              Bucket: process.env.AWS_BUCKET_NAME,
              Delete: attachmentsKeys,
            }),
          ),
      )
      .catch((error) => {
        console.log(error);
        return { event, body: false };
      });

    return { event, body: true };
  },
);
