"use client";

import React, { useRef } from "react";

import { Input } from "../ui/input";
import { PasswordStrengthBar } from "./password-strength-bar";

type PasswordInputProps = Pick<
  HTMLInputElement,
  "name" | "defaultValue" | "placeholder"
> &
  Pick<React.RefAttributes<HTMLInputElement>, "ref">;

const PasswordInput = ({
  name,
  defaultValue,
  placeholder,
  ref,
}: PasswordInputProps) => {
  return (
    <Input
      type="password"
      name={name}
      placeholder={placeholder}
      defaultValue={defaultValue}
      ref={ref}
    />
  );
};

const PasswordInputWithBar = ({
  name,
  defaultValue,
  placeholder,
}: PasswordInputProps) => {
  const passwordRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex flex-col gap-y-3">
      <PasswordInput
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        ref={passwordRef}
      />

      <PasswordStrengthBar inputRef={passwordRef} />
    </div>
  );
};

export { PasswordInput, PasswordInputWithBar };
