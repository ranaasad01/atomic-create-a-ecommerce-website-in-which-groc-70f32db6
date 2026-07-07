import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LocaleProvider from "@/components/LocaleProvider";
import LanguageToggle from "@/components/LanguageToggle";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  formatDetection: { telephone: false, date: false, email: false, address: false },
  title: "Fresh Basket — Groceries & Fresh Fruits Delivered",
  description:
    "Shop the freshest fruits, vegetables, dairy, bakery, and more. Fast delivery, great prices, and quality you can taste.",
  keywords: ["grocery", "fresh fruits", "vegetables", "online grocery", "Fresh Basket"],
  openGraph: {
    title: "Fresh Basket",
    description: "Fresh groceries and fruits delivered to your door.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={nunito.variable}>
      <body className="bg-[#F5F5F5] font-sans antialiased">
        <LocaleProvider>
          <LanguageToggle />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}