import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Header } from "@/app/_navigation/header";
import { Sidebar } from "@/app/_navigation/sidebar/components/sidebar";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getBaseUrl } from "@/utils/url";

import { ReactQueryProvider } from "./_providers/react-query/react-query-provider";
import ogImage from "./opengraph-image.png";
import twitterImage from "./twitter-image.png";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: { default: "Ticket Bounty", template: "%s | Ticket Bounty" },
  description: "A platform to manage and track ticket bounties effectively.",
  applicationName: "Ticket Bounty",
  creator: process.env.AUTHOR_NAME,
  publisher: process.env.AUTHOR_NAME,
  referrer: "origin-when-cross-origin",
  authors: [{ name: process.env.AUTHOR_NAME, url: process.env.AUTHOR_URL }],
  openGraph: {
    title:
      "Ticket Bounty: A platform to track ticket bounties.",
    description:
      "Manage and track ticket bounties with ease using Ticket Bounty. Win rewards for resolving issues and contributing to projects.",
    url: "/",
    siteName: "Ticket Bounty",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: ogImage.src,
        width: ogImage.width,
        height: ogImage.height,
        alt: "Ticket Bounty Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Ticket Bounty: A platform to track ticket bounties.",
    description:
      "Manage and track ticket bounties with ease using Ticket Bounty. Win rewards for resolving issues and contributing to projects.",
    images: [
      {
        url: twitterImage.src,
        width: twitterImage.width,
        height: twitterImage.height,
        alt: "Ticket Bounty Image",
      },
    ],
  },
  keywords: [
    "Next.js",
    "React",
    "TypeScript",
    "Ticket Bounty",
    "Bounty Management",
    "Issue Tracking",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={`${montserrat.variable} overflow-hidden antialiased`}>
        <NuqsAdapter>
          <ThemeProvider>
            <ReactQueryProvider>
              <TooltipProvider>
                <Header />
                <div className="flex h-dvh border-collapse">
                  <Sidebar />
                  <main className="flex min-h-screen flex-1 flex-col overflow-y-auto overflow-x-hidden bg-secondary/20 px-8 py-24">
                    {children}
                  </main>
                  <Footer />
                </div>
                <Toaster expand />
              </TooltipProvider>
            </ReactQueryProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
