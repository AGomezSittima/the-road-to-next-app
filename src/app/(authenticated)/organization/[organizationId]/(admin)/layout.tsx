import { LucideShieldUser } from "lucide-react";
import { Metadata } from "next";
import React from "react";

import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import { getOrganizationById } from "@/features/organization/queries/get-organization";

type AuthenticatedLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ organizationId: string }>;
}>;

export async function generateMetadata({
  params,
}: AuthenticatedLayoutProps): Promise<Metadata> {
  const { organizationId } = await params;

  const organization = await getOrganizationById(organizationId);

  if (!organization) {
    return {};
  }

  return {
    title: organization.name,
  };
}

export default async function AuthenticatedLayout({
  children,
  params,
}: AuthenticatedLayoutProps) {
  const { organizationId } = await params;

  await getAdminOrRedirect(organizationId);

  return (
    <>
      <div className="mb-8 flex items-center gap-x-2">
        <LucideShieldUser className="size-8" />
        <span className="text-muted-foreground">
          You are in the admin area.
        </span>
      </div>

      {children}
    </>
  );
}
