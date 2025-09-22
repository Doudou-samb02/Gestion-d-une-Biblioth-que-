"use client";
import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

const BooksPage = () => {

  const [books] = useState([
    { id: 1, title: "L'Alchimiste", author: "Paulo Coelho", cover: "/covers/alchimiste.jpg" },
    { id: 2, title: "1984", author: "George Orwell", cover: "/covers/1984.jpg" },
    { id: 3, title: "Le Petit Prince", author: "Antoine de Saint-Exupéry", cover: "/covers/petitprince.jpg" },
    { id: 4, title: "Sapiens", author: "Yuval Noah Harari", cover: "/covers/sapiens.jpg" },
  ]);

  const [search, setSearch] = useState("");

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">

      {/* Hero */}
      <section className="text-center py-40 bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">📖 Tous les livres</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          Parcourez notre catalogue complet et trouvez votre prochain livre préféré.
        </p>
      </section>

      {/* Barre de recherche */}
      <section className="flex justify-center py-10 px-4">
        <div className="w-full max-w-lg relative">
          <input
            type="text" 
            placeholder="Rechercher un livre ou un auteur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-4 pl-12 border border-gray-300 dark:border-gray-700 rounded-full shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300" size={20}/>
        </div>
      </section>

      {/* Grille de livres */}
      <section className="container mx-auto px-4 py-16">
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {filteredBooks.map((book) => (
              <Link key={book.id} href={`/borrow/${book.id}`}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-5">
                    <h2 className="text-lg font-semibold mb-1">{book.title}</h2>
                    <p className="text-gray-600 dark:text-gray-300">{book.author}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 text-lg mt-10">Aucun livre trouvé.</p>
        )}
      </section>
    </div>
  );
};

export default BooksPage;
