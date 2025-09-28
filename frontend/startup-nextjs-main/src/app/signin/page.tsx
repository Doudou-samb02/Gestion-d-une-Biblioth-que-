"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, BookOpen, CheckCircle, AlertTriangle } from "lucide-react";
import { useAuth } from "../../app/context/AuthContext";

export default function SigninForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const message = searchParams.get('message');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (!email.includes('@')) {
      setError("Veuillez entrer une adresse email valide");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error(data.message || "Email ou mot de passe incorrect");
        } else if (res.status === 403) {
          throw new Error("Compte désactivé ou non autorisé");
        } else {
          throw new Error(data.message || "Erreur lors de la connexion");
        }
      }

      // Vérifier que le token est bien retourné
      if (!data.token) {
        throw new Error("Token d'authentification manquant dans la réponse");
      }

      console.log("Connexion réussie, token reçu:", data.token);
      console.log("Données utilisateur:", data.user);

      // Stocker le token et les infos utilisateur dans le contexte
      if (data.user) {
        login(data.token, data.user);

        // Vérifier les livres à retourner après la connexion réussie
        await checkPendingReturns(data.token, data.user.role);
      } else {
        throw new Error("Informations utilisateur manquantes");
      }

    } catch (err: any) {
      setError(err.message || "Erreur réseau ou serveur");
      console.error("Erreur de connexion:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour vérifier les livres à retourner
  const checkPendingReturns = async (token: string, userRole: string) => {
    try {
      // Récupérer tous les emprunts de l'utilisateur avec le token
      const res = await fetch("http://localhost:8080/api/emprunts/mes-emprunts", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const emprunts = await res.json();

        // Filtrer côté client les emprunts en retard ou proches de la date de retour
        const empruntsFiltres = filtrerEmpruntsAlerte(emprunts);

        if (empruntsFiltres.enRetard.length > 0 || empruntsFiltres.procheRetour.length > 0) {
          showReturnAlert(empruntsFiltres, userRole);
        } else {
          redirectUser(userRole);
        }
      } else {
        console.warn("Impossible de récupérer les emprunts, redirection normale");
        redirectUser(userRole);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification des emprunts:", error);
      redirectUser(userRole);
    }
  };

  // Fonction de filtrage côté client
  const filtrerEmpruntsAlerte = (emprunts: any[]) => {
    if (!emprunts || !Array.isArray(emprunts)) {
      return { enRetard: [], procheRetour: [] };
    }

    const aujourdhui = new Date();

    const empruntsEnRetard = emprunts.filter(emprunt => {
      if (!emprunt.dateRetour || emprunt.statut !== 'VALIDÉ') return false;

      try {
        const dateRetour = new Date(emprunt.dateRetour);
        return dateRetour < aujourdhui;
      } catch (error) {
        console.error("Erreur de parsing de date:", error);
        return false;
      }
    });

    const empruntsProcheRetour = emprunts.filter(emprunt => {
      if (!emprunt.dateRetour || emprunt.statut !== 'VALIDÉ') return false;

      try {
        const dateRetour = new Date(emprunt.dateRetour);
        const differenceJours = Math.ceil((dateRetour.getTime() - aujourdhui.getTime()) / (1000 * 3600 * 24));

        return differenceJours <= 2 && differenceJours >= 0; // Dans les 2 prochains jours
      } catch (error) {
        console.error("Erreur de parsing de date:", error);
        return false;
      }
    });

    return {
      enRetard: empruntsEnRetard,
      procheRetour: empruntsProcheRetour
    };
  };

  // Fonction pour afficher l'alerte
  const showReturnAlert = (empruntsFiltres: any, userRole: string) => {
    const { enRetard, procheRetour } = empruntsFiltres;

    let message = "";

    if (enRetard.length > 0) {
      message += `⚠️ RETARD DE RETOUR\n\n`;
      message += `Vous avez ${enRetard.length} livre(s) en retard :\n`;
      enRetard.forEach((emprunt: any, index: number) => {
        try {
          const joursRetard = Math.ceil((new Date().getTime() - new Date(emprunt.dateRetour).getTime()) / (1000 * 3600 * 24));
          const titreLivre = emprunt.livre?.titre || emprunt.titreLivre || 'Livre inconnu';
          message += `• ${titreLivre} (${joursRetard} jour(s) de retard)\n`;
        } catch (error) {
          console.error("Erreur de calcul du retard:", error);
        }
      });
      message += `\n`;
    }

    if (procheRetour.length > 0) {
      message += `📚 RAPPEL DE RETOUR\n\n`;
      message += `Vous avez ${procheRetour.length} livre(s) à retourner bientôt :\n`;
      procheRetour.forEach((emprunt: any, index: number) => {
        try {
          const joursRestants = Math.ceil((new Date(emprunt.dateRetour).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
          const titreLivre = emprunt.livre?.titre || emprunt.titreLivre || 'Livre inconnu';
          message += `• ${titreLivre} (dans ${joursRestants} jour(s))\n`;
        } catch (error) {
          console.error("Erreur de calcul des jours restants:", error);
        }
      });
    }

    if (message && window.confirm(`${message}\n\nSouhaitez-vous voir la liste de vos emprunts ?`)) {
      router.push(userRole === "ADMIN" ? "/admin/emprunts" : "/mes-emprunts");
    } else {
      redirectUser(userRole);
    }
  };

  // Fonction de redirection
  const redirectUser = (userRole: string) => {
    const redirectPath = userRole === "ADMIN" ? "/admin" : "/books";
    console.log("Redirection vers:", redirectPath);
    router.push(redirectPath);
  };

  return (
    <div className="min-h-screen flex">
      {/* Section Image avec fond bleu/ambre */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center bg-no-repeat"
           style={{
             backgroundImage: "url('/images/library-signup-bg.jpg')",
             backgroundSize: "cover",
             backgroundPosition: "center center"
           }}>
        <div className="absolute inset-0 bg-blue-900/70 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-amber-500/10"></div>

        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 w-full">
          <div className="text-center max-w-md">
            <div className="flex justify-center mb-6">
            </div>

            <h1 className="text-4xl font-bold mb-4 text-amber-100">Bienvenue</h1>
            <p className="text-lg text-blue-100 leading-relaxed">
              Connectez-vous pour retrouver vos livres favoris,
              suivre vos emprunts en cours et découvrir de nouvelles lectures.
            </p>

            {/* Avantages */}
            <div className="mt-8 space-y-3 text-left">
              <div className="flex items-center space-x-3 text-blue-200">
                <CheckCircle size={16} className="text-amber-300 flex-shrink-0" />
                <span className="text-sm">Reprenez votre lecture là où vous l'avez laissée</span>
              </div>
              <div className="flex items-center space-x-3 text-blue-200">
                <CheckCircle size={16} className="text-amber-300 flex-shrink-0" />
                <span className="text-sm">Gérez vos emprunts en cours</span>
              </div>
              <div className="flex items-center space-x-3 text-blue-200">
                <CheckCircle size={16} className="text-amber-300 flex-shrink-0" />
                <span className="text-sm">Recevez des rappels de retour</span>
              </div>
            </div>
          </div>
        </div>

        {/* Éléments décoratifs */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-amber-400/20 rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full translate-x-32 translate-y-32"></div>
      </div>

      {/* Section Formulaire */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-amber-50 dark:from-blue-900 dark:to-amber-900">
        <div className="w-full max-w-md">
          {/* Bouton retour */}
          <button
            onClick={() => router.push("/")}
            className="flex items-center space-x-2 text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Retour à l'accueil</span>
          </button>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
            {/* En-tête */}
            <div className="text-center mb-8">
              <div className="lg:hidden flex justify-center mb-4">
                <div className="bg-gradient-to-br from-blue-600 to-amber-600 p-3 rounded-xl">
                  <BookOpen size={32} className="text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                Connexion
              </h2>
              <p className="text-blue-600 dark:text-blue-300 mt-2">
                Accédez à votre compte
              </p>
            </div>

            {/* Message informatif */}
            {message && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 p-4 rounded-lg text-sm mb-6 flex items-center">
                <Lock size={16} className="mr-2 flex-shrink-0" />
                {decodeURIComponent(message)}
              </div>
            )}

            {/* Rappel des retours (info générale) */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 p-3 rounded-lg text-xs mb-6 flex items-start space-x-2">
              <AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <span>Pensez à vérifier vos dates de retour après connexion</span>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-lg text-sm flex items-center">
                  <Lock size={16} className="mr-2 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Champ Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-blue-500" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-blue-200 dark:border-blue-600 rounded-lg bg-white/50 dark:bg-gray-700/50 text-blue-900 dark:text-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Champ Mot de passe */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-blue-500" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 border border-blue-200 dark:border-blue-600 rounded-lg bg-white/50 dark:bg-gray-700/50 text-blue-900 dark:text-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-500 hover:text-amber-600 dark:hover:text-amber-400 transition"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Lien mot de passe oublié */}
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-medium transition"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              {/* Bouton de connexion */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-amber-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Connexion...
                  </div>
                ) : (
                  "Se connecter"
                )}
              </button>
            </form>

            {/* Lien vers l'inscription */}
            <div className="mt-6 pt-6 border-t border-blue-200 dark:border-blue-700">
              <div className="text-center">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Pas encore de compte ?{" "}
                  <Link
                    href="/signup"
                    className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-medium transition"
                  >
                    Créer un compte
                  </Link>
                </p>
              </div>
            </div>

            {/* Indicateur de sécurité */}
            <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-blue-600 dark:text-blue-300">
              <Lock size={12} />
              <span>Connexion sécurisée</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}