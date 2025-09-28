"use client";

import { useSidebar } from "@/context/SidebarContext";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const Backdrop: React.FC = () => {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Gestion de l'animation d'entrée/sortie
  useEffect(() => {
    if (isMobileOpen) {
      setShouldRender(true);
      // Délai minimal pour permettre le rendu avant l'animation
      const timeout = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timeout);
    } else {
      setIsVisible(false);
      // Attend la fin de l'animation avant de démonter
      const timeout = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isMobileOpen]);

  // Fermer avec la touche Échap
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileOpen) {
        toggleMobileSidebar();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileOpen, toggleMobileSidebar]);

  // Désactiver le scroll du body quand le backdrop est visible
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isMobileOpen]);

  if (!shouldRender) return null;

  return (
    <>
      {/* Backdrop principal */}
      <div
        className={`
          fixed inset-0 z-40 lg:hidden
          transition-all duration-300 ease-in-out
          ${isVisible 
            ? 'bg-gray-900/60 backdrop-blur-sm opacity-100' 
            : 'bg-transparent backdrop-blur-0 opacity-0'
          }
        `}
        onClick={toggleMobileSidebar}
        aria-hidden="true"
      />
      
      {/* Bouton de fermeture flottant (mobile seulement) */}
      {isVisible && (
        <button
          onClick={toggleMobileSidebar}
          className={`
            fixed top-4 right-4 z-50 lg:hidden
            flex items-center justify-center
            w-12 h-12 rounded-full
            bg-white/90 dark:bg-gray-800/90
            backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50
            shadow-lg hover:shadow-xl
            transition-all duration-300 ease-out
            transform-gpu
            ${isVisible 
              ? 'scale-100 opacity-100' 
              : 'scale-50 opacity-0'
            }
            hover:scale-110 hover:bg-white dark:hover:bg-gray-800
            focus:outline-none focus:ring-3 focus:ring-blue-500/50
          `}
          aria-label="Fermer le menu"
        >
          <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>
      )}

      {/* Indicateur de statut pour les lecteurs d'écran */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {isMobileOpen ? 'Menu de navigation ouvert' : 'Menu de navigation fermé'}
      </div>
    </>
  );
};

export default Backdrop;