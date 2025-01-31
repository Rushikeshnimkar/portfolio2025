import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "../components/common/footer";
import { Navbar } from "../components/common/navbar";
import { Analytics } from "@vercel/analytics/react"
import ConsoleMessage from '@/components/console-message';

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
  title: "Rushikesh Nimkar",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'manifest',
        url: '/site.webmanifest'
      }
    ],
  },
  manifest: '/site.webmanifest',
  description: "Full Stack Developer specializing in modern web technologies. Experienced in building scalable applications with a focus on blockchain technology.",
  openGraph: {
    title: "Rushikesh Nimkar - Full Stack Developer",
    description: "Full Stack Developer specializing in modern web technologies. Experienced in building scalable applications with a focus on blockchain technology.",
    url: "https://rushikeshnimkar.xyz",
    siteName: "Rushikesh Nimkar Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rushikesh Nimkar - Full Stack Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rushikesh Nimkar - Full Stack Developer",
    description: "Full Stack Developer specializing in modern web technologies. Experienced in building scalable applications with a focus on blockchain technology.",
    creator: "@RushikeshN22296",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
};

export default function RootLayout({
  
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <ConsoleMessage />
        <Navbar />
        {children}
        <Analytics />
        <Footer />
      </body>
    </html>
  );
}
