import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { homePath, ticketsPath } from "@/path";
import { buttonVariants } from "@/components/ui/button";
import { LucideKanban } from "lucide-react";
import { Header } from "@/components/header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Road to Next",
  description: "My Road to Next application ...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Header />

        <main className="flex min-h-screen flex-1 flex-col overflow-y-auto overflow-x-hidden bg-secondary/20 px-8 py-24">
          {children}
        </main>
      </body>
    </html>
  );
}
