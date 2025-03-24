import Link from "next/link";

import { CardCompact } from "@/components/card-compact";
import { SignUpForm } from "@/features/auth/components/sign-up-form";
import { signInPath } from "@/utils/paths";

const SignUpPage = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <CardCompact
        title="Sign Up"
        description="Create an account to get started"
        className="w-full max-w-[420px] animate-fade-in-from-top"
        content={<SignUpForm />}
        footer={
          <Link
            href={signInPath()}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Have an account?{" "}
            <strong className="font-semibold underline">Sign In now</strong>.
          </Link>
        }
      />
    </div>
  );
};

export default SignUpPage;
