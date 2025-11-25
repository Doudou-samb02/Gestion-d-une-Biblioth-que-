"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Avis = {
  id: number;
  utilisateurNom: string;
  note: number;
  commentaire: string;
};

type User = {
  id: string;
  email: string;
  name?: string; // correction ici : name optionnel
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
  nombreEmprunts?: number;
};

interface BorrowPageProps {
  params: { id: string };
}

const BorrowPage = ({ params }: BorrowPageProps) => {
  const [book, setBook] = useState<Livre | null>(null);
  const [avis, setAvis] = useState<Avis[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/livres/${params.id}`);
        if (!res.ok) throw new Error("Erreur backend");
        const data = await res.json();
        setBook(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchAvis = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/livres/${params.id}/avis`);
        if (!res.ok) throw new Error("Erreur backend");
        const data = await res.json();
        setAvis(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBook();
    fetchAvis();
  }, [params.id]);

  const handleSubmitAvis = () => {
    const newAvis: Avis = {
      id: avis.length + 1,
      utilisateurNom: user?.name || "Utilisateur", // correction ici
      note: userRating,
      commentaire: reviewText,
    };

    setAvis([...avis, newAvis]);
    setUserRating(0);
    setReviewText("");
  };

  if (!book) return <div>Chargement...</div>;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">{book.titre}</h1>
      <p className="text-sm mb-2">{book.auteurNom}</p>
      <p className="text-sm mb-4">
        {book.disponible ? "Disponible" : "Indisponible"}
      </p>

      {/* Avis */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Avis</h2>
        {avis.length === 0 ? (
          <p>Aucun avis pour le moment.</p>
        ) : (
          <ul className="space-y-2">
            {avis.map((a) => (
              <li key={a.id} className="border rounded p-2">
                <p className="font-semibold">{a.utilisateurNom}</p>
                <p>Note: {a.note}</p>
                <p>{a.commentaire}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Formulaire d'avis */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Ajouter un avis</h2>
        <input
          type="number"
          min={0}
          max={5}
          value={userRating}
          onChange={(e) => setUserRating(Number(e.target.value))}
          placeholder="Note (0-5)"
          className="border rounded px-2 py-1 mr-2"
        />
        <input
          type="text"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Commentaire"
          className="border rounded px-2 py-1 mr-2"
        />
        <button
          onClick={handleSubmitAvis}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition-colors"
        >
          Envoyer
        </button>
      </section>
    </div>
  );
};

export default BorrowPage;
