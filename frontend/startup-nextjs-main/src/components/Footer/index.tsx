"use client";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-6 mt-140">
      <div className="container mx-auto text-center text-gray-600 dark:text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} Bibliothèque App. Tous droits réservés.
        </p>
        <p className="mt-2">
          <Link href="/" className="hover:text-blue-600">
            Accueil
          </Link>{" "}
          |{" "}
          <Link href="/profile" className="hover:text-blue-600">
            Profil
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
