"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { AttachmentPreviewItem } from "./attachment-preview-item";

type AttachmentsPreviewProps = {
  files: File[];
  onClear: () => void;
  onDelete: (index: number) => void;
};

const AttachmentsPreview = ({
  files,
  onClear,
  onDelete,
}: AttachmentsPreviewProps) => {
  if (!files.length) {
    return null;
  }

  return (
    <div className="flex w-full animate-fade-in-from-bottom flex-col gap-y-4 rounded-md border-[1px] border-muted p-2">
      <div>
        <div className="flex items-center justify-between p-2">
          <p className="font-medium">Preview Files</p>
          <Button
            type="button"
            size="xs"
            variant="destructive"
            onClick={onClear}
          >
            Clear All
          </Button>
        </div>
        <Separator />
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        {files.map((file, index) => (
          <AttachmentPreviewItem
            key={file.name}
            file={file}
            onDelete={() => onDelete(index)}
          />
        ))}
      </div>
    </div>
  );
};

export { AttachmentsPreview };
