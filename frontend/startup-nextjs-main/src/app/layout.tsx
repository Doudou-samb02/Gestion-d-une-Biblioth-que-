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
            {children}
            <Footer />
            <ScrollToTop />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
