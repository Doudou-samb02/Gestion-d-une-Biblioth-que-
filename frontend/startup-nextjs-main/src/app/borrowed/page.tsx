"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

interface BorrowedBook {
  id: number;
  title: string;
  author: string;
  cover: string;
  borrowDate: string | null;
  returnDate: string | null;
  status: string;
  returned: boolean;
}

const BorrowedPage = () => {
  const { user } = useAuth();
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      if (!user) {
        setBorrowedBooks([]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:8080/api/emprunts/mes-emprunts", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Erreur lors du chargement des emprunts");

        const data = await res.json();

        const mappedBooks: BorrowedBook[] = data.map((e: any) => ({
          id: e.id,
          title: e.livreTitre,
          author: e.auteurNom || "Auteur inconnu",
          cover: e.cover || "/covers/default.jpg",
          borrowDate: e.dateEmprunt,
          returnDate: e.dateLimiteRetour,
          status: e.statut,
          returned: e.rendu,
        }));

        setBorrowedBooks(mappedBooks);
      } catch (err) {
        console.error(err);
        setBorrowedBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowedBooks();
  }, [user]);

  const filteredBooks = borrowedBooks.filter(
      (book) =>
          book.title.toLowerCase().includes(search.toLowerCase()) ||
          book.author.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VALIDE":
        return "bg-green-100 text-green-700";
      case "EN_ATTENTE":
        return "bg-yellow-100 text-yellow-700";
      case "REJETE":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ✅ Fonction pour calculer les jours restants et style visuel
  const getDeadlineInfo = (returnDate: string | null) => {
    if (!returnDate) return { text: null, border: "" };

    const today = new Date();
    const deadline = new Date(returnDate);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return {
        text: `⏳ Il vous reste ${diffDays} jour${diffDays > 1 ? "s" : ""}`,
        border: "border-2 border-green-500",
      };
    } else if (diffDays === 0) {
      return {
        text: "⚠️ Dernier jour pour rendre ce livre !",
        border: "border-2 border-orange-500",
      };
    } else {
      return {
        text: `❌ En retard de ${Math.abs(diffDays)} jour${Math.abs(diffDays) > 1 ? "s" : ""}`,
        border: "border-2 border-red-600",
      };
    }
  };

  if (!user) {
    return (
        <div className="container mx-auto py-30 px-4 text-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            🛑 Connectez-vous pour voir vos livres empruntés
          </h1>
        </div>
    );
  }

  if (loading) {
    return (
        <div className="container mx-auto py-30 px-4 text-center">
          <p className="text-gray-500 dark:text-gray-400">Chargement...</p>
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
              filteredBooks.map((book) => {
                const deadlineInfo = getDeadlineInfo(book.returnDate);
                return (
                    <div
                        key={book.id}
                        className={`bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer ${deadlineInfo.border}`}
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
                          📅 Emprunté le : {book.borrowDate || "—"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ⏳ À rendre le : {book.returnDate || "—"}
                        </p>

                        {/* Badge statut */}
                        <span
                            className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                book.status
                            )}`}
                        >
                    {book.status}
                  </span>

                        {/* ✅ Jours restants */}
                        {deadlineInfo.text && (
                            <p className="mt-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                              {deadlineInfo.text}
                            </p>
                        )}

                        {book.returned && (
                            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                              ✅ Déjà rendu
                            </p>
                        )}
                      </div>
                    </div>
                );
              })
          ) : (
              <p className="text-gray-500 dark:text-gray-400">Aucun livre emprunté.</p>
          )}
        </div>
      </div>
  );
};

export default BorrowedPage;
