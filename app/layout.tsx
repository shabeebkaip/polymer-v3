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
  title: "Polymers Hub - Global Polymer Marketplace",
  description: "Connect directly with verified polymer suppliers worldwide. Source smarter, trade faster, grow confidently. Join our exclusive early access program.",
  keywords: ["polymers", "polymer marketplace", "polymer suppliers", "polymer trading", "B2B marketplace", "chemical suppliers"],
  authors: [{ name: "Polymers Hub" }],
  openGraph: {
    title: "Polymers Hub - Global Polymer Marketplace",
    description: "Connect directly with verified polymer suppliers worldwide. Join our exclusive early access program.",
    type: "website",
    locale: "en_US",
    siteName: "Polymers Hub",
  },
  twitter: {
    card: "summary_large_image",
    title: "Polymers Hub - Global Polymer Marketplace",
    description: "Connect directly with verified polymer suppliers worldwide. Join our exclusive early access program.",
  },
  icons: {
    icon: "/logo.png",
  },
  robots: {
    index: true,
    follow: true,
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
