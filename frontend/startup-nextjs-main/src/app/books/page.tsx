"use client";
import { useState } from "react";
import Link from "next/link";

const BooksPage = () => {

  //a remplacer par le backend 
  
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
    <div className="container mx-auto py-30 px-4">
      <h1 className="text-4xl font-bold mb-8 flex items-center gap-2 text-gray-900 dark:text-white">
        📖 Tous les livres
      </h1>

      {/* Barre de recherche */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Rechercher un livre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md p-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      {/* Grille de livres */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <Link  key={book.id} href={`/borrow/${book.id}`}>
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-60 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {book.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {book.author}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Aucun livre trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default BooksPage;
