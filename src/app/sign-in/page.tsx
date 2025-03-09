import Link from "next/link";

import { CardCompact } from "@/components/card-compact";
import { SignInForm } from "@/features/auth/components/sign-in-form";
import { passwordForgotPath, signUpPath } from "@/utils/path";

const SignInPage = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <CardCompact
        title="Sign In"
        description="Sign in to your account"
        className="w-full max-w-[420px] animate-fade-in-from-top"
        content={<SignInForm />}
        footer={
          <>
            <Link
              href={signUpPath()}
              className="text-sm text-muted-foreground hover:underline hover:text-foreground"
            >
              No account yet?
            </Link>

            <Link
              href={passwordForgotPath()}
              className="text-sm text-muted-foreground hover:underline hover:text-foreground"
            >
              Forgot Password?
            </Link>
          </>
        }
      />
    </div>
  );
};

export default SignInPage;
