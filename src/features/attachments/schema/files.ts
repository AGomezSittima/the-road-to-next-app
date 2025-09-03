import { z } from "zod";

import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE_IN_MB } from "../constants";
import { sizeInMB } from "../utils/size";

export const filesSchema = z
  .custom<FileList>()
  .transform((files) => Array.from(files))
  .transform((files) => files.filter((file) => file.size > 0))
  .refine(
    (files) =>
      files.every((file) => sizeInMB(file.size) <= MAX_FILE_SIZE_IN_MB),
    `The maximum file size is ${MAX_FILE_SIZE_IN_MB}MB`,
  )
  .refine((files) =>
    files.every(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      "File type is not supported",
    ),
  );
