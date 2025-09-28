"use client";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import NotificationDropdown from "@/components/header/NotificationDropdown";
import UserDropdown from "@/components/header/UserDropdown";
import { useSidebar } from "@/context/SidebarContext";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Menu,
  X,
  MoreVertical,
  Command,
  User
} from "lucide-react";

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  // Gestion du raccourci clavier Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }

      // Échap pour quitter la recherche
      if (event.key === "Escape" && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fermer le menu mobile quand on redimensionne l'écran
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setApplicationMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="sticky top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 z-50 shadow-sm">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        {/* Left Section - Logo & Menu Toggle */}
        <div className="flex items-center gap-3">
          {/* Menu Toggle Button */}
          <button
            onClick={handleToggle}
            className="flex items-center justify-center w-9 h-9 text-gray-600 transition-all duration-200 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:w-10 lg:h-10"
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>

          {/* Logo - Mobile */}
          <Link href="/" className="lg:hidden">
            <div className="flex items-center gap-2">
              <div className="relative w-7 h-7">
                <Image
                  fill
                  className="dark:hidden object-contain"
                  src="/images/logo/Bibliothequenoir.png"
                  alt="Bibliothèque Logo"
                  priority
                />
                <Image
                  fill
                  className="hidden dark:block object-contain"
                  src="/images/logo/Bibliothequeblanc.png"
                  alt="Bibliothèque Logo"
                  priority
                />
              </div>
              <span className="text-base font-semibold text-gray-900 dark:text-white">
                Bibliothèque
              </span>
            </div>
          </Link>
        </div>

        {/* Center Section - Search Bar */}
        <div className="flex-1 max-w-2xl mx-3 lg:mx-6">
          <div className="relative group">
            <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl transition-opacity duration-300 ${
              isSearchFocused ? 'opacity-100' : 'opacity-0'
            }`} />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors duration-200 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Rechercher un livre, auteur, utilisateur..."
                className="w-full h-10 pl-10 pr-20 bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-sm transition-all duration-200 focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                <div className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100/50 dark:bg-gray-700/50 rounded-md border border-gray-200/50 dark:border-gray-600/50">
                  <Command className="w-3 h-3" />
                  <span>K</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Actions & User Menu */}
        <div className="flex items-center gap-1">
          {/* Mobile Search Toggle */}
          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-9 h-9 text-gray-600 transition-all duration-200 rounded-lg lg:hidden hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Ouvrir le menu"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 lg:flex">
            {/* Theme Toggle */}
            <div className="mr-1">
              <ThemeToggleButton />
            </div>

            {/* Notifications */}
            <div className="mr-1">
              <NotificationDropdown />
            </div>
          </div>

          {/* User Dropdown avec marge */}
          <div className="ml-1">
            <UserDropdown />
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isApplicationMenuOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={toggleApplicationMenu}>
          <div
            className="absolute right-3 top-14 w-60 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 animate-in slide-in-from-top-2 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    Admin
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Administrateur
                  </p>
                </div>
              </div>

              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-8 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="p-2">
              <button className="flex items-center gap-2 w-full px-2 py-1.5 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm">
                <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">3</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default AppHeader;