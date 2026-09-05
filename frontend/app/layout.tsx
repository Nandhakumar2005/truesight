import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TrueSight — AI Media Verification",
    template: "%s | TrueSight",
  },
  description:
    "Don't trust everything you see. TrueSight is a GenAI-powered media verification platform that helps you detect AI-generated or manipulated content.",
  keywords: ["deepfake detection", "media verification", "AI detection", "content authenticity"],
  authors: [{ name: "TrueSight" }],
  openGraph: {
    title: "TrueSight — AI Media Verification",
    description:
      "GenAI-powered platform for detecting AI-generated or manipulated media.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-primary/30 selection:text-primary-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
