"use-client"
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ 
  weight: '100', 
  preload: false 
});

export const metadata: Metadata = {
  title: "[UAT] MONEYgayang Pasko! [GAMEFINITY]",
  description: "GAMEFINITY raffle held by InPlay",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
