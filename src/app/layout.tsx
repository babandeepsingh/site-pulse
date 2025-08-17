import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import "./globals.css";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Site's Pulse",
  description: "Website monitoring tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <header>
            {/* <SignedOut>
              <SignInButton />
              <SignUpButton>
                <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn> */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "WebSite",
                  "name": "Sitespulse",
                  "url": "https://sitespulse.babandeep.in",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://sitespulse.babandeep.in/search?q={search_term}",
                    "query-input": "required name=search_term",
                  },
                }),
              }}
            />
            <Head>
              <title>Sitespulse - Website Monitoring Tool</title>
              <meta name="description" content="Monitor your website's uptime, performance, and security with Sitespulse. Get real-time alerts and insights." />
              <meta property="og:title" content="Sitespulse - Website Monitoring Tool" />
              <meta property="og:description" content="Real-time website monitoring tool for uptime, performance, and security." />
              <meta property="og:image" content="/images/og-image.jpg" />
              <meta property="og:url" content="https://sitespulse.babandeep.in" />
            </Head>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
