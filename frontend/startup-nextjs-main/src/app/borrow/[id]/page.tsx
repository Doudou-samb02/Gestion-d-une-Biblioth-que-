"use client";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import {
  Calendar, User, BookOpen, ArrowLeft,
  Star, MessageCircle, CheckCircle, ChevronRight
} from "lucide-react";

interface Livre {
  id: number;
  titre: string;
  isbn: string;
  langue: string;
  datePublication: string;
  nbPages: number;
  nbExemplaires: number;
  description: string;
  cover: string;
  disponible: boolean;
  auteurId: number;
  auteurNom: string;
  categorieId: number;
  categorieNom: string;
  empruntsCount: number;
  rating?: number;
}

interface Avis {
  id: number;
  commentaire: string;
  note: number;
  utilisateurNom: string;
  livreTitre?: string;
}

const BorrowPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [book, setBook] = useState<Livre | null>(null);
  const [avis, setAvis] = useState<Avis[]>([]);
  const [similarBooks, setSimilarBooks] = useState<Livre[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const resBook = await fetch(`http://localhost:8080/api/livres/${params.id}`);
        const dataBook: Livre = await resBook.json();
        setBook(dataBook);

        const resAvis = await fetch(`http://localhost:8080/api/livres/${params.id}/avis`);
        const dataAvis: Avis[] = await resAvis.json();
        setAvis(dataAvis);

        const resSimilar = await fetch(`http://localhost:8080/api/livres/categorie/${dataBook.categorieId}`);
        const dataSimilar: Livre[] = await resSimilar.json();
        setSimilarBooks(dataSimilar.filter(b => b.id !== dataBook.id));
      } catch (error) {
        console.error(error);
        router.push("/books");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [params.id, router]);

  // 🔹 Nouvelle fonction : appel du backend pour demander un emprunt
  const borrowBook = async () => {
    if (!user) {
      alert("Vous devez être connecté pour emprunter un livre !");
      router.push("/login");
      return;
    }

    try {
      setIsBorrowing(true);
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8080/api/emprunts/demander", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ livreId: book?.id }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("✅ Emprunt demandé :", data);

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        const errText = await res.text();
        alert("Erreur lors de la demande : " + errText);
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      alert("Erreur réseau, veuillez réessayer.");
    } finally {
      setIsBorrowing(false);
    }
  };

  const submitReview = async () => {
    if (!userRating) {
      alert("Veuillez attribuer une note");
      return;
    }

    const newAvis: Avis = {
      id: avis.length + 1,
      utilisateurNom: user?.name || "Utilisateur",
      note: userRating,
      commentaire: reviewText
    };

    setAvis([newAvis, ...avis]);
    setReviewText("");
    setUserRating(0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement du livre...</p>
        </div>
      </div>
    );
  }

  if (!book) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white p-6 rounded-2xl shadow-2xl max-w-sm animate-in slide-in-from-right duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle size={32} className="text-white" />
            <div>
              <h4 className="font-bold text-lg">Réservation confirmée !</h4>
              <p className="text-sm opacity-90">Votre demande d’emprunt a été envoyée.</p>
            </div>
          </div>
          <button onClick={() => setShowSuccess(false)} className="absolute top-2 right-2 text-white hover:text-gray-200">×</button>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/books")}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors mb-2"
          >
            <ArrowLeft size={20} />
            Retour aux livres
          </button>
          <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Bibliothèque</span>
            <ChevronRight size={16} />
            <span className="text-blue-600 font-medium">{book.categorieNom}</span>
            <ChevronRight size={16} />
            <span className="text-gray-900 dark:text-white truncate">{book.titre}</span>
          </nav>
        </div>

        <div className="space-y-8">
          {/* Carte livre avec bouton d'emprunt */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
            <div className="p-8 flex flex-col lg:flex-row gap-8">
              <img
                src={book.cover}
                alt={book.titre}
                className="w-full lg:w-80 h-96 lg:h-auto rounded-2xl object-cover mx-auto lg:mx-0"
              />
              <div className="flex-1 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-3">{book.titre}</h1>
                  <p className="text-xl text-blue-600 dark:text-blue-400 font-semibold">{book.auteurNom}</p>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <span className={`px-4 py-2 rounded-full font-medium ${
                    book.disponible
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  }`}>
                    {book.disponible ? "Disponible" : "Indisponible"}
                  </span>

                  <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-2">
                      <BookOpen size={18} />
                      {book.nbPages} pages
                    </span>
                    <span className="flex items-center gap-2">
                      <User size={18} />
                      {book.langue}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(star => (
                      <Star
                        key={star}
                        size={20}
                        className={star <= (book.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold">{book.rating?.toFixed(1)}/5.0</span>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Description</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{book.description}</p>
                </div>

                {/* Bouton d'emprunt */}
                <div className="pt-4">
                  <button
                    disabled={!book.disponible || isBorrowing}
                    onClick={borrowBook}
                    className={`w-full lg:w-auto px-8 py-4 rounded-xl text-white font-semibold transition-all text-lg ${
                      book.disponible
                        ? "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isBorrowing ? "Traitement..." : "Emprunter ce livre"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section avis */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Avis des lecteurs ({avis.length})</h2>
            </div>

            {user && (
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <MessageCircle size={20} className="text-blue-500" />
                  Partagez votre avis
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-medium">Votre note:</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(star => (
                      <Star
                        key={star}
                        size={28}
                        className={`cursor-pointer transition-transform hover:scale-110 ${
                          star <= userRating
                            ? "text-yellow-400 fill-current drop-shadow-sm"
                            : "text-gray-300 hover:text-yellow-200"
                        }`}
                        onClick={() => setUserRating(star)}
                      />
                    ))}
                  </div>
                </div>
                <textarea
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  placeholder="Qu'avez-vous pensé de ce livre ?"
                  className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl mb-4 dark:bg-gray-800 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows={4}
                />
                <div className="flex justify-end">
                  <button
                    onClick={submitReview}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Publier l'avis
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {avis.map(avis => (
                <div key={avis.id} className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold">{avis.utilisateurNom}</span>
                    <div className="flex items-center gap-1 bg-white dark:bg-gray-700 px-3 py-1 rounded-full">
                      {[1,2,3,4,5].map(star => (
                        <Star
                          key={star}
                          size={16}
                          className={star <= avis.note ? "text-yellow-400 fill-current" : "text-gray-300"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{avis.commentaire}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Livres similaires */}
          {similarBooks.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-800">
              <h3 className="text-2xl font-bold mb-6">Livres similaires</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {similarBooks.map(livre => (
                  <div
                    key={livre.id}
                    className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden shadow hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => router.push(`/books/${livre.id}`)}
                  >
                    <img
                      src={livre.cover}
                      alt={livre.titre}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white truncate mb-1">{livre.titre}</h4>
                      <p className="text-gray-500 text-sm truncate">{livre.auteurNom}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          livre.disponible ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {livre.disponible ? "Disponible" : "Indisponible"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BorrowPage;
