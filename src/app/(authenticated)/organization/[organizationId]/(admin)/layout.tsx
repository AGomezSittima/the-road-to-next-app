import { LucideShieldUser } from "lucide-react";
import React from "react";

import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";

type AuthenticatedLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ organizationId: string }>;
}>;

export default async function AuthenticatedLayout({
  children,
  params,
}: AuthenticatedLayoutProps) {
  const { organizationId } = await params;

  await getAdminOrRedirect(organizationId);

  return (
    <>
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-x-2">
          <LucideShieldUser className="size-8" />
          <span className="text-muted-foreground">You are in the admin area.</span>
        </div>
        {children}
      </div>
    </>
  );
}
