// app/layout.tsx
import "./globals.css";
import { Kanit } from "next/font/google";
import { Toaster } from "sonner";
import PageNavigationLoader from "@/components/shared/PageNaigationLoader";
import ConditionalLayout from "@/components/shared/ConditionalLayout";
import type { Metadata } from "next";

const kanit = Kanit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-kanit",
  display: "swap",
});

export const metadata: Metadata = {
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${kanit.variable}`}>
      <body className="antialiased">
        <PageNavigationLoader />
        <Toaster richColors position="top-right" />
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
