import type { Metadata } from "next";
import { Inter } from "next/font/google"; 
import { Toaster } from 'sonner';
import "./globals.css";

// 🔥 IMPORT 2 FITUR DEWA KITA
import CustomCursor from "@/components/CustomCursor";
import GoogleTranslate from "@/components/GoogleTranslate";
import LiveSales from "@/components/LiveSales"; // 🔥 BARU: FOMO Pop-Up

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Natakenshi Developer | Premium Scripts & UI Marketplace",
  description: "Marketplace digital super cepat. Temukan script FiveM premium, template website modern, dan tools developer tingkat tinggi tanpa batas.",
  keywords: ["FiveM Script", "Marketplace Developer", "Template Website", "Natakenshi", "Jual Script"],
  authors: [{ name: "Natakenshi Dev" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={inter.className}>
        
        {/* Notifikasi Toast Mewah */}
        <Toaster theme="dark" position="top-center" richColors closeButton />
        
        {/* 🔥 Kursor Neon Global */}
        <CustomCursor />
        
        {/* 🔥 Translator Global (Pojok Kiri Bawah) */}
        <GoogleTranslate />

        <LiveSales /> {/* 🔥 FOMO Pop-Up Global */}

        {/* Konten Utama */}
        {children}
        
      </body>
    </html>
  );
}