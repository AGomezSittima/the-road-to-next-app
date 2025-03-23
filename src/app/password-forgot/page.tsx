import { CardCompact } from "@/components/card-compact";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

const ForgotPasswordPage = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <CardCompact
        title="Forgot Password"
        description="Enter your email address to reset your password."
        className="w-full max-w-[420px] animate-fade-in-from-top"
        content={<ForgotPasswordForm />}
      />
    </div>
  );
};

export default ForgotPasswordPage;
