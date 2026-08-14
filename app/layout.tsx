import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    template:"%s - Cosmetics Store",
    default: "Cosmetics Online Store",
  },
  description: "Cosmetics Online Store | The best cosmetics ever",
};

export default function RootLayout({
   children, 
  } : Readonly<{
    children:React.ReactNode
}>) {
  return (
    <html
      lang="en" className={cn("font-sans", geist.variable)}
    >
      <body className="font-poppins antialiased">{children}</body>
    </html>
  );
}
