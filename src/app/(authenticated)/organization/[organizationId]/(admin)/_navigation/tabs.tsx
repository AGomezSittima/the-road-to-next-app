"use client";

import { useParams, usePathname } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { checkIfStripeAllowed } from "@/features/stripe/queries/check-if-stripe-allowed";
import {
  credentialsPath,
  invitationsPath,
  membershipsPath,
  organizationsPath,
  subscriptionPath,
} from "@/utils/paths";

type OrganizationBreadcrumbsProps = {
  organizationName: string | undefined;
};

const OrganizationBreadcrumbs = ({
  organizationName,
}: OrganizationBreadcrumbsProps) => {
  const params = useParams<{ organizationId: string }>();
  const pathName = usePathname();
  const isStripeAllowed = checkIfStripeAllowed();

  const title = {
    memberships: "Memberships" as const,
    invitations: "Invitations" as const,
    credentials: "Credentials" as const,
    subscription: "Subscription" as const,
  }[
    pathName.split("/").at(-1) as
      | "memberships"
      | "invitations"
      | "credentials"
      | "subscription"
  ];

  const baseOptions = [
    {
      title: "Memberships",
      href: membershipsPath(params.organizationId),
    },
    {
      title: "Invitations",
      href: invitationsPath(params.organizationId),
    },
    {
      title: "Credentials",
      href: credentialsPath(params.organizationId),
    },
  ];
  const stripeOptions = [
    {
      title: "Subscription",
      href: subscriptionPath(params.organizationId),
    },
  ];

  return (
    <Breadcrumbs
      breadcrumbs={[
        { title: "Organizations", href: organizationsPath() },
        organizationName
          ? { title: organizationName }
          : { title: "", skip: true },
        {
          title,
          dropdown: isStripeAllowed
            ? [...baseOptions, ...stripeOptions]
            : [...baseOptions],
        },
      ]}
    />
  );
};

export { OrganizationBreadcrumbs };
