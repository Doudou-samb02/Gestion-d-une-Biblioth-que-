"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggler from "./ThemeToggler";
import { useAuth } from "../../app/context/AuthContext"; 

const menuData = [
  { title: "Accueil", path: "/" },
  { title: "Tous les livres", path: "/books" },
  { title: "Mes livres empruntés", path: "/borrowed" },
];

const Header = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth(); 

  useEffect(() => {
    const handleStickyNavbar = () => setSticky(window.scrollY >= 80);
    window.addEventListener("scroll", handleStickyNavbar);
    return () => window.removeEventListener("scroll", handleStickyNavbar);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        sticky
          ? "bg-white/80 dark:bg-gray-dark/80 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between lg:justify-center py-4 relative">
          {/* Logo */}
          <Link
            href="/"
            className={`block w-40 transition-all duration-300 absolute left-0 ${
              sticky ? "py-2" : "py-5"
            }`}
          >
            <Image
              src="/images/Bibliothequenoir.png"
              alt="logo"
              width={140}
              height={30}
              className="w-25 h-25 dark:hidden"
            />
            <Image
              src="/images/Bibliothequeblanc.png"
              alt="logo"
              width={140}
              height={30}
              className="hidden w-25 h-25 dark:block"
            />
          </Link>

          {/* Menu */}
          <nav
            className={`absolute top-full left-0 w-full p-6 bg-white dark:bg-gray-dark lg:bg-transparent lg:dark:bg-transparent 
              lg:static lg:flex lg:items-center lg:justify-center lg:w-auto lg:p-0 transition-all duration-300 ${
                navbarOpen
                  ? "visible opacity-100 translate-y-0"
                  : "invisible opacity-0 -translate-y-4 pointer-events-none lg:visible lg:opacity-100 lg:translate-y-0 lg:pointer-events-auto"
              }`}
          >
            <ul className="flex flex-col items-center gap-4 lg:flex-row lg:gap-10">
              {menuData.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.path}
                    onClick={() => setNavbarOpen(false)}
                    className={`text-lg font-medium transition-colors duration-200 ${
                      pathname === item.path
                        ? "text-primary"
                        : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4 absolute right-0">
            <ThemeToggler />

            {user ? (
              // Si connecté, affiche l'icône du profil
              <Link
                href="/profile"
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600"
              >
                <img
                  src={"/images/profile.png"}
                  alt="Profil"
                  className="w-full h-full object-cover"
                />
              </Link>
            ) : (
              // Si non connecté, boutons Se connecter / S'inscrire
              <>
                <Link
                  href="/signin"
                  className="hidden md:block px-4 py-2 text-base font-medium text-dark hover:text-primary dark:text-white"
                >
                  Se connecter
                </Link>
                <Link
                  href="/signup"
                  className="hidden md:block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  S'inscrire
                </Link>
              </>
            )}

           
          </div>
        </div>
      </div>

     
    </header>
  );
};

export default Header;
