import { AccountTabs } from "@/app/(authenticated)/account/_navigation/tabs";
import { CardCompact } from "@/components/card-compact";
import { Heading } from "@/components/heading";
import { Spinner } from "@/components/spinner";
import { ProfileForm } from "@/features/account/components/profile-form";
import { getAuth } from "@/features/auth/queries/get-auth";

const ProfilePage = async () => {
  const { user } = await getAuth();

  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <Heading
        title="Profile"
        description="All your profile information"
        tabs={<AccountTabs />}
      />

      <div className="flex flex-1 flex-col items-center">
        {!user ? (
          <Spinner />
        ) : (
          <CardCompact
            title="Update Profile"
            description="Update your personal information"
            className="w-full max-w-[420px] animate-fade-in-from-top"
            content={<ProfileForm user={user} />}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
