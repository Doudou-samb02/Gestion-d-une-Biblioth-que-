"use client";
import { Search, BookOpen, Star, Quote } from "lucide-react";
 import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-32 bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Bienvenue dans votre bibliothèque numérique
        </h2>
        <p className="max-w-2xl text-lg md:text-xl mb-8">
          Découvrez, empruntez et profitez de milliers de livres en ligne.
        </p>
        {/* Search bar */}
        <div className="flex w-full max-w-lg bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden">
          <input
            type="text"
            placeholder="Rechercher un livre, un auteur..."
            className="flex-1 px-6 py-4 outline-none text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 text-lg"
          />
          <button className="bg-blue-600 text-white px-6 hover:bg-blue-700 flex items-center justify-center">
            <Search size={20}/>
          </button>
        </div>
      </section>

      {/* Nouveautés */}
      <section className="px-6 py-32">
        <h3 className="text-3xl font-bold mb-12 text-center">✨ Nouveautés</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {["Le Petit Prince", "L’Alchimiste", "1984", "Harry Potter"].map((book, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 hover:scale-105 transition">
              <div className="h-44 bg-gray-200 dark:bg-gray-700 rounded-md mb-4 flex items-center justify-center">
                <BookOpen className="text-gray-400 dark:text-gray-300" size={40}/>
              </div>
              <h4 className="font-bold text-lg">{book}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Auteur inconnu</p>
            </div>
          ))}
        </div>
      </section>

      {/* Populaires */}
      <section className="px-6 py-32 bg-gray-100 dark:bg-gray-800">
        <h3 className="text-3xl font-bold mb-12 text-center">🔥 Populaires</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {["Les Misérables", "Game of Thrones", "La Peste"].map((book, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 flex gap-6 hover:shadow-lg transition">
              <div className="h-24 w-24 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                <BookOpen className="text-gray-400 dark:text-gray-300" size={30}/>
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="font-bold">{book}</h4>
                <div className="flex items-center text-yellow-500 mt-2">
                  {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor"/>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Genres */}
      <section className="px-6 py-32">
        <h3 className="text-3xl font-bold mb-12 text-center">🏷️ Explorer par genres</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 text-center">
          {["Roman", "Science", "Biographie", "Histoire", "Poésie", "Fantasy"].map((genre, i) => (
            <div key={i} className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg py-8 shadow hover:bg-blue-200 dark:hover:bg-blue-800 cursor-pointer">
              {genre}
            </div>
          ))}
        </div>
      </section>

      {/* Auteurs en vedette */}
      <section className="px-6 py-32 bg-gray-100 dark:bg-gray-800">
        <h3 className="text-3xl font-bold mb-12 text-center">🧑‍🏫 Auteurs en vedette</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {["Victor Hugo", "George Orwell", "J.K. Rowling"].map((author, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center hover:shadow-lg transition">
              <div className="w-28 h-28 mx-auto rounded-full bg-gray-200 dark:bg-gray-700 mb-4"></div>
              <h4 className="font-bold text-lg">{author}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Auteur de plusieurs best-sellers</p>
            </div>
          ))}
        </div>
      </section>

      {/* Avis des lecteurs */}
      <section className="px-6 py-32">
        <h3 className="text-3xl font-bold mb-12 text-center">💬 Avis des lecteurs</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {[
            { name: "Awa", review: "J’adore cette appli, facile à utiliser et beaucoup de choix !" },
            { name: "Moussa", review: "J’ai redécouvert le plaisir de lire, merci MaBibliothèque !" },
            { name: "Fatou", review: "Très pratique pour emprunter des livres sans se déplacer." }
          ].map((r, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 hover:shadow-lg transition">
              <Quote className="text-blue-600 dark:text-blue-400 mb-2"/>
              <p className="italic">“{r.review}”</p>
              <p className="mt-4 font-semibold">— {r.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Avantages */}
      <section className="px-6 py-32 bg-gradient-to-r from-indigo-600 to-purple-600 text-white dark:text-white text-center">
        <h3 className="text-3xl font-bold mb-12">Pourquoi choisir MaBibliothèque ?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="p-8 bg-white/10 rounded-lg">
            <h4 className="font-bold mb-2">📖 Accès illimité</h4>
            <p>Lisez des milliers de livres sans limite où que vous soyez.</p>
          </div>
          <div className="p-8 bg-white/10 rounded-lg">
            <h4 className="font-bold mb-2">⚡ Rapidité</h4>
            <p>Un catalogue organisé et une recherche instantanée.</p>
          </div>
          <div className="p-8 bg-white/10 rounded-lg">
            <h4 className="font-bold mb-2">🌍 Accessible</h4>
            <p>Disponible sur web et mobile pour tous vos appareils.</p>
          </div>
        </div>
      </section>

    

{/* Call to Action */}
<section className="px-6 py-32 text-center">
  <h3 className="text-3xl font-bold mb-6">🚀 Rejoignez notre communauté</h3>
  <p className="mb-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
    Inscrivez-vous gratuitement et accédez à un monde de lecture sans limites.
  </p>

  <Link href="/signup">
    <button className="px-8 py-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md">
      Créer un compte
    </button>
  </Link>
</section>


    </div>
  );
}
