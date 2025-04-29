"use client";

import { LucideLoaderCircle } from "lucide-react";
import React, { cloneElement } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "../ui/button";

type SubmitButtonProps = {
  label?: string;
  icon?: React.ReactElement<React.SVGProps<SVGElement>, "svg">;
  disabled?: boolean;
} & Partial<Pick<React.ComponentProps<typeof Button>, "variant" | "size">>;

const SubmitButton = ({
  label,
  icon,
  disabled,
  variant,
  size,
}: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      disabled={disabled || pending}
    >
      {pending ? (
        <LucideLoaderCircle className="size-4 animate-spin" />
      ) : icon ? (
        <>{cloneElement(icon, { className: "size-4" })}</>
      ) : null}
      {label}
    </Button>
  );
};

export { SubmitButton };
