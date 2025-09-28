"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Inter } from "next/font/google";
import "../styles/index.css";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body className={`${inter.className}`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>
            <Header />
            {/* Ajouter un div avec padding-top pour compenser la hauteur du header */}
            <main className="pt-20 lg:pt-24 min-h-screen">
              {children}
            </main>
            <Footer />
            <ScrollToTop />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}