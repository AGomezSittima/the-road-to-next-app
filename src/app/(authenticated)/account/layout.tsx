import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account",
};

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
