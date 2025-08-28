"use client";
import { useState, useEffect } from "react";

export default function Hero() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [categories, setCategories] = useState<any[]>([]);

  // 🔹 Récupérer les catégories au montage
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/categories");
        if (!res.ok) throw new Error("Erreur de récupération des catégories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = () => {
    console.log("Recherche :", search, genre);
    // 👉 Ici tu pourras faire un fetch vers ton backend /api/livres?search=...&categorie=...
  };

  return (
      <section className="relative w-full h-[600px] lg:h-[700px]">
        {/* Image de fond */}
        <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('./images/library-hero.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Contenu */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Bienvenue à <span className="text-blue-400">MaBibliothèque</span>
          </h1>
          <p className="text-white/90 mb-8 text-lg max-w-2xl">
            Découvrez, empruntez et profitez de milliers de livres en ligne.
          </p>

          {/* Barre de recherche */}
          <div className="flex flex-col md:flex-row gap-4 max-w-3xl w-full mx-auto">
            <input
                type="text"
                placeholder="Rechercher par titre ou auteur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border border-white/50 bg-white/90 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="px-4 py-3 rounded-lg border border-white/50 bg-white/90 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Tous les genres</option>
              {categories.map((cat) => (
                  <option key={cat.id} value={cat.nom}>
                    {cat.nom}
                  </option>
              ))}
            </select>
            <button
                onClick={handleSearch}
                className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md"
            >
              Rechercher
            </button>
          </div>
        </div>
      </section>
  );
}
