import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from './providers';
import ConditionalNavbar from './components/ConditionalNavbar';
import ConditionalFooter from './components/ConditionalFooter';

/* ----------  Google Fonts (Geist) ---------- */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* ----------  Metadata ---------- */
export const metadata: Metadata = {
  title: "Kindling",
  description: "Micro-sponsorships that ignite startup growth",
  icons: {
    icon: '/fire.svg',
    shortcut: '/fire.svg',
    apple: '/fire.svg',
  },
};

/* ----------  Root layout ---------- */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>

      <body className="flex min-h-screen flex-col bg-gradient-to-br from-amber-50 to-rose-50 antialiased">
        <Providers>
          <ConditionalNavbar />
          <main className="flex-1">{children}</main>
          <ConditionalFooter />
        </Providers>
      </body>
    </html>
  );
}

/* ----------  Local components ---------- */
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
