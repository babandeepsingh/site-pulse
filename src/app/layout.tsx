import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import "./globals.css";
import Head from "next/head";

import { Toaster } from "@/components/ui/sonner"
import AddToHomeScreenPrompt from "@/components/AddToHomeScreenPrompt/AddToHomeScreenPrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SitesPulse - Professional Website Monitoring",
  description: "Monitor your website's uptime, performance, and security with SitesPulse. Get real-time alerts and insights with our professional monitoring platform.",
  openGraph: {
    title: "SitesPulse - Real-Time Website Monitoring & Analytics",
    description: "Monitor your websites in real-time with powerful analytics and seamless uptime checks.",
    url: "https://sitespulse.babandeep.in/",
    siteName: "SitesPulse",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "SitesPulse Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "SitesPulse",
                "url": "https://sitespulse.babandeep.in/",
                "applicationCategory": "WebApplication",
                "operatingSystem": "All",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                }
              }),
            }}
          />
          <title>SitesPulse - Professional Website Monitoring</title>
          <meta charSet="utf-8" />
          <meta name="description" content="Monitor your website's uptime, performance, and security with SitesPulse. Get real-time alerts and insights with our professional monitoring platform." />
          <meta property="og:title" content="SitesPulse - Professional Website Monitoring" />
          <meta name="keywords" content="SitesPulse - Professional Website Monitoring" />
          <meta property="og:description" content="Real-time website monitoring tool for uptime, performance, and security. Trusted by businesses worldwide." />
          <meta property="og:image" content="./assets/logo.png" />
          <meta property="og:url" content="https://SitesPulse.com" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no,user-scalable=no,viewport-fit=cover" />
          <link rel="apple-touch-icon" href="/favicon.ico" />
          <meta name="apple-mobile-web-app-title" content="SitesPulse" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta property="og:title" content="Website monitoring Tools" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content="Website monitoring Tools" />
          <meta name="twitter:description" content="Website monitoring tool for uptime, performance, and security. Trusted by businesses worldwide." />
          <link rel="icon" href="/favicon.ico" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
        >
          <AddToHomeScreenPrompt />
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
