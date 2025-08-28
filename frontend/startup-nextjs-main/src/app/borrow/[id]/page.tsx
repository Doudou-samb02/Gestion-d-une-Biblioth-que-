"use client";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";

const BorrowPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [book, setBook] = useState<{ id: number; title: string; author: string; cover?: string } | null>(null);

  //a remplacer par la backend pour la table livre ajouter le champs cover pour les images
  
  const books = [
    { id: 1, title: "L'Alchimiste", author: "Paulo Coelho", cover: "/covers/alchimiste.jpg" },
    { id: 2, title: "1984", author: "George Orwell", cover: "/covers/1984.jpg" },
    { id: 3, title: "Le Petit Prince", author: "Antoine de Saint-Exupéry", cover: "/covers/petitprince.jpg" },
    { id: 4, title: "Sapiens", author: "Yuval Noah Harari", cover: "/covers/sapiens.jpg" },
  ];

  useEffect(() => {
    const foundBook = books.find((b) => b.id === Number(params.id));
    if (!foundBook) {
      router.push("/books");
    } else {
      setBook(foundBook);
    }
  }, [params.id, router]);

  const borrowBook = () => {
    if (!user) {
      alert("Vous devez être connecté pour emprunter un livre !");
      router.push("/login");
      return;
    }
    alert(`Livre "${book?.title}" emprunté avec succès !`);
  };

  if (!book) return null;

  return (
    <div className="container mx-auto py-30">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition">
        {book.cover && (
          <img src={book.cover} alt={book.title} className="w-full h-72 object-cover" />
        )}
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-2">Auteur : {book.author}</p>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Date d'emprunt : {new Date().toLocaleDateString()}
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Date de retour : {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}
          </p>
          <button
            onClick={borrowBook}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
          >
            Emprunter
          </button>
        </div>
      </div>
    </div>
  );
};

export default BorrowPage;
