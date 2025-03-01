import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme/theme-provider";

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
    // TODO: Fix hydration error
    <html suppressHydrationWarning lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <ThemeProvider>
          <Header />

          <main className="flex min-h-screen flex-1 flex-col overflow-y-auto overflow-x-hidden bg-secondary/20 px-8 py-24">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
