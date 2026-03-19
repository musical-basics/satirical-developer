import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProcrastinCalc | Calculate Your Developer ROI",
  description:
    "Why spend 10 minutes doing a chore when you can spend 4 hours automating it? Calculate the true cost of over-engineering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-mono antialiased">{children}</body>
    </html>
  );
}
