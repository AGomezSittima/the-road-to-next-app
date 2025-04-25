import { CardCompact } from "@/components/card-compact";
import { OrganizationCreateForm } from "@/features/organization/components/organization-create-form";

const OrganizationCreatePage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <CardCompact
        title="Create organization"
        description="Create a new organization for your team"
        className="animate-fade-from-top w-full max-w-[420px]"
        content={<OrganizationCreateForm />}
      />
    </div>
  );
};

export default OrganizationCreatePage;
