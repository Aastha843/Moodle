import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CSE3CWA - Assignment 1",
  description: "HTML+JS (inline CSS) generator with accessible UI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Theme class toggled on <html> by the Header (dark/light) */}
      <body>{children}</body>
    </html>
  );
}
