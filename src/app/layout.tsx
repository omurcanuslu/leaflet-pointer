import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Leaflet Pointer",
  description: "Save Water and Select Points",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <head>
       <link rel="icon" href="/map-maps-link.svg" sizes="any"  />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
