import { Metadata } from "next";
import { defaultMetadata } from "./metadata";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "../components/common/footer";
import { Navbar } from "../components/common/navbar";
import { Analytics } from "@vercel/analytics/react";
import ConsoleMessage from "@/components/console-message";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://rushikeshnimkar.com" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />
        <meta name="robots" content="index, follow" />
        <meta
          name="google-site-verification"
          content="your-verification-code"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Common Background for all pages */}
        <div className="fixed inset-0 z-0">
          <BackgroundBeamsWithCollision className="absolute inset-0">
            <div className="absolute inset-0 bg-black/40" />
          </BackgroundBeamsWithCollision>

          {/* Blob animations */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <ConsoleMessage />
        <Navbar />
        <div className="relative z-10">{children}</div>
        <Analytics />
        <Footer />
      </body>
    </html>
  );
}
