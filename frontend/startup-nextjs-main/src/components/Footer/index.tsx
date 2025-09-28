"use client";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Clock } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Accueil", path: "/" },
    { name: "Catalogue", path: "/books" },
    { name: "Mes emprunts", path: "/borrowed" },
    { name: "Mon profil", path: "/profile" }
  ];

  const infoLinks = [
    { name: "À propos", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "FAQ", path: "/faq" },
    { name: "Conditions d'utilisation", path: "/terms" }
  ];

  const contactInfo = [
    { icon: <Phone size={18} />, text: "01 23 45 67 89" },
    { icon: <Mail size={18} />, text: "contact@mabibliotheque.fr" },
    { icon: <MapPin size={18} />, text: "123 Avenue de la Lecture, 75000 Paris" },
    { icon: <Clock size={18} />, text: "Lun-Ven: 9h-18h | Sam: 10h-17h" }
  ];

  const socialLinks = [
    { icon: <Facebook size={20} />, path: "#", name: "Facebook" },
    { icon: <Twitter size={20} />, path: "#", name: "Twitter" },
    { icon: <Instagram size={20} />, path: "#", name: "Instagram" }
  ];

  return (
    <footer className="bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-200 mt-20">
      {/* Section principale */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Logo et description */}
          <div>
            <Link href="/" className="flex items-center mb-4">
              <div className="relative w-28 h-12">
                <Image
                  src="/images/Bibliothequenoir.png"
                  alt="logo"
                  fill
                  className="object-contain dark:hidden"
                />
                <Image
                  src="/images/Bibliothequeblanc.png"
                  alt="logo"
                  fill
                  className="object-contain hidden dark:block"
                />
              </div>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm leading-relaxed">
              Votre bibliothèque numérique moderne. Découvrez, réservez et empruntez vos livres
              en toute simplicité. Rejoignez notre communauté de lecteurs passionnés.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.path}
                  className="p-2 bg-blue-50 dark:bg-slate-800 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-amber-500 hover:text-white transition-all duration-200"
                  aria-label={social.name}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-600 dark:text-amber-400">Navigation</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.path}
                    className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-amber-400 transition-colors duration-200 text-sm flex items-center"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-500 dark:text-blue-400">Informations</h3>
            <ul className="space-y-2">
              {infoLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.path}
                    className="text-slate-600 dark:text-slate-400 hover:text-amber-500 dark:hover:text-blue-400 transition-colors duration-200 text-sm flex items-center"
                  >
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-2"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-600 dark:text-amber-400">Contact</h3>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="text-amber-500 dark:text-blue-400 mt-0.5">{item.icon}</div>
                  <span className="text-slate-600 dark:text-slate-400 text-sm">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-600 dark:text-slate-400 text-sm mb-2 md:mb-0">
              © {currentYear} Bibliothèque App. Tous droits réservés.
            </div>
            <div className="flex space-x-4 text-sm text-slate-600 dark:text-slate-400">
              <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-amber-400 transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="/terms" className="hover:text-amber-500 dark:hover:text-blue-400 transition-colors">
                Conditions d'utilisation
              </Link>
              <Link href="/cookies" className="hover:text-blue-600 dark:hover:text-amber-400 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
