import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "AI Product Analytics Dashboard", description: "AI-powered AI Product Analytics Dashboard" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
