"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import ThemeToggler from "./ThemeToggler";
import { useAuth } from "../../app/context/AuthContext";
import { ChevronDown, User, LogOut } from "lucide-react";

const Header = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("accueil");
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  // Refs pour optimiser les performances
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sectionsRef = useRef<HTMLElement[]>([]);

  const menuData = [
    { title: "Accueil", path: "/", id: "accueil" },
    { title: "Nouveautés", path: "#nouveautes", id: "nouveautes", isHash: true },
    { title: "Populaires", path: "#populaires", id: "populaires", isHash: true },
    { title: "Auteurs", path: "#auteurs", id: "auteurs", isHash: true },
    { title: "Avis", path: "#avis", id: "avis", isHash: true },
    { title: "Catalogue", path: "/books", id: "catalogue" },
    { title: "Mes Livres", path: "/borrowed", requiresAuth: true, id: "mes-livres" }
  ];

  // Sticky navbar avec throttling
  useEffect(() => {
    let ticking = false;

    const handleStickyNavbar = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setSticky(window.scrollY >= 80);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleStickyNavbar, { passive: true });
    return () => window.removeEventListener("scroll", handleStickyNavbar);
  }, []);

  // Fonction optimisée pour détecter la section active
  const detectActiveSection = useCallback(() => {
    if (pathname !== "/") return;

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const headerOffset = 100; // Offset pour le header sticky

    // Récupérer toutes les sections
    const sections = menuData
      .filter(item => item.isHash || item.id === "accueil")
      .map(item => ({
        id: item.id,
        element: document.getElementById(item.id)
      }))
      .filter(section => section.element !== null) as Array<{
        id: string;
        element: HTMLElement;
      }>;

    if (sections.length === 0) return;

    // Si on est tout en haut, activer "accueil"
    if (scrollY < 100) {
      setActiveSection("accueil");
      return;
    }

    // Trouver la section la plus visible
    let activeSection = "accueil";
    let maxVisibility = 0;

    sections.forEach(({ id, element }) => {
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top;
      const elementBottom = rect.bottom;
      const elementHeight = rect.height;

      // Calculer la visibilité de la section
      const visibleTop = Math.max(0, headerOffset - elementTop);
      const visibleBottom = Math.min(windowHeight, elementBottom);
      const visibleHeight = Math.max(0, visibleBottom - Math.max(headerOffset, elementTop));
      const visibilityRatio = visibleHeight / elementHeight;

      // Priorité aux sections qui sont suffisamment visibles
      if (visibilityRatio > 0.3 && visibilityRatio > maxVisibility) {
        maxVisibility = visibilityRatio;
        activeSection = id;
      }

      // Cas spécial : si une section occupe plus de 50% de l'écran
      if (elementTop <= headerOffset && elementBottom >= windowHeight * 0.5) {
        activeSection = id;
      }
    });

    setActiveSection(activeSection);
  }, [pathname, menuData]);

  // Gestionnaire de scroll optimisé avec debouncing
  useEffect(() => {
    if (pathname !== "/") return;

    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        detectActiveSection();
      }, 10); // Debounce très court pour réactivité
    };

    // Détection initiale après un court délai
    const initialTimeout = setTimeout(() => {
      detectActiveSection();
    }, 300);

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(initialTimeout);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname, detectActiveSection]);

  // Gestion de la navigation par hash depuis d'autres pages
  useEffect(() => {
    if (pathname !== "/") return;

    const handleHashNavigation = () => {
      const hash = window.location.hash.replace("#", "");

      if (hash) {
        const element = document.getElementById(hash);
        if (element) {
          const headerHeight = 80;
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });

          // Attendre la fin du scroll pour mettre à jour la section active
          setTimeout(() => {
            setActiveSection(hash);
          }, 500);
        }
      } else {
        setActiveSection("accueil");
      }
    };

    // Délai pour laisser le DOM se charger complètement
    const timeoutId = setTimeout(handleHashNavigation, 100);
    return () => clearTimeout(timeoutId);
  }, [pathname]);

  const toggleDropdown = (id: string) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const closeAllDropdowns = () => {
    setDropdownOpen(null);
    setNavbarOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeAllDropdowns();
  };

  const handleMenuClick = (item: any) => {
    if (item.isHash) {
      if (pathname === "/") {
        // Navigation smooth vers la section
        const element = document.getElementById(item.id);
        if (element) {
          const headerHeight = 80;
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });

          // Mettre à jour immédiatement pour un feedback utilisateur
          setActiveSection(item.id);
        }
      } else {
        // Redirection vers la page d'accueil avec hash
        router.push(`/${item.path}`);
      }
    } else {
      // Navigation vers une autre page
      router.push(item.path);
      if (item.path !== "/") {
        setActiveSection(item.id);
      }
    }
    closeAllDropdowns();
  };

  const isItemActive = (item: any) => {
    // Pour les pages autres que l'accueil
    if (pathname !== "/" && item.path === pathname) {
      return true;
    }

    // Pour l'accueil et les sections hash
    if (pathname === "/") {
      if (item.id === "accueil" && item.path === "/") {
        return activeSection === "accueil";
      }
      if (item.isHash) {
        return activeSection === item.id;
      }
    }

    return false;
  };

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        sticky
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-blue-200 dark:border-amber-700"
          : "bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center transition-all duration-300 hover:scale-105"
            onClick={() => {
              setActiveSection("accueil");
              closeAllDropdowns();
              if (pathname === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <div className="relative w-20 h-20 mr-4">
              <Image
                src="/images/Bibliothequenoir.png"
                alt="logo"
                fill
                className="object-contain dark:hidden"
                priority
              />
              <Image
                src="/images/Bibliothequeblanc.png"
                alt="logo"
                fill
                className="object-contain hidden dark:block"
                priority
              />
            </div>
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden lg:flex items-center space-x-1">
            {menuData.map((item, index) => {
              if (item.requiresAuth && !user) return null;

              const isActive = isItemActive(item);

              return (
                <button
                  key={index}
                  onClick={() => handleMenuClick(item)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-100 to-amber-100 dark:from-blue-900/40 dark:to-amber-900/40 text-blue-800 dark:text-amber-300 border border-blue-200 dark:border-amber-700 shadow-sm"
                      : "text-gray-800 dark:text-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-amber-50 dark:hover:from-blue-900/20 dark:hover:to-amber-900/20 hover:text-blue-700 dark:hover:text-amber-300"
                  }`}
                >
                  {item.title}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-blue-600 to-amber-500 rounded-full"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <ThemeToggler />

            {user ? (
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("profile")}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-amber-50 dark:hover:from-blue-900/20 dark:hover:to-amber-900/20 transition-all duration-200"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-amber-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    {user.nomComplet?.[0]?.toUpperCase() || <User size={16} />}
                  </div>
                  <span className="hidden md:block text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {user.nomComplet || "Mon compte"}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      dropdownOpen === "profile" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownOpen === "profile" && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-blue-200 dark:border-amber-700 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                    <Link
                      href="/profile"
                      onClick={closeAllDropdowns}
                      className="flex items-center px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-amber-50 dark:hover:from-blue-900/20 dark:hover:to-amber-900/20 text-sm transition-all duration-200"
                    >
                      <User size={16} className="mr-2" />
                      Mon profil
                    </Link>
                    <Link
                      href="/borrowed"
                      onClick={closeAllDropdowns}
                      className="flex items-center px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-amber-50 dark:hover:from-blue-900/20 dark:hover:to-amber-900/20 text-sm transition-all duration-200"
                    >
                      Mes livres
                    </Link>
                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 text-sm transition-all duration-200"
                    >
                      <LogOut size={16} className="mr-2" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/signin"
                  className="px-4 py-2 text-blue-700 dark:text-amber-300 hover:underline font-semibold text-sm transition-all duration-200"
                >
                  Connexion
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-amber-500 text-white rounded-lg hover:opacity-90 hover:scale-105 transition-all duration-200 font-semibold text-sm shadow-lg"
                >
                  Inscription
                </Link>
              </div>
            )}

            {/* Toggle Mobile */}
            <button
              onClick={() => setNavbarOpen(!navbarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-amber-50 dark:hover:from-blue-900/20 dark:hover:to-amber-900/20 transition-all duration-200"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <span
                  className={`block h-0.5 w-6 bg-gray-800 dark:bg-gray-200 transition-all duration-300 ${
                    navbarOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                ></span>
                <span
                  className={`block h-0.5 w-6 bg-gray-800 dark:bg-gray-200 transition-all duration-300 ${
                    navbarOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`block h-0.5 w-6 bg-gray-800 dark:bg-gray-200 transition-all duration-300 ${
                    navbarOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        <div
          className={`lg:hidden transition-all duration-300 overflow-hidden ${
            navbarOpen
              ? "max-h-96 opacity-100 visible py-3 border-t border-blue-200 dark:border-amber-700"
              : "max-h-0 opacity-0 invisible"
          }`}
        >
          <nav className="space-y-2">
            {menuData.map((item, index) => {
              if (item.requiresAuth && !user) return null;

              const isActive = isItemActive(item);

              return (
                <button
                  key={index}
                  onClick={() => handleMenuClick(item)}
                  className={`w-full px-4 py-3 rounded-lg text-sm font-semibold border transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-100 to-amber-100 dark:from-blue-900/40 dark:to-amber-900/40 text-blue-800 dark:text-amber-300 border-blue-200 dark:border-amber-700 shadow-sm"
                      : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-amber-50 dark:hover:from-blue-900/20 dark:hover:to-amber-900/20 hover:text-blue-700 dark:hover:text-amber-300"
                  }`}
                >
                  {item.title}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Overlay pour fermer les menus */}
      {(dropdownOpen !== null || navbarOpen) && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black/20 dark:bg-black/40 backdrop-blur-sm"
          onClick={closeAllDropdowns}
        />
      )}
    </header>
  );
};

export default Header;