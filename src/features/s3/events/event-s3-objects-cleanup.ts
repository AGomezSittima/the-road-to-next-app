import { s3 } from "@/lib/aws";
import { inngest } from "@/lib/inngest";
import { appConfig } from "@/utils/app-config";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";

export type S3ObjectsCleanupEventArgs = {
  data: {
    objects: { Objects: { Key: string }[] };
  };
};

export const s3ObjectsCleanupOnDependencyDeletedEvent = inngest.createFunction(
  { id: "s3-objects-cleanup-on-dependency-deleted", retries: 5 },
  {
    event: appConfig.events.names.s3ObjectsCleanup,
  },
  async ({ event, step }) => {
    const { objects } = event.data;

    await step
      .run(
        "delete-objects-s3",
        async () =>
          await s3.send(
            new DeleteObjectsCommand({
              Bucket: process.env.AWS_BUCKET_NAME,
              Delete: objects,
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

// TODO: Create a periodic job to clean up old attachments that are not in the DB anymore
