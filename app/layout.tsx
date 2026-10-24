import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-outfit",
});


export const metadata: Metadata = {
  title: "Edemy",
  description: "Learn from the best instructors, at your own pace.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${outfit.className} bg-white text-[#0E0E0E] antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}