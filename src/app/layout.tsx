import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Header } from "@/app/_navigation/header";
import { Sidebar } from "@/app/_navigation/sidebar/components/sidebar";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import { ReactQueryProvider } from "./_providers/react-query/react-query-provider";

const montserrat = Montserrat({
  variable: "--font-montserrat",
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
    <html suppressHydrationWarning lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <NuqsAdapter>
          <ThemeProvider>
            <ReactQueryProvider>
              <Header />
              <div className="flex h-dvh border-collapse overflow-hidden">
                <Sidebar />
                <main className="flex min-h-screen flex-1 flex-col overflow-y-auto overflow-x-hidden bg-secondary/20 px-8 py-24">
                  {children}
                </main>
              </div>
              <Toaster expand />
            </ReactQueryProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
