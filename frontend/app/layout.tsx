import type { Metadata } from "next";
import { Inter } from "next/font/google";
import './globals.css'
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/provider/QueryProvider";
import { ReduxProvider } from "@/components/provider/ReduxProvider";
import { UpgradeHandler } from "@/components/UpgradeHandler";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sidinda",
  description: "Sistem informasi data induk daerah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UpgradeHandler />
        <ReduxProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </ReduxProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
