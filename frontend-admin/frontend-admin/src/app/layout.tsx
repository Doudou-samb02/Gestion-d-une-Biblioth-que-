"use client";

import { Outfit } from "next/font/google";
import "./globals.css";

import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";

import AppSidebar from "@/layout/AppSidebar";
import AppHeader from "@/layout/AppHeader";
import { usePathname } from "next/navigation";

const outfit = Outfit({
  subsets: ["latin"],
});

// Composant wrapper pour le layout complet
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isExpanded, isMobileOpen, isHovered } = useSidebar();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar fixe */}
      <div className="fixed inset-y-0 left-0 z-40">
        <AppSidebar />
      </div>

      {/* Contenu principal avec marge pour le sidebar */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out
          ${isMobileOpen ? "ml-0" : isExpanded || isHovered ? "ml-[290px]" : "ml-[90px]"}
        `}
      >
        {/* Header fixe */}
        <div className="sticky top-0 z-30">
          <AppHeader />
        </div>

        {/* Contenu scrollable */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  // Détecte si on est dans auth (login, signup, etc.)
  const isAuthPage = pathname?.startsWith("/admin-login");

  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          {isAuthPage ? (
            // Pour les pages auth : layout minimal
            <>{children}</>
          ) : (
            // Pour toutes les autres pages : layout complet
            <SidebarProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
            </SidebarProvider>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}