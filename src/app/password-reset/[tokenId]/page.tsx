import { CardCompact } from "@/components/card-compact";
import { PasswordResetForm } from "@/features/auth/components/password-reset-form";

type PasswordResetPageProps = {
  params: Promise<{ tokenId: string }>;
};

const PasswordResetPage = async ({ params }: PasswordResetPageProps) => {
  const { tokenId } = await params;

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <CardCompact
        title="Reset Password"
        description="Enter a new password for your account."
        className="w-full max-w-[420px] animate-fade-in-from-top"
        content={<PasswordResetForm tokenId={tokenId} />}
      />
    </div>
  );
};

export default PasswordResetPage;
