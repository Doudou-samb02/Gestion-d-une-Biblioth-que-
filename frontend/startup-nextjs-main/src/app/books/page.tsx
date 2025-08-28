"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

interface Book {
    id: number;
    titre: string;
    auteurNom?: string;
    categorieNom?: string;
    disponible: boolean;
    cover?: string;
}

const BooksPage = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [search, setSearch] = useState("");
    const { user } = useAuth(); // null si pas connecté

    // ✅ Charger les livres depuis ton backend
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/livres");
                if (!res.ok) throw new Error("Erreur de chargement des livres");
                const data = await res.json();
                setBooks(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchBooks();
    }, []);

    // ✅ Recherche
    const filteredBooks = books.filter(
        (book) =>
            book.titre.toLowerCase().includes(search.toLowerCase()) ||
            (book.auteurNom || "").toLowerCase().includes(search.toLowerCase())
    );

    // ✅ Emprunter un livre
    const handleBorrow = async (bookId: number) => {
        if (!user) {
            alert("Veuillez vous connecter pour emprunter un livre !");
            return;
        }

        try {
            const res = await fetch("http://localhost:8080/api/emprunts/demander", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    livreId: bookId,
                    jours: 14,
                }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Impossible d’emprunter le livre : ${errorText}`);
            }

            alert("✅ Demande d’emprunt envoyée !");
        } catch (err) {
            console.error(err);
            alert("❌ Erreur lors de l’emprunt.");
        }
    };


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
                        <div
                            key={book.id}
                            className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                        >
                            <img
                                src={book.cover || "/covers/default.jpg"}
                                alt={book.titre}
                                className="w-full h-60 object-cover"
                            />
                            <div className="p-4">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {book.titre}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {book.auteurNom || "Auteur inconnu"}
                                </p>

                                {/* ✅ Bouton visible uniquement si connecté */}
                                {user && (
                                    <button
                                        onClick={() => handleBorrow(book.id)}
                                        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Emprunter
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">
                        Aucun livre trouvé.
                    </p>
                )}
            </div>
        </div>
    );
};

export default BooksPage;
