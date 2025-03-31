"use client";

import { REGEXP_ONLY_CHARS } from "input-otp";
import { useActionState } from "react";

import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { appConfig } from "@/utils/app-config";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";

import { verifyEmail } from "../actions/verify-email";

enum FormFields {
  Code = "code",
}

const EmailVerificationForm = () => {
  const [actionState, formAction] = useActionState(
    verifyEmail,
    EMPTY_ACTION_STATE,
  );

  return (
    <Form action={formAction} actionState={actionState}>
      <InputOTP
        name={FormFields.Code}
        maxLength={appConfig.crypto.emailVerificationCodeLength}
        pattern={REGEXP_ONLY_CHARS}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
          <InputOTPSlot index={6} />
          <InputOTPSlot index={7} />
        </InputOTPGroup>
      </InputOTP>

      <FieldError name={FormFields.Code} actionState={actionState} />

      <SubmitButton label="Verify Email" />
    </Form>
  );
};

export { EmailVerificationForm };
