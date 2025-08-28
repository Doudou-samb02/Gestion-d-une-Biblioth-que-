"use client";
import { useAuth } from "./context/AuthContext";
import ScrollUp from "@/components/Common/ScrollUp";
import Hero from "@/components/Hero";
import RecentBooks from "@/components/Library/RecentBooks";
import TopAuthors from "@/components/Library/TopAuthors";
export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <section className="pt-32">
        <Hero />
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-dark">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-[#4A6CF7] mb-8 text-center">
            📚 Livres récents disponibles
          </h2>
          {!user ? (
            <p className="text-center text-red-500 mb-6">
              Connectez-vous pour emprunter des livres !
            </p>            
          ) : null}
           
          <RecentBooks />
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-[#4A6CF7] mb-8 text-center">
            🏆 Top auteurs
          </h2>
          <TopAuthors />
        </div>
      </section>

      <ScrollUp />
    </>
  );
}
