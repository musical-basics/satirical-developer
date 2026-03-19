import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050505",
};

export const metadata: Metadata = {
  title: "ProcrastinCalc | Calculate Your Developer ROI",
  description:
    "Why spend 10 minutes doing a chore when you can spend 4 hours automating it? Calculate the true cost of over-engineering your life.",
  keywords: [
    "developer",
    "procrastination",
    "calculator",
    "over-engineering",
    "ROI",
    "satire",
    "coding humor",
  ],
  authors: [{ name: "ProcrastinCalc" }],
  creator: "ProcrastinCalc",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "ProcrastinCalc | Calculate Your Developer ROI",
    description:
      "Why spend 10 minutes doing a chore when you can spend 4 hours automating it?",
    type: "website",
    siteName: "ProcrastinCalc",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProcrastinCalc | Calculate Your Developer ROI",
    description:
      "Why spend 10 minutes doing a chore when you can spend 4 hours automating it?",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-mono antialiased">
        {children}
        {/* CRT scanline overlay for hacker aesthetic */}
        <div className="scanline-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
