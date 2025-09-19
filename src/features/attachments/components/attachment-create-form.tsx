"use client";

import React, { useActionState, useRef, useState } from "react";
import { toast } from "sonner";

import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";
import { AttachmentEntity } from "@prisma/client";

import { createAttachments } from "../actions/create-attachments";
import { ACCEPTED_FILE_TYPES } from "../constants";
import { AttachmentsPreview } from "./attachments-preview";

type AttachmentCreateFormProps = {
  entity: AttachmentEntity;
  entityId: string;
  buttons?: React.ReactNode;
  onSuccess?: () => void;
};

enum FormFields {
  Files = "files",
}

const AttachmentCreateForm = ({
  entity,
  entityId,
  buttons,
  onSuccess,
}: AttachmentCreateFormProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [actionState, action] = useActionState(
    createAttachments.bind(null, { entity, entityId }),
    EMPTY_ACTION_STATE,
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files).filter((file) =>
      ACCEPTED_FILE_TYPES.includes(file.type),
    );

    if (newFiles.length < e.target.files.length) {
      toast.error("File(s) could not be selected. Check supported types.");
    }

    setFiles(newFiles);
    clearInputText();
  };

  const handleDeletePreview = (index: number) => {
    setFiles((previous) => previous.filter((_, i) => index !== i));
  };

  const handleSubmit = (formData: FormData) => {
    files.forEach((file) => formData.append("files", file));

    action(formData);

    setFiles([]);
  };

  const clearInputText = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Form action={handleSubmit} actionState={actionState} onSuccess={onSuccess}>
      <Input
        name={FormFields.Files}
        id={FormFields.Files}
        ref={fileInputRef}
        type="file"
        multiple
        accept={ACCEPTED_FILE_TYPES.join(",")}
        onChange={handleFileChange}
      />
      <AttachmentsPreview
        files={files}
        onClear={() => setFiles([])}
        onDelete={handleDeletePreview}
      />
      <FieldError actionState={actionState} name={FormFields.Files} />

      {buttons || <SubmitButton label="Upload" />}
    </Form>
  );

  return null;
};

export { AttachmentCreateForm };
