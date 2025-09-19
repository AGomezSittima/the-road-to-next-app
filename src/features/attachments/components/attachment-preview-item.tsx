"use client";

import { LucideCircleX, LucideFileText } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

type AttachmentPreviewItemProps = {
  file: File;
  onDelete: () => void;
};

const AttachmentPreviewItem = ({
  file,
  onDelete,
}: AttachmentPreviewItemProps) => {
  return (
    <div className="relative flex flex-col items-center gap-y-1 p-2">
      <div className="relative size-32">
        {file.type.includes("image/") ? (
          <Image
            src={URL.createObjectURL(file)}
            alt={`Preview for file: ${file.name}`}
            className="rounded-md object-cover"
            fill
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-y-1">
            <LucideFileText className="h-1/2 w-1/2" />
            <p className="text-xs text-muted-foreground">
              Preview not available
            </p>
          </div>
        )}
      </div>
      <p className="line-clamp-1 break-all text-sm">{file.name}</p>
      <Button
        type="button"
        size="icon-xs"
        variant="destructive"
        className="absolute right-2 top-0 rounded-full"
        onClick={onDelete}
      >
        <LucideCircleX />
      </Button>
    </div>
  );
};

export { AttachmentPreviewItem };
