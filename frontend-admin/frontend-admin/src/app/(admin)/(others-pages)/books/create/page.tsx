"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Upload,
  User,
  Tag,
  Calendar,
  FileText,
  Plus,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  X,
  Save,
  Link
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Auteur {
  id: number;
  nomComplet: string;
  nom?: string;
}

interface Categorie {
  id: number;
  nom: string;
}

interface BookFormData {
  titre: string;
  isbn: string;
  auteurId: string;
  categorieId: string;
  datePublication: string;
  cover: string;
  description: string;
  langue: string;
  nbPages: string;
  nbExemplaires: string;
}

export default function CreateBook() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const [book, setBook] = useState<BookFormData>({
    titre: "",
    isbn: "",
    auteurId: "",
    categorieId: "",
    datePublication: "",
    cover: "",
    description: "",
    langue: "Français",
    nbPages: "",
    nbExemplaires: "1",
  });

  const [auteurs, setAuteurs] = useState<Auteur[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // États pour l'ajout de nouvelle catégorie
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Charger auteurs et catégories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        const [auteursRes, categoriesRes] = await Promise.all([
          fetch("http://localhost:8080/api/auteurs", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
          }),
          fetch("http://localhost:8080/api/categories", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
          })
        ]);

        if (!auteursRes.ok) {
          throw new Error(`Erreur auteurs: ${auteursRes.status}`);
        }
        if (!categoriesRes.ok) {
          throw new Error(`Erreur catégories: ${categoriesRes.status}`);
        }

        const [auteursData, categoriesData] = await Promise.all([
          auteursRes.json(),
          categoriesRes.json()
        ]);

        console.log("Auteurs chargés:", auteursData);
        console.log("Catégories chargées:", categoriesData);

        setAuteurs(auteursData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erreur:", error);
        toast.error("Impossible de charger les données");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!book.titre.trim()) {
      newErrors.titre = "Le titre est obligatoire";
    } else if (book.titre.length < 2) {
      newErrors.titre = "Le titre doit contenir au moins 2 caractères";
    }

    if (!book.isbn.trim()) {
      newErrors.isbn = "L'ISBN est obligatoire";
    } else if (!/^(?:\d{10}|\d{13})$/.test(book.isbn.replace(/[- ]/g, ''))) {
      newErrors.isbn = "ISBN doit être 10 ou 13 chiffres";
    }

    if (!book.auteurId) {
      newErrors.auteurId = "Veuillez sélectionner un auteur";
    }

    if (!book.categorieId) {
      newErrors.categorieId = "Veuillez sélectionner une catégorie";
    }

    if (!book.datePublication) {
      newErrors.datePublication = "La date de publication est obligatoire";
    }

    if (book.nbPages && (parseInt(book.nbPages) <= 0 || parseInt(book.nbPages) > 10000)) {
      newErrors.nbPages = "Le nombre de pages doit être entre 1 et 10000";
    }

    if (!book.nbExemplaires || parseInt(book.nbExemplaires) <= 0) {
      newErrors.nbExemplaires = "Le nombre d'exemplaires doit être au moins 1";
    } else if (parseInt(book.nbExemplaires) > 1000) {
      newErrors.nbExemplaires = "Le nombre d'exemplaires ne peut pas dépasser 1000";
    }

    // Validation optionnelle pour l'URL de l'image
    if (book.cover && !isValidUrl(book.cover)) {
      newErrors.cover = "Veuillez entrer une URL valide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fonction pour valider les URLs
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBook(prev => ({
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

  // Fonction pour obtenir le nom d'affichage d'un auteur
  const getAuteurDisplayName = (auteur: Auteur): string => {
    return auteur.nomComplet || auteur.nom || `Auteur ${auteur.id}`;
  };

  // Fonction pour ajouter une nouvelle catégorie
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Veuillez entrer un nom de catégorie");
      return;
    }

    setIsAddingCategory(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nom: newCategoryName.trim()
        }),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la création de la catégorie");
      }

      const newCategory = await res.json();

      // Ajouter la nouvelle catégorie à la liste
      setCategories(prev => [...prev, newCategory]);

      // Sélectionner automatiquement la nouvelle catégorie
      setBook(prev => ({ ...prev, categorieId: newCategory.id.toString() }));

      // Fermer le modal et réinitialiser
      setShowAddCategory(false);
      setNewCategoryName("");

      toast.success("Catégorie ajoutée avec succès !");
    } catch (error) {
      console.error(error);
      toast.error("Impossible d'ajouter la catégorie");
    } finally {
      setIsAddingCategory(false);
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
      console.log("Token utilisé:", token);

      // Préparer les données pour l'API
      const bookData = {
        titre: book.titre,
        isbn: book.isbn.replace(/[- ]/g, ''),
        langue: book.langue,
        datePublication: book.datePublication,
        nbPages: book.nbPages ? parseInt(book.nbPages) : 0,
        nbExemplaires: parseInt(book.nbExemplaires),
        description: book.description,
        cover: book.cover || null, // Maintenant c'est une URL, pas un base64
        auteurId: parseInt(book.auteurId),
        categorieId: parseInt(book.categorieId)
      };

      console.log("Données envoyées:", bookData);

      const res = await fetch("http://localhost:8080/api/livres", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(bookData),
      });

      console.log("Status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Erreur détaillée:", errorText);
        throw new Error(errorText || `Erreur HTTP: ${res.status}`);
      }

      const createdBook = await res.json();
      toast.success("Livre créé avec succès !");
      setShowSuccess(true);

      setTimeout(() => {
        router.push("/books");
      }, 2000);

    } catch (err: any) {
      console.error("Erreur complète:", err);
      toast.error(err.message || "Impossible de créer le livre");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setBook({
      titre: "",
      isbn: "",
      auteurId: "",
      categorieId: "",
      datePublication: "",
      cover: "",
      description: "",
      langue: "Français",
      nbPages: "",
      nbExemplaires: "1",
    });
    setErrors({});
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-lg">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Livre créé avec succès !
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Le livre a été ajouté à votre bibliothèque.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSuccess(false);
                  handleReset();
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Ajouter un autre
              </button>
              <button
                onClick={() => router.push("/books")}
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
            pageTitle="Ajouter un Nouveau Livre"
            links={[
              { label: "Dashboard", href: "/admin" },
              { label: "Livres", href: "/books" },
              { label: "Nouveau Livre", href: "/books/create" }
            ]}
          />
        </div>

        <ComponentCard
          title={
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Nouveau Livre
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Remplissez les informations du livre
                </p>
              </div>
            </div>
          }
        >
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Titre */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Titre du livre *
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      name="titre"
                      value={book.titre}
                      onChange={handleChange}
                      className={`pl-10 w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.titre ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="Entrez le titre du livre"
                      required
                    />
                  </div>
                  {errors.titre && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.titre}
                    </p>
                  )}
                </div>

                {/* ISBN */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ISBN *
                  </label>
                  <input
                    name="isbn"
                    value={book.isbn}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.isbn ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="Ex: 978-3-16-148410-0"
                    required
                  />
                  {errors.isbn && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.isbn}
                    </p>
                  )}
                </div>

                {/* Langue */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Langue
                  </label>
                  <select
                    name="langue"
                    value={book.langue}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Français">Français</option>
                    <option value="Anglais">Anglais</option>
                    <option value="Espagnol">Espagnol</option>
                    <option value="Allemand">Allemand</option>
                    <option value="Arabe">Arabe</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                {/* Auteur */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Auteur *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      name="auteurId"
                      value={book.auteurId}
                      onChange={handleChange}
                      className={`pl-10 w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.auteurId ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                      }`}
                      required
                    >
                      <option value="">Sélectionner un auteur</option>
                      {auteurs.map((auteur) => (
                        <option key={auteur.id} value={auteur.id}>
                          {getAuteurDisplayName(auteur)}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.auteurId && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.auteurId}
                    </p>
                  )}
                </div>

                {/* Catégorie avec bouton d'ajout */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Catégorie *
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <select
                        name="categorieId"
                        value={book.categorieId}
                        onChange={handleChange}
                        className={`pl-10 w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.categorieId ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                        }`}
                        required
                      >
                        <option value="">Sélectionner une catégorie</option>
                        {categories.map((categorie) => (
                          <option key={categorie.id} value={categorie.id}>
                            {categorie.nom}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddCategory(true)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      title="Ajouter une nouvelle catégorie"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {errors.categorieId && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.categorieId}
                    </p>
                  )}
                </div>

                {/* Date de publication */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date de publication *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="date"
                      name="datePublication"
                      value={book.datePublication}
                      onChange={handleChange}
                      className={`pl-10 w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.datePublication ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                      }`}
                      required
                    />
                  </div>
                  {errors.datePublication && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.datePublication}
                    </p>
                  )}
                </div>

                {/* Nombre de pages */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre de pages
                  </label>
                  <input
                    type="number"
                    name="nbPages"
                    value={book.nbPages}
                    onChange={handleChange}
                    min="1"
                    max="10000"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 250"
                  />
                  {errors.nbPages && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.nbPages}
                    </p>
                  )}
                </div>

                {/* Nombre d'exemplaires */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre d'exemplaires *
                  </label>
                  <input
                    type="number"
                    name="nbExemplaires"
                    value={book.nbExemplaires}
                    onChange={handleChange}
                    min="1"
                    max="1000"
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.nbExemplaires ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="Ex: 5"
                    required
                  />
                  {errors.nbExemplaires && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.nbExemplaires}
                    </p>
                  )}
                </div>

                {/* URL de l'image de couverture */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    URL de l'image de couverture
                  </label>
                  <div className="relative">
                    <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="url"
                      name="cover"
                      value={book.cover}
                      onChange={handleChange}
                      className={`pl-10 w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.cover ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="https://exemple.com/image-livre.jpg"
                    />
                  </div>
                  {errors.cover ? (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.cover}
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Collez l'URL de l'image trouvée sur le web
                    </p>
                  )}

                  {/* Aperçu de l'image */}
                  {book.cover && isValidUrl(book.cover) && (
                    <div className="mt-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Aperçu de l'image:
                      </p>
                      <div className="flex items-center gap-4">
                        <img
                          src={book.cover}
                          alt="Aperçu de la couverture"
                          className="w-16 h-24 object-cover rounded border"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div className="flex-1">
                          <p className="text-sm text-green-600 dark:text-green-400">
                            ✓ URL valide - Image chargée avec succès
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {book.cover}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setBook(prev => ({ ...prev, cover: "" }))}
                          className="p-1 text-red-500 hover:text-red-700 transition-colors"
                          title="Supprimer l'URL"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <textarea
                      name="description"
                      value={book.description}
                      onChange={handleChange}
                      rows={4}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Description du livre..."
                    />
                  </div>
                </div>
              </div>

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
                      Créer le livre
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </ComponentCard>

        {/* Modal pour ajouter une nouvelle catégorie */}
        {showAddCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Ajouter une nouvelle catégorie
                </h3>
                <button
                  onClick={() => {
                    setShowAddCategory(false);
                    setNewCategoryName("");
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nom de la catégorie *
                  </label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Science-Fiction"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCategory();
                      }
                    }}
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setShowAddCategory(false);
                      setNewCategoryName("");
                    }}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleAddCategory}
                    disabled={isAddingCategory || !newCategoryName.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {isAddingCategory ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Ajout...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Ajouter
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}