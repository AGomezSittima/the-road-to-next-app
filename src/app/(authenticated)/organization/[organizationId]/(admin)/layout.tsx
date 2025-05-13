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

  return <>{children}</>;
}
