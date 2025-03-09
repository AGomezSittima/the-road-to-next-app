"use client";

import { LucideLoaderCircle } from "lucide-react";
import React, { cloneElement } from "react";
import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";

type SubmitButtonProps = {
  label?: string;
  icon?: React.ReactElement<React.SVGProps<SVGElement>, "svg">;
} & Partial<Pick<React.ComponentProps<typeof Button>, "variant" | "size">>;

const SubmitButton = ({ label, icon, variant, size }: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant={variant} size={size} disabled={pending}>
      {pending && (
        <LucideLoaderCircle
          className={cn("h-4 w-4 animate-spin", { "mr-2": !!label })}
        />
      )}
      {label}
      {pending ? null : icon ? (
        <span className={cn({ "ml-2": !!label })}>
          {cloneElement(icon, { className: "h-4 w-4" })}
        </span>
      ) : null}
    </Button>
  );
};

export { SubmitButton };
