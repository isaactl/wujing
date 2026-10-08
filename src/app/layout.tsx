import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wujing | Code Editor",
  description: "A lightweight workspace for code, diffs, and Markdown.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
