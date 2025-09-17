"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import zxcvbn from "zxcvbn";

import { getPasswordStrengthInfo } from "@/features/auth/utils/get-password-strength-info";
import { cn } from "@/lib/utils";
import { appConfig } from "@/utils/app-config";

type PasswordStrengthBarProps = {
  inputRef: React.RefObject<HTMLInputElement | null>;
};

// TODO: Add feedback for the user
const PasswordStrengthBar = ({ inputRef }: PasswordStrengthBarProps) => {
  const [passwordScore, setPasswordScore] = useState<number>(0);
  const zxcvbnRef = useRef<typeof zxcvbn | null>(null);

  const {
    normalizedScore,
    labelText,
    strengthBarColor: strengthColor,
  } = getPasswordStrengthInfo(passwordScore);

  const evaluatePassword = useDebouncedCallback(async (password: string) => {
    if (!password) {
      setPasswordScore(0);
      return;
    }

    if (!zxcvbnRef.current) {
      const zxcvbn = await import("zxcvbn");
      zxcvbnRef.current = zxcvbn.default ?? zxcvbn;
    }

    const result = zxcvbnRef.current(password);

    setPasswordScore(result.score + 1);
  }, appConfig.debounce.sm);

  useEffect(() => {
    const targetInput = inputRef.current;
    if (!targetInput) return;

    const handleInput = () => evaluatePassword(targetInput.value);

    // Listen to 'input' so it works with controlled or uncontrolled inputs
    targetInput.addEventListener("input", handleInput);

    // evaluate initial value if any
    if (targetInput.value) {
      handleInput();
    }

    return () => {
      targetInput.removeEventListener("input", handleInput);
    };
  }, [inputRef, evaluatePassword]);

  return (
    <>
      {passwordScore !== null && (
        <div className="px-2 text-muted-foreground">
          {/* Bar */}
          <div className="h-2 w-full rounded bg-muted">
            <div
              className={`h-2 rounded transition-all duration-500 ${strengthColor}`}
              style={{ width: `${normalizedScore * 100}%` }}
            />
          </div>

          <p
            className={cn(
              "min-h-[2.5ch] text-center text-xs font-medium transition duration-500",
              !passwordScore && "text-transparent",
            )}
          >
            {labelText}
          </p>
        </div>
      )}
    </>
  );
};

export { PasswordStrengthBar };
