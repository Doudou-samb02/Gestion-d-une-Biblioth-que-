"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, BookOpen, Lock, Mail, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Identifiants invalides");
      }

      const data = await res.json();

      // Vérifie le rôle ADMIN
      if (data.user.role !== "ADMIN") {
        throw new Error("Accès réservé aux administrateurs");
      }

      // Stockage des données d'authentification
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirection vers le dashboard admin
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Erreur lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Section Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 w-full">
          <div className="text-center max-w-md">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                <BookOpen size={48} className="text-white" />
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-4">Bibliothèque Admin</h1>
            <p className="text-lg text-blue-100 leading-relaxed">
              Accédez au panneau d'administration pour gérer votre collection de livres,
              suivre les emprunts et analyser les statistiques de votre bibliothèque.
            </p>

            <div className="mt-8 flex items-center justify-center space-x-4 text-sm text-blue-200">
              <div className="flex items-center space-x-1">
                <Lock size={14} />
                <span>Connexion sécurisée</span>
              </div>
              <div className="w-px h-4 bg-blue-400"></div>
              <div className="flex items-center space-x-1">
                <BookOpen size={14} />
                <span>Gestion simplifiée</span>
              </div>
            </div>
          </div>
        </div>

        {/* Éléments décoratifs */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-32 translate-y-32"></div>
      </div>

      {/* Section Formulaire */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md">
          {/* Bouton retour */}
          <button
            onClick={() => router.push("/")}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Retour au site</span>
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            {/* En-tête */}
            <div className="text-center mb-8">
              <div className="lg:hidden flex justify-center mb-4">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl">
                  <BookOpen size={32} className="text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Connexion Admin
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Accédez à votre espace administrateur
              </p>
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="admin@bibliotheque.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Champ Mot de passe */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Bouton de connexion */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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

            {/* Pied de page */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Problème de connexion ?{" "}
                  <a
                    href="/admin/forgot-password"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition"
                  >
                    Réinitialiser le mot de passe
                  </a>
                </p>
              </div>

              {/* Indicateur de sécurité */}
              <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <Lock size={12} />
                <span>Connexion sécurisée</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}