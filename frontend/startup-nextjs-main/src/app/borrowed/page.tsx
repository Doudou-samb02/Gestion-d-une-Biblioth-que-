"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // <-- importer le hook

interface BorrowedBook {
  id: number;
  title: string;
  author: string;
  cover: string;
  borrowDate: string;
  returnDate: string;
}

const BorrowedPage = () => {
  const { user } = useAuth(); // <-- récupérer l'utilisateur connecté
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // ce sont des donnees simuler à remplacer par le backend
    if (user) {
      const fakeData: BorrowedBook[] = [
        {
          id: 1,
          title: "L'Alchimiste",
          author: "Paulo Coelho",
          cover: "/covers/alchimiste.jpg",
          borrowDate: "2025-08-01",
          returnDate: "2025-08-15",
        },
        {
          id: 2,
          title: "1984",
          author: "George Orwell",
          cover: "/covers/1984.jpg",
          borrowDate: "2025-08-05",
          returnDate: "2025-08-19",
        },
      ];
      setBorrowedBooks(fakeData);
    } else {
      setBorrowedBooks([]); // aucun livre si pas connecté
    }
  }, [user]);

  const filteredBooks = borrowedBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
  );

  if (!user) {
    return (
      <div className="container mx-auto py-30 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          🛑 Connectez-vous pour voir vos livres empruntés
        </h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-30 px-4">
      <h1 className="text-4xl font-bold mb-8 flex items-center gap-2 text-gray-900 dark:text-white">
        📝 Mes livres empruntés
      </h1>

      {/* Barre de recherche */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Rechercher un livre emprunté..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md p-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      {/* Grille de livres empruntés */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
            >
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-60 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {book.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  {book.author}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  📅 Emprunté le : {book.borrowDate}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ⏳ À rendre le : {book.returnDate}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Aucun livre emprunté.</p>
        )}
      </div>
    </div>
  );
};

export default BorrowedPage;
