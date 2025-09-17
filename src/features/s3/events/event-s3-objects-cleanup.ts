import { s3 } from "@/lib/aws";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { appConfig } from "@/utils/app-config";
import {
  _Object,
  DeleteObjectsCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";

type S3ObjectList = { Objects: { Key: string }[] };

export type S3ObjectsCleanupEventArgs = {
  data: {
    objects: S3ObjectList;
  };
};

export const periodicS3ObjectsCleanupFunction = inngest.createFunction(
  { id: "periodic-s3-objects-cleanup", retries: 5 },
  { cron: "TZ=Europe/Madrid 0 0 * * 0" },
  async ({ step }) => {
    try {
      const objectLists = await step.run("get-s3-objects", async () => {
        const result: S3ObjectList[] = [];

        const params = { Bucket: process.env.AWS_BUCKET_NAME };
        let isTruncated = true;
        while (isTruncated) {
          const response = await s3.send(new ListObjectsCommand(params));

          if (response.Contents && response.Contents.length) {
            const objectList = await listObjectsOutputContentsToS3ObjectList(
              response.Contents,
            );

            if (objectList.Objects.length) {
              result.push(objectList);
            }

            isTruncated = response.IsTruncated ?? false;
          }
        }

        return result;
      });

      const events = objectLists.map((objectList) => ({
        name: appConfig.events.names.s3ObjectsCleanup,
        data: { objects: objectList },
      }));

      if (events.length) {
        await step.sendEvent("send-s3-objects-cleanup-events", events);
      }
    } catch (error) {
      console.log(error);
      return { event: "periodic-s3-objects-cleanup", body: false };
    }

    return { event: "periodic-s3-objects-cleanup", body: true };
  },
);

export const s3ObjectsCleanupFunction = inngest.createFunction(
  { id: "s3-objects-cleanup", retries: 5 },
  {
    event: appConfig.events.names.s3ObjectsCleanup,
  },
  async ({ event }) => {
    const { objects } = event.data;

    try {
      await s3.send(
        new DeleteObjectsCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Delete: objects,
        }),
      );
    } catch (error) {
      console.log(error);
      return { event, body: false };
    }

    return { event, body: true };
  },
);

const listObjectsOutputContentsToS3ObjectList = async (contents: _Object[]) => {
  const objectList: S3ObjectList = { Objects: [] };

  for (const object of contents) {
    if (object.Key) {
      const splittedKey = object.Key.split("/");
      const attachmentId = splittedKey[splittedKey.length - 1].split("-")[0];

      const attachmentExistsInDB = Boolean(
        await prisma.attachment.findUnique({
          where: { id: attachmentId },
          select: { id: true },
        }),
      );

      if (!attachmentExistsInDB) {
        objectList.Objects.push({ Key: object.Key });
      }
    }
  }

  return objectList;
};
