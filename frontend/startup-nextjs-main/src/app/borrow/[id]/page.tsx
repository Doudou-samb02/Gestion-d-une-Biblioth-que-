"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

type Avis = {
  id: number;
  utilisateurNom: string;
  note: number;
  commentaire: string;
};

type User = {
  id: string;
  email: string;
  name?: string;
};

type Livre = {
  id: number;
  titre: string;
  auteurNom?: string;
  categorieNom?: string;
  disponible: boolean;
  cover?: string;
  anneePublication?: number;
  notation?: number;
};

export default function BorrowPage() {
  const params = useParams();
  const id = params?.id; // id du livre

  const [book, setBook] = useState<Livre | null>(null);
  const [avis, setAvis] = useState<Avis[]>([]);
  const [userRating, setUserRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");

  const user: User = { id: "1", email: "test@test.com", name: "Utilisateur Test" };

  useEffect(() => {
    if (!id) return;
    async function fetchData() {
      try {
        const resBook = await fetch(`/api/livres/${id}`);
        const dataBook: Livre = await resBook.json();
        setBook(dataBook);

        const resAvis = await fetch(`/api/livres/${id}/avis`);
        const dataAvis: Avis[] = await resAvis.json();
        setAvis(dataAvis);
      } catch (err) {
        console.error("Erreur chargement :", err);
      }
    }
    fetchData();
  }, [id]);

  const handleSubmitAvis = () => {
    const newAvis: Avis = {
      id: avis.length + 1,
      utilisateurNom: user?.name || "Utilisateur",
      note: userRating,
      commentaire: reviewText,
    };
    setAvis([...avis, newAvis]);
    setUserRating(0);
    setReviewText("");
  };

  if (!book) return <div className="p-4">Chargement du livre...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">{book.titre}</h1>
      <p className="text-sm mb-2">{book.auteurNom}</p>
      <p className={`text-xs mb-4 ${book.disponible ? "text-green-600" : "text-red-600"}`}>
        {book.disponible ? "Disponible" : "Indisponible"}
      </p>

      <section className="mb-4">
        <h2 className="font-semibold mb-2">Avis</h2>
        {avis.length === 0 ? (
          <p>Aucun avis pour le moment.</p>
        ) : (
          <ul>
            {avis.map((a) => (
              <li key={a.id} className="border p-2 rounded mb-2">
                <p className="font-semibold">{a.utilisateurNom}</p>
                <p>Note: {a.note}</p>
                <p>{a.commentaire}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-semibold mb-2">Ajouter un avis</h2>
        <div className="flex flex-col sm:flex-row gap-2 mb-2">
          <input
            type="number"
            min={0}
            max={5}
            value={userRating}
            onChange={(e) => setUserRating(Number(e.target.value))}
            placeholder="Note (0-5)"
            className="border rounded px-2 py-1"
          />
          <input
            type="text"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Commentaire"
            className="border rounded px-2 py-1 flex-1"
          />
        </div>
        <button
          onClick={handleSubmitAvis}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition-colors"
        >
          Envoyer
        </button>
      </section>
    </div>
  );
}
