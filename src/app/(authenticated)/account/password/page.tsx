import { AccountTabs } from "@/app/(authenticated)/account/_navigation/tabs";
import { CardCompact } from "@/components/card-compact";
import { Heading } from "@/components/heading";
import { PasswordChangeForm } from "@/features/auth/components/password-change-form";

const PasswordPage = () => {
  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <Heading
        title="Password"
        description="Keep your account secure"
        tabs={<AccountTabs />}
      />

      <div className="flex flex-1 flex-col items-center">
        <CardCompact
          title="Change Password"
          description="Enter your current password."
          className="w-full max-w-[420px] animate-fade-in-from-top"
          content={<PasswordChangeForm />}
        />
      </div>
    </div>
  );
};

export default PasswordPage;
