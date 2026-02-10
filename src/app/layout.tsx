import type { Metadata } from "next";
import { Inter, Sarabun } from "next/font/google"; // Import Inter and Sarabun
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sarabun = Sarabun({
  weight: ["300", "400", "600"],
  subsets: ["thai", "latin"],
  variable: "--font-sarabun",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IT Service Desk",
  description: "Internal IT Service Request Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${inter.variable} ${sarabun.variable} font-sans antialiased bg-mesh text-slate-900 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
