"use client";

import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {
  User,
  FileText,
  Calendar,
  Plus,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Award,
  BookOpen,
  MapPin
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface AuthorFormData {
  nomComplet: string;
  biographie: string;
  dateNaissance: string;
  dateDeces?: string;
  nationalite: string;
}

export default function CreateAuthor() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const [author, setAuthor] = useState<AuthorFormData>({
    nomComplet: "",
    biographie: "",
    dateNaissance: "",
    dateDeces: "",
    nationalite: "Française"
  });

  const nationalities = [
    "Française", "Américaine", "Britannique", "Canadienne", "Allemande",
    "Espagnole", "Italienne", "Portugaise", "Russe", "Japonaise",
    "Chinoise", "Coréenne", "Indienne", "Brésilienne", "Mexicaine",
    "Australienne", "Autre"
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!author.nomComplet.trim()) {
      newErrors.nomComplet = "Le nom de l'auteur est obligatoire";
    } else if (author.nomComplet.length < 2) {
      newErrors.nomComplet = "Le nom doit contenir au moins 2 caractères";
    }

    if (author.biographie && author.biographie.length > 2000) {
      newErrors.biographie = "La biographie ne doit pas dépasser 2000 caractères";
    }

    if (!author.dateNaissance) {
      newErrors.dateNaissance = "La date de naissance est obligatoire";
    } else {
      const birthDate = new Date(author.dateNaissance);
      const today = new Date();
      if (birthDate > today) {
        newErrors.dateNaissance = "La date de naissance ne peut pas être dans le futur";
      }
    }

    if (author.dateDeces) {
      const birthDate = new Date(author.dateNaissance);
      const deathDate = new Date(author.dateDeces);
      if (deathDate <= birthDate) {
        newErrors.dateDeces = "La date de décès doit être après la date de naissance";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAuthor(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      // Préparer les données pour le backend
      const requestData = {
        nomComplet: author.nomComplet,
        nationalite: author.nationalite,
        biographie: author.biographie,
        dateNaissance: author.dateNaissance,
        dateDeces: author.dateDeces || null // Envoyer null si vide
      };

      const res = await fetch("http://localhost:8080/api/auteurs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!res.ok) {
        // Si le backend retourne une erreur structurée
        if (res.headers.get("content-type")?.includes("application/json")) {
          const errorData = await res.json();
          throw new Error(errorData.message || `Erreur ${res.status}: ${res.statusText}`);
        } else {
          throw new Error(`Erreur ${res.status}: ${res.statusText}`);
        }
      }

      const createdAuthor = await res.json();

      toast.success("Auteur créé avec succès !");
      setShowSuccess(true);

      // Redirection après 2 secondes
      setTimeout(() => {
        router.push("/authors");
      }, 2000);

    } catch (err: any) {
      console.error("Erreur détaillée:", err);
      toast.error(err.message || "Impossible de créer l'auteur. Vérifiez votre connexion.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setAuthor({
      nomComplet: "",
      biographie: "",
      dateNaissance: "",
      dateDeces: "",
      nationalite: "Française"
    });
    setErrors({});
  };

  const calculateAge = (birthDate: string, deathDate?: string) => {
    if (!birthDate) return null;

    const birth = new Date(birthDate);
    const end = deathDate ? new Date(deathDate) : new Date();
    let age = end.getFullYear() - birth.getFullYear();
    const monthDiff = end.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-lg">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Auteur créé avec succès !
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {author.nomComplet} a été ajouté à votre base de données.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/authors/create")}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Ajouter un autre
              </button>
              <button
                onClick={() => router.push("/authors")}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Voir la liste
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>

          <PageBreadcrumb
            pageTitle="Ajouter un Nouvel Auteur"
            links={[
              { label: "Dashboard", href: "/admin" },
              { label: "Auteurs", href: "/authors" },
              { label: "Nouvel Auteur", href: "/authors/create" }
            ]}
          />
        </div>

        <ComponentCard
          title={
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Nouvel Auteur
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Remplissez les informations de l'auteur
                </p>
              </div>
            </div>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Nom */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom complet *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    name="nomComplet"
                    value={author.nomComplet}
                    onChange={handleChange}
                    className={`pl-10 w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.nomComplet ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="Ex: Victor Hugo"
                    required
                  />
                </div>
                {errors.nomComplet && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.nomComplet}
                  </p>
                )}
              </div>

              {/* Nationalité */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nationalité
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    name="nationalite"
                    value={author.nationalite}
                    onChange={handleChange}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {nationalities.map(nat => (
                      <option key={nat} value={nat}>{nat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Champ vide pour l'alignement */}
              <div></div>

              {/* Date de naissance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date de naissance *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    name="dateNaissance"
                    value={author.dateNaissance}
                    onChange={handleChange}
                    className={`pl-10 w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.dateNaissance ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    }`}
                    required
                  />
                </div>
                {errors.dateNaissance && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.dateNaissance}
                  </p>
                )}
                {author.dateNaissance && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Âge: {calculateAge(author.dateNaissance, author.dateDeces) || "Calcul..."} ans
                    {author.dateDeces && " (décédé)"}
                  </p>
                )}
              </div>

              {/* Date de décès */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date de décès (optionnel)
                </label>
                <input
                  type="date"
                  name="dateDeces"
                  value={author.dateDeces}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.dateDeces ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  }`}
                  min={author.dateNaissance}
                />
                {errors.dateDeces && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.dateDeces}
                  </p>
                )}
              </div>

              {/* Biographie */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Biographie
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                  <textarea
                    name="biographie"
                    value={author.biographie}
                    onChange={handleChange}
                    rows={6}
                    className={`pl-10 w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.biographie ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="Décrivez la vie et l'œuvre de l'auteur..."
                  />
                </div>
                {errors.biographie && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.biographie}
                  </p>
                )}
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <span>{author.biographie.length}/2000 caractères</span>
                  <span>Recommandé: 200-500 caractères</span>
                </div>
              </div>
            </div>

            {/* Aperçu rapide */}
            {(author.nomComplet || author.biographie) && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Aperçu de la fiche auteur
                </h3>
                <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  {author.nomComplet && <p><strong>Nom:</strong> {author.nomComplet}</p>}
                  {author.nationalite && <p><strong>Nationalité:</strong> {author.nationalite}</p>}
                  {author.dateNaissance && (
                    <p>
                      <strong>Naissance:</strong> {new Date(author.dateNaissance).toLocaleDateString('fr-FR')}
                      {author.dateDeces && ` - Décès: ${new Date(author.dateDeces).toLocaleDateString('fr-FR')}`}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={isSubmitting}
              >
                Réinitialiser
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Création...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Créer l'auteur
                  </>
                )}
              </button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </div>
  );
}