import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIS — Student Intelligence System",
  description: "CLAT-focused student intelligence prototype",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
