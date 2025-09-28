"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, User, Mail, Lock, ArrowLeft, BookOpen, CheckCircle, Calendar } from "lucide-react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    nomComplet: "",
    email: "",
    password: "",
    dateNaissance: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.nomComplet || !formData.email || !formData.password || !formData.dateNaissance) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Validation de la date de naissance
    const today = new Date();
    const birthDate = new Date(formData.dateNaissance);
    const age = today.getFullYear() - birthDate.getFullYear();

    if (age < 13) {
      setError("Vous devez avoir au moins 13 ans pour vous inscrire");
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nomComplet: formData.nomComplet,
          email: formData.email,
          password: formData.password,
          dateNaissance: formData.dateNaissance,
          // Le rôle sera automatiquement défini sur LECTEUR par le backend
        }),
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(errorData || `Erreur ${res.status} lors de l'inscription`);
      }

      const data = await res.json();

      setSuccess("Inscription réussie ! Redirection vers la connexion...");

      // Redirection après 2 secondes
      setTimeout(() => {
        router.push("/signin");
      }, 2000);

    } catch (err: any) {
      // Gestion spécifique de l'erreur "Email déjà utilisé"
      if (err.message.includes("Email déjà utilisé")) {
        setError("Un compte avec cet email existe déjà");
      } else {
        setError(err.message || "Erreur réseau ou serveur");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Section Image avec fond bleu/ambre */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center" style={{backgroundImage: "url('/images/library-signup-bg.jpg')"}}>
        <div className="absolute inset-0 bg-blue-900/80 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-amber-500/20"></div>

        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 w-full">
          <div className="text-center max-w-md">

            <h1 className="text-4xl font-bold mb-4 text-amber-100">Rejoignez notre bibliothèque</h1>
            <p className="text-lg text-blue-100 leading-relaxed">
              Créez votre compte pour découvrir un monde de connaissances,
              emprunter vos livres préférés et suivre votre parcours de lecture.
            </p>

            {/* Avantages */}
            <div className="mt-8 space-y-3 text-left">
              <div className="flex items-center space-x-3 text-blue-200">
                <CheckCircle size={16} className="text-amber-300 flex-shrink-0" />
                <span className="text-sm">Accès à des milliers de livres</span>
              </div>
              <div className="flex items-center space-x-3 text-blue-200">
                <CheckCircle size={16} className="text-amber-300 flex-shrink-0" />
                <span className="text-sm">Emprunts simplifiés</span>
              </div>
              <div className="flex items-center space-x-3 text-blue-200">
                <CheckCircle size={16} className="text-amber-300 flex-shrink-0" />
                <span className="text-sm">Historique de lecture personnel</span>
              </div>
              <div className="flex items-center space-x-3 text-blue-200">
                <CheckCircle size={16} className="text-amber-300 flex-shrink-0" />
                <span className="text-sm">Recommandations intelligentes</span>
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
                  <User size={32} className="text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                Créer un compte
              </h2>
              <p className="text-blue-600 dark:text-blue-300 mt-2">
                Commencez votre aventure littéraire
              </p>
            </div>

            {/* Messages */}
            {error && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-lg text-sm flex items-center">
                <Lock size={16} className="mr-2 flex-shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 p-4 rounded-lg text-sm flex items-center">
                <CheckCircle size={16} className="mr-2 flex-shrink-0" />
                {success}
              </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Champ Nom complet */}
              <div>
                <label htmlFor="nomComplet" className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Nom complet *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-blue-500" />
                  </div>
                  <input
                    id="nomComplet"
                    type="text"
                    placeholder="Votre nom complet"
                    value={formData.nomComplet}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-blue-200 dark:border-blue-600 rounded-lg bg-white/50 dark:bg-gray-700/50 text-blue-900 dark:text-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              {/* Champ Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Adresse email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-blue-500" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-blue-200 dark:border-blue-600 rounded-lg bg-white/50 dark:bg-gray-700/50 text-blue-900 dark:text-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              {/* Champ Date de naissance */}
              <div>
                <label htmlFor="dateNaissance" className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Date de naissance *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={18} className="text-blue-500" />
                  </div>
                  <input
                    id="dateNaissance"
                    type="date"
                    value={formData.dateNaissance}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-blue-200 dark:border-blue-600 rounded-lg bg-white/50 dark:bg-gray-700/50 text-blue-900 dark:text-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                    required
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                  Vous devez avoir au moins 13 ans
                </p>
              </div>

              {/* Champ Mot de passe */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Mot de passe *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-blue-500" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Créez un mot de passe sécurisé (6 caractères minimum)"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-12 py-3 border border-blue-200 dark:border-blue-600 rounded-lg bg-white/50 dark:bg-gray-700/50 text-blue-900 dark:text-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-500 hover:text-amber-600 dark:hover:text-amber-400 transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                  6 caractères minimum
                </p>
              </div>

              {/* Bouton d'inscription */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-amber-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Inscription...
                  </div>
                ) : (
                  "Créer mon compte"
                )}
              </button>
            </form>

            {/* Lien vers connexion */}
            <div className="mt-6 pt-6 border-t border-blue-200 dark:border-blue-700">
              <div className="text-center">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Déjà un compte ?{" "}
                  <Link
                    href="/signin"
                    className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-medium transition"
                  >
                    Connectez-vous
                  </Link>
                </p>
              </div>
            </div>

            {/* Conditions */}
            <div className="mt-4 text-center">
              <p className="text-xs text-blue-600 dark:text-blue-300">
                En créant un compte, vous acceptez nos{" "}
                <a href="#" className="hover:text-amber-600 dark:hover:text-amber-400 underline">conditions d'utilisation</a>
              </p>
            </div>

            {/* Indicateur de sécurité */}
            <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-blue-600 dark:text-blue-300">
              <Lock size={12} />
              <span>Vos données sont sécurisées</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}