import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider }   from "@/components/ThemeProvider";
import IntroAnimation      from "@/components/IntroAnimation";
import Analytics           from "@/components/Analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const SITE_URL = "https://omarlemkecher.com";

export const metadata: Metadata = {
  title: "Omar Lemkecher — Aerospace Engineering",
  description:
    "Portfolio of Omar Lemkecher, Aerospace Engineering student at UCLA Samueli. Hybrid rocket propulsion, pressure vessel analysis, and microgravity experiments.",
  metadataBase: new URL(SITE_URL),
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title:       "Omar Lemkecher — Aerospace Engineering · UCLA",
    description: "Hybrid rocket propulsion · Pressure vessel analysis · Zero-G experiments. Aerospace Engineering student at UCLA Samueli.",
    url:         SITE_URL,
    siteName:    "Omar Lemkecher",
    locale:      "en_US",
    type:        "website",
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Omar Lemkecher — Aerospace Engineering · UCLA",
    description: "Hybrid rocket propulsion · Pressure vessel analysis · Zero-G experiments.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <IntroAnimation />
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
