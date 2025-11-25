"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Star, BookOpen, Clock, Filter, X } from "lucide-react";

type Livre = {
  id: number;
  titre: string;
  auteurNom?: string;
  categorieNom?: string;
  disponible: boolean;
  cover?: string;
  anneePublication?: number;
  notation?: number;
  nombreEmprunts?: number;
};

const BooksPage = () => {
  const [books, setBooks] = useState<Livre[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("title");
  const [showFilters, setShowFilters] = useState(false);

  // Charger les livres depuis le backend
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/livres");
        if (!res.ok) throw new Error("Erreur backend");
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.error("Erreur de chargement :", err);
      }
    };
    fetchBooks();
  }, []);

  // Filtrage et recherche
  const filteredBooks = books
    .filter((book) =>
      book.titre.toLowerCase().includes(search.toLowerCase()) ||
      (book.auteurNom || "").toLowerCase().includes(search.toLowerCase()) ||
      (book.categorieNom || "").toLowerCase().includes(search.toLowerCase())
    )
    .filter((book) =>
      selectedCategory ? book.categorieNom === selectedCategory : true
    )
    .filter((book) => {
      if (availabilityFilter === "available") return book.disponible;
      return true; // "all" affiche tout
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.titre.localeCompare(b.titre);
        case "author":
          return (a.auteurNom || "").localeCompare(b.auteurNom || "");
        case "year":
          return (b.anneePublication || 0) - (a.anneePublication || 0);
        case "rating":
          return (b.notation || 0) - (a.notation || 0);
        default:
          return 0;
      }
    });

  // Catégories uniques
  const categories = [...new Set(books.map(book => book.categorieNom).filter(Boolean))];

  const clearFilters = () => {
    setSelectedCategory("");
    setAvailabilityFilter("all");
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">

      {/* Hero Section */}
      <section className="relative py-20 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/hero-bg.jpg" alt="Bibliothèque" className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-blue-900/60"></div>
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">📚 Notre Bibliothèque</h1>
          <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto opacity-95">
            Découvrez notre collection complète de livres. Explorez, rêvez, et trouvez votre prochaine lecture.
          </p>
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-8">
            {[{ number: books.length, label: "Livres" },
              { number: new Set(books.map(b => b.auteurNom)).size, label: "Auteurs" },
              { number: categories.length, label: "Genres" }].map((stat, i) => (
              <div key={i} className="text-center p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                <div className="text-2xl font-bold text-white">{stat.number}</div>
                <div className="text-xs opacity-90 text-amber-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Barre de recherche et filtres */}
      <section className="container mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 mb-6 border border-slate-200 dark:border-slate-700">

          {/* Barre de recherche */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Rechercher un livre, un auteur, un genre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-base border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Filtres rapides */}
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-sm"
              >
                <Filter size={16} /> Filtres
              </button>

              {/* Filtres disponibilité */}
              <div className="flex gap-2">
                {[
                  { value: "all", label: "Tous" },
                  { value: "available", label: "Disponibles" }
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setAvailabilityFilter(filter.value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      availabilityFilter === filter.value
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tri */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="title">Trier par titre</option>
              <option value="author">Trier par auteur</option>
              <option value="year">Plus récents</option>
              <option value="rating">Mieux notés</option>
            </select>
          </div>

          {/* Filtres avancés */}
          {showFilters && (
            <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-sm">Filtres avancés</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <X size={14} /> Tout effacer
                </button>
              </div>

              {/* Filtre par catégorie */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-2">Genres</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(selectedCategory === category ? "" : category)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedCategory === category
                          ? "bg-amber-500 text-slate-900"
                          : "bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-500"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Résultats */}
      <section className="container mx-auto px-4 pb-16">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100">
              Livres {selectedCategory && `- ${selectedCategory}`}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {filteredBooks.length} livre{filteredBooks.length > 1 ? "s" : ""} trouvé{filteredBooks.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Grille de livres compacte */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredBooks.map((book) => (
              <Link key={book.id} href={`/borrow/${book.id}`}>
                <div className="group bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 cursor-pointer border border-slate-200 dark:border-slate-700 overflow-hidden">

                  {/* Image */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={book.cover || "/images/default-book-cover.jpg"}
                      alt={book.titre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Contenu */}
                  <div className="p-3">
                    <h3 className="font-semibold text-base mb-1 truncate text-blue-900 dark:text-blue-100">{book.titre}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 truncate">{book.auteurNom}</p>

                    {/* Catégorie et année */}
                    <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mb-2">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">{book.categorieNom}</span>
                      {book.anneePublication && <span>{book.anneePublication}</span>}
                    </div>

                    {/* Disponibilité */}
                    <div className={`text-xs font-medium ${book.disponible ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}>
                      {book.disponible ? "Disponible" : "Indisponible"}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <h3 className="text-base font-semibold text-slate-600 dark:text-slate-400 mb-2">Aucun livre trouvé</h3>
            <p className="text-slate-500 dark:text-slate-500 mb-4 text-sm">Essayez de modifier vos critères de recherche ou de filtrage</p>
            <button onClick={clearFilters} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default BooksPage;
