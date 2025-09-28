"use client";
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { ChevronDownIcon, HorizontaLDots } from "../icons/index";
import { Book, ClipboardList, Pen, User, Home, Settings, HelpCircle } from "lucide-react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

// Utilitaire simple pour gérer les classes conditionnelles (remplace cn)
const classNames = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Configuration centralisée des items de navigation
const useNavItems = () => {
  return useMemo(() => ({
    main: [
      {
        icon: <Home className="w-5 h-5" />,
        name: "Dashboard",
        path: "/admin",
      },
      {
        icon: <User className="w-5 h-5" />,
        name: "Utilisateurs",
        path: "/users",
      },
      {
        icon: <Pen className="w-5 h-5" />,
        name: "Auteurs",
        subItems: [
          { name: "Liste des Auteurs", path: "/authors" },
          { name: "Ajouter un Auteur", path: "/authors/create" },
        ],
      },
      {
        icon: <Book className="w-5 h-5" />,
        name: "Livres",
        subItems: [
          { name: "Liste des Livres", path: "/books" },
          { name: "Ajouter un Livre", path: "/books/create" },
        ],
      },
      {
        icon: <ClipboardList className="w-5 h-5" />,
        name: "Emprunts",
        subItems: [
          { name: "Liste des Emprunts", path: "/loans" },
          { name: "Demandes d'emprunt", path: "/loans/create" },
        ],
      },
    ] as NavItem[],
    others: [
      {
        icon: <Settings className="w-5 h-5" />,
        name: "Paramètres",
        path: "/settings",
      },
      {
        icon: <HelpCircle className="w-5 h-5" />,
        name: "Aide & Support",
        path: "/help",
      },
    ] as NavItem[],
  }), []);
};

// Composant pour les items de menu
interface MenuItemProps {
  item: NavItem;
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
  isActive: boolean;
  hasSubmenu?: boolean;
  isSubmenuOpen?: boolean;
  onSubmenuToggle?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  item,
  isExpanded,
  isHovered,
  isMobileOpen,
  isActive,
  hasSubmenu = false,
  isSubmenuOpen = false,
  onSubmenuToggle,
}) => {
  const showText = isExpanded || isHovered || isMobileOpen;

  const baseClasses = classNames(
    "menu-item group relative flex items-center w-full transition-all duration-200 ease-out rounded-xl",
    "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20",
    !isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start",
    isActive
      ? "menu-item-active bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30"
      : "menu-item-inactive"
  );

  const iconClasses = classNames(
    "transition-colors duration-200 flex-shrink-0",
    isActive
      ? "text-blue-600 dark:text-blue-400"
      : "text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
  );

  const textClasses = classNames(
    "menu-item-text transition-all duration-200",
    isActive
      ? "text-blue-600 dark:text-blue-400 font-semibold"
      : "text-gray-700 dark:text-gray-300"
  );

  const chevronClasses = classNames(
    "ml-auto w-4 h-4 transition-transform duration-200 flex-shrink-0",
    isSubmenuOpen
      ? "rotate-180 text-blue-600 dark:text-blue-400"
      : "text-gray-400"
  );

  const content = (
    <>
      <span className={iconClasses}>
        {item.icon}
      </span>

      {showText && (
        <span className={textClasses}>
          {item.name}
        </span>
      )}

      {hasSubmenu && showText && (
        <ChevronDownIcon className={chevronClasses} />
      )}
    </>
  );

  if (hasSubmenu) {
    return (
      <button
        onClick={onSubmenuToggle}
        className={baseClasses}
        aria-expanded={isSubmenuOpen}
      >
        {content}
      </button>
    );
  }

  return item.path ? (
    <Link href={item.path} className={baseClasses}>
      {content}
    </Link>
  ) : null;
};

// Composant pour les sous-items
interface SubMenuItemProps {
  subItem: { name: string; path: string; pro?: boolean; new?: boolean };
  isActive: boolean;
  isVisible: boolean;
}

const SubMenuItem: React.FC<SubMenuItemProps> = ({ subItem, isActive, isVisible }) => {
  const itemClasses = classNames(
    "menu-dropdown-item group relative transition-all duration-200 ease-out rounded-lg",
    "hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:translate-x-1",
    isActive
      ? "menu-dropdown-item-active bg-blue-50 dark:bg-blue-900/30 border-l-2 border-blue-500"
      : "menu-dropdown-item-inactive",
    isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
  );

  const dotClasses = classNames(
    "w-1.5 h-1.5 rounded-full transition-colors duration-200",
    isActive
      ? "bg-blue-500"
      : "bg-gray-300 dark:bg-gray-600 group-hover:bg-blue-400"
  );

  const badgeClasses = classNames(
    "menu-dropdown-badge text-xs px-2 py-1 rounded-full",
    isActive
      ? "menu-dropdown-badge-active bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      : "menu-dropdown-badge-inactive bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
  );

  return (
    <li>
      <Link
        href={subItem.path}
        className={itemClasses}
        style={{ transitionDelay: isVisible ? '0.1s' : '0s' }}
      >
        <span className="flex items-center gap-3">
          <span className={dotClasses} />
          {subItem.name}
        </span>

        <span className="flex items-center gap-1 ml-auto">
          {subItem.new && (
            <span className={badgeClasses}>
              New
            </span>
          )}
          {subItem.pro && (
            <span className={classNames(badgeClasses, isActive ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" : "")}>
              Pro
            </span>
          )}
        </span>
      </Link>
    </li>
  );
};

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const navItems = useNavItems();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);

  const [subMenuHeights, setSubMenuHeights] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  // Auto-ouvrir le submenu correspondant à la route actuelle
  useEffect(() => {
    let submenuMatched = false;

    Object.entries(navItems).forEach(([menuType, items]) => {
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type: menuType as "main" | "others", index });
              submenuMatched = true;
            }
          });
        } else if (nav.path && isActive(nav.path)) {
          setOpenSubmenu(null);
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive, navItems]);

  // Calculer les hauteurs des sous-menus
  useEffect(() => {
    if (openSubmenu) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      const element = subMenuRefs.current[key];
      if (element) {
        setSubMenuHeights(prev => ({
          ...prev,
          [key]: element.scrollHeight
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (type: "main" | "others", index: number) => {
    setOpenSubmenu(current =>
      current?.type === type && current.index === index ? null : { type, index }
    );
  };

  const renderMenuSection = (items: NavItem[], type: "main" | "others") => (
    <ul className="flex flex-col gap-2">
      {items.map((item, index) => {
        const hasSubmenu = !!item.subItems;
        const isSubmenuOpen = openSubmenu?.type === type && openSubmenu?.index === index;
        const isItemActive = item.path ? isActive(item.path) :
          item.subItems?.some(subItem => isActive(subItem.path));

        return (
          <li key={`${type}-${index}`}>
            <MenuItem
              item={item}
              isExpanded={isExpanded}
              isHovered={isHovered}
              isMobileOpen={isMobileOpen}
              isActive={!!isItemActive}
              hasSubmenu={hasSubmenu}
              isSubmenuOpen={isSubmenuOpen}
              onSubmenuToggle={() => handleSubmenuToggle(type, index)}
            />

            {hasSubmenu && item.subItems && (
              <div
                ref={el => {
                  if (el) {
                    subMenuRefs.current[`${type}-${index}`] = el;
                  }
                }}
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  height: isSubmenuOpen ? `${subMenuHeights[`${type}-${index}`] || 0}px` : '0px',
                }}
              >
                <ul className="mt-2 space-y-2 ml-8">
                  {item.subItems.map((subItem, subIndex) => (
                    <SubMenuItem
                      key={subItem.path}
                      subItem={subItem}
                      isActive={isActive(subItem.path)}
                      isVisible={isSubmenuOpen}
                    />
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  const sidebarClasses = classNames(
    "fixed mt-16 lg:mt-0 top-0 left-0 flex flex-col",
    "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800",
    "h-screen transition-all duration-300 ease-out z-50",
    "overflow-hidden",
    isExpanded || isMobileOpen || isHovered ? "w-80" : "w-24",
    isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
  );

  const logoContainerClasses = classNames(
    "py-8 flex items-center transition-all duration-300 border-b border-gray-100 dark:border-gray-800",
    !isExpanded && !isHovered ? "justify-center px-4" : "justify-start px-6"
  );

  const sectionTitleClasses = (showText: boolean) => classNames(
    "mb-4 text-xs uppercase tracking-wider font-semibold transition-all duration-200",
    "text-gray-500 dark:text-gray-400",
    showText ? "text-left px-6 opacity-100" : "text-center opacity-0"
  );

  const userProfileClasses = classNames(
    "p-4 border-t border-gray-100 dark:border-gray-800 transition-all duration-300",
    isExpanded || isHovered || isMobileOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
  );

  return (
    <aside
      className={sidebarClasses}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header avec logo */}
      <div className={logoContainerClasses}>
        <Link href="/admin" className="transition-transform hover:scale-105">
          {(isExpanded || isHovered || isMobileOpen) ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/Bibliothequenoir.png"
                alt="Bibliothèque Logo"
                width={140}
                height={50}
                priority
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/Bibliothequeblanc.png"
                alt="Bibliothèque Logo"
                width={140}
                height={50}
                priority
              />
            </>
          ) : (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/Bibliothequenoir.png"
                alt="Bibliothèque Logo"
                width={40}
                height={40}
                priority
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/Bibliothequeblanc.png"
                alt="Bibliothèque Logo"
                width={40}
                height={40}
                priority
              />
            </>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-6">
        <nav className="space-y-8">
          {/* Menu Principal */}
          <section>
            <h2 className={sectionTitleClasses(isExpanded || isHovered || isMobileOpen)}>
              {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots />}
            </h2>
            {renderMenuSection(navItems.main, "main")}
          </section>

          {/* Autres Sections */}
          <section>
            <h2 className={sectionTitleClasses(isExpanded || isHovered || isMobileOpen)}>
              {isExpanded || isHovered || isMobileOpen ? "Autres" : <HorizontaLDots />}
            </h2>
            {renderMenuSection(navItems.others, "others")}
          </section>
        </nav>
      </div>

      {/* User profile mini-card */}
      <div className={userProfileClasses}>
        <div className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-xs">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-white truncate">Admin</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs truncate">Administrateur</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;