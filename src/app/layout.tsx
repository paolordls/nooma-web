import type { Metadata } from "next";
import { DM_Sans, Newsreader, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nooma — Personal Productivity",
  description: "Finance, Tasks, and Notes management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${newsreader.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <div className="flex min-h-screen bg-editorial">
          <Sidebar />
          <main className="flex-1 px-12 py-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
