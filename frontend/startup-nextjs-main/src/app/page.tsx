"use client";

import { useEffect, useState } from "react";
import { Search, BookOpen, Star, Quote, Bell, MapPin, Clock, Users, BookText, UserCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface LivreDTO {
  id: number;
  titre: string;
  auteurNom: string;
  cover?: string;
  disponible: boolean;
  datePublication: string;
  nbEmprunts: number;
}

interface AuteurDTO {
  id: number;
  nomComplet: string;
  booksCount?: number;
  specialty?: string;
}

interface AvisDTO {
  id: number;
  commentaire: string;
  note: number;
  utilisateurNom: string;
  livreTitre: string;
}

export default function Home() {
  const [metrics, setMetrics] = useState({ livres: 0, auteurs: 0, lecteurs: 0 });
  const [latestBooks, setLatestBooks] = useState<LivreDTO[]>([]);
  const [mostBorrowed, setMostBorrowed] = useState<LivreDTO[]>([]);
  const [featuredAuthors, setFeaturedAuthors] = useState<AuteurDTO[]>([]);
  const [recentReviews, setRecentReviews] = useState<AvisDTO[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Horaires d'ouverture de la bibliothèque
  const horairesOuverture = [
    { jour: "Lundi", heures: "09h00 - 18h00" },
    { jour: "Mardi", heures: "09h00 - 18h00" },
    { jour: "Mercredi", heures: "09h00 - 18h00" },
    { jour: "Jeudi", heures: "09h00 - 18h00" },
    { jour: "Vendredi", heures: "09h00 - 17h00" },
    { jour: "Samedi", heures: "10h00 - 16h00" },
    { jour: "Dimanche", heures: "Fermé" }
  ];

  // Correction de la détection des sections
  useEffect(() => {
    const handleScroll = () => {
      // Cette fonction sera gérée par le header
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 📊 Statistiques
        const statsResponse = await fetch("http://localhost:8080/api/stats");
        const statsData = await statsResponse.json();
        setMetrics(statsData);

        // 📚 Nouveaux livres
        const nouveauxResponse = await fetch("http://localhost:8080/api/livres/nouveaux");
        const nouveauxData = await nouveauxResponse.json();
        setLatestBooks(nouveauxData);

        // 🔥 Livres populaires
        const populairesResponse = await fetch("http://localhost:8080/api/livres/populaires");
        const populairesData = await populairesResponse.json();
        setMostBorrowed(populairesData);

        // 🧑‍🏫 Auteurs en vedette
        const auteursResponse = await fetch("http://localhost:8080/api/auteurs/vedette");
        const auteursData = await auteursResponse.json();
        setFeaturedAuthors(auteursData);

        // 💬 Avis récents
        const avisResponse = await fetch("http://localhost:8080/api/avis");
        const avisData = await avisResponse.json();
        setRecentReviews(avisData);

        // 📂 Genres
        const genresResponse = await fetch("http://localhost:8080/api/genres");
        const genresData = await genresResponse.json();
        setCategories(genresData);

      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        // Données de secours en cas d'erreur
        setMetrics({ livres: 12500, auteurs: 850, lecteurs: 3200 });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-300">Chargement de la bibliothèque...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">

      {/* Hero Section - Accueil */}
      <section id="accueil" className="relative flex flex-col items-center justify-center text-center px-6 py-32 text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/biblio.jpg"
            alt="Bibliothèque"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-blue-900/60"></div>
        </div>

        <div className="relative z-10 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Bienvenue dans votre bibliothèque numérique
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Découvrez, réservez et empruntez des livres physiques en toute simplicité
          </p>

          <div className="flex w-full max-w-2xl bg-white/20 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden mx-auto border border-white/30">
            <input
              type="text"
              placeholder="Rechercher un livre, un auteur, un genre..."
              className="flex-1 px-4 py-3 outline-none text-white bg-transparent placeholder-white/70 text-base"
            />
            <button className="bg-amber-500 text-slate-900 px-6 py-3 hover:bg-amber-400 transition-colors flex items-center justify-center font-semibold text-sm">
              <Search size={18} className="mr-2"/>
              Rechercher
            </button>
          </div>

          {/* Stats dynamiques */}
          <div className="grid grid-cols-3 gap-4 mt-10 max-w-2xl mx-auto">
            <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
              <BookText className="w-6 h-6 mx-auto mb-2 text-amber-300" />
              <div className="text-xl font-bold text-white">{metrics.livres.toLocaleString()}+</div>
              <div className="text-xs opacity-80 text-amber-100">Livres</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
              <Users className="w-6 h-6 mx-auto mb-2 text-amber-300" />
              <div className="text-xl font-bold text-white">{metrics.auteurs.toLocaleString()}+</div>
              <div className="text-xs opacity-80 text-amber-100">Auteurs</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
              <UserCheck className="w-6 h-6 mx-auto mb-2 text-amber-300" />
              <div className="text-xl font-bold text-white">{metrics.lecteurs.toLocaleString()}+</div>
              <div className="text-xs opacity-80 text-amber-100">Lecteurs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Horaires d'ouverture */}
      <section className="px-4 py-16 bg-white dark:bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="relative inline-block mb-6">
              <div className="absolute -inset-3 bg-amber-100 dark:bg-amber-900/20 rounded-full blur-2xl"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-600 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="text-white" size={24} />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-900 dark:text-blue-100">
              Quand nous rencontrer
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Notre espace vous attend selon un rythme pensé pour votre confort
            </p>
          </div>

          <div className="relative mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-3">
              {horairesOuverture.map((horaire, index) => {
                const isToday = horaire.jour === new Date().toLocaleDateString('fr-FR', { weekday: 'long' });
                const isClosed = horaire.jour === "Dimanche";
                const isWeekend = horaire.jour === "Samedi" || horaire.jour === "Dimanche";

                return (
                  <div key={index} className="relative group">
                    <div className={`p-4 rounded-xl text-center transition-all duration-300 hover:scale-105 ${
                      isToday
                        ? 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 border-2 border-amber-200 dark:border-amber-600 shadow-lg'
                        : isClosed
                        ? 'bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600'
                        : isWeekend
                        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                    }`}>
                      <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                        isToday
                          ? 'text-amber-700 dark:text-amber-300'
                          : isClosed
                          ? 'text-slate-500 dark:text-slate-400'
                          : 'text-blue-600 dark:text-blue-400'
                      }`}>
                        {horaire.jour.slice(0, 3)}
                      </div>

                      <div className={`text-lg font-black mb-1 ${
                        isToday
                          ? 'text-amber-800 dark:text-amber-200'
                          : isClosed
                          ? 'text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-white'
                      }`}>
                        {horaire.heures.split(' - ')[0]}
                      </div>

                      <div className="text-slate-400 dark:text-slate-500 text-sm mb-1">-</div>

                      <div className={`text-lg font-black ${
                        isToday
                          ? 'text-amber-800 dark:text-amber-200'
                          : isClosed
                          ? 'text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-white'
                      }`}>
                        {horaire.heures.split(' - ')[1]}
                      </div>

                      {isToday && (
                        <div className="mt-2 inline-block bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Aujourd'hui
                        </div>
                      )}

                      {isClosed && (
                        <div className="mt-2 inline-block bg-slate-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Fermé
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
              <div className="text-3xl mb-3">🚀</div>
              <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Accès Fluide</h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Réservation instantanée depuis notre plateforme digitale
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
              <div className="text-3xl mb-3">🎯</div>
              <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Service Sur Mesure</h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Conseils personnalisés et recherche assistée
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
              <div className="text-3xl mb-3">💫</div>
              <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Espace Inspirant</h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Environnement conçu pour la concentration
              </p>
            </div>
          </div>

          <div className="text-center mt-10 p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="text-2xl mb-3">🌙</div>
            <p className="text-slate-700 dark:text-slate-300 italic max-w-2xl mx-auto">
              "Même lorsque nos portes sont closes, notre catalogue numérique reste accessible."
            </p>
            <div className="mt-3 text-blue-600 dark:text-blue-400 font-semibold text-sm">
              — L'équipe de la bibliothèque
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="px-4 py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-900 dark:text-blue-100">
              Comment ça marche ?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Un processus simple pour accéder à nos ressources
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Search size={36} />, title: "Recherchez", desc: "Parcourez notre catalogue complet en ligne" },
              { icon: <Bell size={36} />, title: "Réservez", desc: "Faites votre demande d'emprunt en quelques clics" },
              { icon: <MapPin size={36} />, title: "Récupérez", desc: "Venez chercher votre livre à la bibliothèque" }
            ].map((feature, i) => (
              <div key={i} className="text-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700">
                <div className="text-blue-600 dark:text-blue-400 mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-blue-900 dark:text-blue-100">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nouveautés */}
      <section id="nouveautes" className="px-4 py-16 bg-white dark:bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-900 dark:text-blue-100">
              Dernières acquisitions
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Découvrez nos livres les plus récents
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestBooks.length > 0 ? (
              latestBooks.map((book) => (
                <div key={book.id} className="group bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 dark:border-slate-700">
                  <div className="h-40 bg-gradient-to-br from-blue-50 to-amber-50 dark:from-blue-900/30 dark:to-amber-900/30 rounded-t-xl flex items-center justify-center relative">
                    {book.cover ? (
                      <Image
                        src={book.cover}
                        alt={book.titre}
                        width={80}
                        height={120}
                        className="object-cover rounded"
                      />
                    ) : (
                      <BookOpen className="text-blue-600 dark:text-blue-400" size={40} />
                    )}
                    {!book.disponible && (
                      <div className="absolute top-3 right-3 bg-amber-500 text-slate-900 px-2 py-1 rounded-full text-xs font-semibold">
                        Emprunté
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {book.titre}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-2 text-sm">{book.auteurNom}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 px-2 py-1 rounded-full">
                        {new Date(book.datePublication).getFullYear()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        book.disponible ?
                        'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' :
                        'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        {book.disponible ? 'Disponible' : 'Indisponible'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center py-8">
                <BookOpen className="mx-auto h-10 w-10 text-slate-400" />
                <p className="mt-3 text-slate-500 dark:text-slate-400">Aucun nouveau livre disponible</p>
              </div>
            )}
          </div>

          <div className="text-center mt-8">
            <Link href="/books" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold inline-flex items-center text-sm">
              Voir tous les livres
              <svg className="ml-2 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Livres populaires */}
      <section id="populaires" className="px-4 py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-900 dark:text-blue-100">
              Livres les plus populaires
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Les ouvrages les plus appréciés par notre communauté
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mostBorrowed.length > 0 ? (
              mostBorrowed.map((book) => (
                <div key={book.id} className="bg-white dark:bg-slate-800 rounded-xl p-4 flex gap-4 hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700">
                  <div className="flex-shrink-0 w-20 h-28 bg-gradient-to-br from-amber-50 to-blue-50 dark:from-amber-900/30 dark:to-blue-900/30 rounded-lg flex items-center justify-center overflow-hidden">
                    {book.cover ? (
                      <Image
                        src={book.cover}
                        alt={book.titre}
                        width={60}
                        height={90}
                        className="object-cover rounded"
                      />
                    ) : (
                      <BookOpen className="text-amber-600 dark:text-amber-400" size={24} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1 text-blue-900 dark:text-blue-100">{book.titre}</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-2 text-sm">{book.auteurNom}</p>
                    <div className="text-amber-600 dark:text-amber-400 font-semibold mb-2 text-sm">
                      {new Date(book.datePublication).getFullYear()}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      book.disponible ?
                      'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' :
                      'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300'
                    }`}>
                      {book.disponible ? 'Disponible' : 'Emprunté'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <BookOpen className="mx-auto h-10 w-10 text-slate-400" />
                <p className="mt-3 text-slate-500 dark:text-slate-400">Aucun livre populaire à afficher</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Auteurs en vedette */}
      <section id="auteurs" className="px-4 py-16 bg-white dark:bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-900 dark:text-blue-100">
              Auteurs en vedette
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Découvrez les talents qui font notre richesse littéraire
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredAuthors.length > 0 ? (
              featuredAuthors.map((author) => (
                <div key={author.id} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 text-center hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-600">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-amber-500 mb-4 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {author.nomComplet.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-blue-900 dark:text-blue-100">{author.nomComplet}</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-3 text-sm">
                    {author.specialty || "Auteur renommé"}
                  </p>
                  <div className="text-blue-600 dark:text-blue-400 font-semibold">
                    {author.booksCount || 0} œuvres
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <Users className="mx-auto h-10 w-10 text-slate-400" />
                <p className="mt-3 text-slate-500 dark:text-slate-400">Aucun auteur en vedette à afficher</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Avis des lecteurs */}
      <section id="avis" className="px-4 py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-900 dark:text-blue-100">
              Témoignages de nos lecteurs
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Ce que notre communauté pense de l'expérience bibliothèque
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentReviews.length > 0 ? (
              recentReviews.map((avis, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700 relative">
                  <Quote className="text-blue-600 dark:text-blue-400 mb-4 opacity-50" size={24}/>
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        size={16}
                        className={j < avis.note ? "text-amber-500 fill-current" : "text-slate-300"}
                      />
                    ))}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed text-sm">
                    "{avis.commentaire}"
                  </p>
                  <div className="font-semibold text-blue-900 dark:text-blue-100 text-right text-sm">
                    — {avis.utilisateurNom}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 text-right mt-1">
                    sur "{avis.livreTitre}"
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <Quote className="mx-auto h-10 w-10 text-slate-400" />
                <p className="mt-3 text-slate-500 dark:text-slate-400">Aucun avis à afficher pour le moment</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 py-16 bg-gradient-to-r from-blue-600 to-amber-500 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à commencer votre voyage littéraire ?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Rejoignez notre communauté de lecteurs passionnés
          </p>
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <Link href="/signup">
              <button className="bg-white text-slate-900 px-6 py-3 rounded-lg hover:bg-slate-100 transition-all duration-300 font-semibold text-base shadow-lg hover:shadow-xl">
                Créer un compte gratuit
              </button>
            </Link>
            <Link href="/books">
              <button className="border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-slate-900 transition-all duration-300 font-bold text-base shadow-lg hover:shadow-xl">
                Explorer le catalogue
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}