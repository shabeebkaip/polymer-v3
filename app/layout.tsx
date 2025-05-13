// app/layout.tsx
import Header from "@/components/shared/Header";
import "./globals.css";
import { Kanit } from "next/font/google";
import Footer from "@/components/shared/Footer";
import { Toaster } from "sonner";

// ↓ Add this ↓
const kanit = Kanit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-kanit",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`
      ${kanit.variable}
    `}
    >
      <body className="antialiased">
        <Header />
        <Toaster richColors position="top-right" />
        {children}
        <Footer />
      </body>
    </html>
  );
}
