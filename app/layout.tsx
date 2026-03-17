import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/ClientProviders";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KidsTube – Safe YouTube for Kids",
  description: "A curated YouTube experience for kids, managed by parents.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-gray-50 min-h-screen antialiased`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
