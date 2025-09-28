"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {
  Edit2,
  Trash2,
  Search,
  Plus,
  Filter,
  BookOpen,
  User,
  Tag,
  Calendar,
  Eye,
  MoreVertical,
  Download,
  Upload,
  Shield,
  Star,
  CheckCircle2,
  FileText,
  Globe,
  Copy
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

type Livre = {
  id: number;
  titre: string;
  isbn: string;
  langue: string;
  datePublication: string;
  nbPages: number;
  nbExemplaires: number;
  description: string;
  cover: string;
  auteurId: number;
  auteurNom: string;
  categorieId: number;
  categorieNom: string;
  statut: "Disponible" | "Indisponible";
  nbEmprunts: number;
};

type Auteur = { id: number; nom: string };
type Categorie = { id: number; nom: string };

export default function LivresPage() {
  const [livres, setLivres] = useState<Livre[]>([]);
  const [auteurs, setAuteurs] = useState<Auteur[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [auteurFilter, setAuteurFilter] = useState<number | "">("");
  const [categorieFilter, setCategorieFilter] = useState<number | "">("");
  const [statutFilter, setStatutFilter] = useState<string>("");

  const [selectedLivre, setSelectedLivre] = useState<Livre | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Champs pour l'ajout et la modification
  const [formData, setFormData] = useState({
    titre: "",
    isbn: "",
    langue: "",
    datePublication: "",
    nbPages: 0,
    nbExemplaires: 0,
    description: "",
    cover: "",
    auteurId: null as number | null,
    categorieId: null as number | null,
  });

  const token = localStorage.getItem("token");

  // 🔹 Fetch livres
  const fetchLivres = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/livres", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur lors du chargement des livres");
      const data: Livre[] = await res.json();
      setLivres(data);
    } catch (err) {
      console.error(err);
      toast.error("Impossible de charger les livres");
    }
  };

  // 🔹 Fetch auteurs
  const fetchAuteurs = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/auteurs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur lors du chargement des auteurs");
      const data: Auteur[] = await res.json();
      setAuteurs(data);
    } catch (err) {
      console.error(err);
      toast.error("Impossible de charger les auteurs");
    }
  };

  // 🔹 Fetch catégories
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur lors du chargement des catégories");
      const data: Categorie[] = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
      toast.error("Impossible de charger les catégories");
    }
  };

  useEffect(() => {
    fetchLivres();
    fetchAuteurs();
    fetchCategories();
  }, []);

  // 🔹 Filtrage des livres
  const filteredLivres = livres.filter(livre => {
    const matchesSearch = livre.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         livre.isbn.includes(searchTerm) ||
                         livre.auteurNom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAuteur = !auteurFilter || livre.auteurId === auteurFilter;
    const matchesCategorie = !categorieFilter || livre.categorieId === categorieFilter;
    const matchesStatut = !statutFilter || livre.statut === statutFilter;

    return matchesSearch && matchesAuteur && matchesCategorie && matchesStatut;
  });

  // 🔹 Voir les détails d'un livre
  const handleView = (livre: Livre) => {
    setSelectedLivre(livre);
    setShowViewModal(true);
  };

  // 🔹 Modifier un livre
  const handleEdit = (livre: Livre) => {
    setSelectedLivre(livre);
    setFormData({
      titre: livre.titre,
      isbn: livre.isbn,
      langue: livre.langue,
      datePublication: livre.datePublication,
      nbPages: livre.nbPages,
      nbExemplaires: livre.nbExemplaires,
      description: livre.description,
      cover: livre.cover,
      auteurId: livre.auteurId,
      categorieId: livre.categorieId,
    });
    setShowEditModal(true);
  };

  const submitEdit = async () => {
    if (!selectedLivre) return;
    try {
      const res = await fetch(`http://localhost:8080/api/livres/${selectedLivre.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Erreur lors de la modification");
      await fetchLivres();
      setShowEditModal(false);
      toast.success("Livre modifié avec succès !");
    } catch (err) {
      console.error(err);
      toast.error("Impossible de modifier le livre");
    }
  };

  // 🔹 Ajouter un livre
  const handleAdd = () => {
    setFormData({
      titre: "",
      isbn: "",
      langue: "",
      datePublication: "",
      nbPages: 0,
      nbExemplaires: 0,
      description: "",
      cover: "",
      auteurId: null,
      categorieId: null,
    });
    setShowAddModal(true);
  };

  const submitAdd = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/livres", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Erreur lors de l'ajout");
      await fetchLivres();
      setShowAddModal(false);
      toast.success("Livre ajouté avec succès !");
    } catch (err) {
      console.error(err);
      toast.error("Impossible d'ajouter le livre");
    }
  };

  // 🔹 Supprimer un livre
  const handleDelete = (livre: Livre) => {
    setSelectedLivre(livre);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedLivre) return;
    try {
      const res = await fetch(`http://localhost:8080/api/livres/${selectedLivre.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      setLivres(livres.filter((l) => l.id !== selectedLivre.id));
      setShowDeleteModal(false);
      toast.success("Livre supprimé avec succès !");
    } catch (err) {
      console.error(err);
      toast.error("Impossible de supprimer le livre");
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "Disponible": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Indisponible": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <Toaster position="top-right" />

        <PageBreadcrumb
          pageTitle="Gestion des Livres"
          links={[
            { label: "Dashboard", href: "/admin" },
            { label: "Livres", href: "/books" }
          ]}
        />

        {/* Header avec statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Livres</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{livres.length}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Disponibles</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {livres.filter(l => l.statut === "Disponible").length}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Emprunts totaux</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {livres.reduce((total, livre) => total + livre.nbEmprunts, 0)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Auteurs</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {auteurs.length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                <User className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        <ComponentCard
          title="Catalogue des Livres"
          action={
            <div className="flex items-center gap-3">
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "table"
                      ? "bg-white dark:bg-gray-700 shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  Tableau
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-gray-700 shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  Grille
                </button>
              </div>
              <button
                onClick={handleAdd}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Ajouter un livre
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            {/* Barre de recherche et filtres */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher un livre, auteur ou ISBN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <select
                  value={auteurFilter}
                  onChange={(e) => setAuteurFilter(e.target.value ? Number(e.target.value) : "")}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tous les auteurs</option>
                  {auteurs.map(auteur => (
                    <option key={auteur.id} value={auteur.id}>{auteur.nom}</option>
                  ))}
                </select>

                <select
                  value={categorieFilter}
                  onChange={(e) => setCategorieFilter(e.target.value ? Number(e.target.value) : "")}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map(categorie => (
                    <option key={categorie.id} value={categorie.id}>{categorie.nom}</option>
                  ))}
                </select>

                <select
                  value={statutFilter}
                  onChange={(e) => setStatutFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tous les statuts</option>
                  <option value="Disponible">Disponible</option>
                  <option value="Indisponible">Indisponible</option>
                </select>
              </div>
            </div>

            {/* Affichage tableau ou grille */}
            {viewMode === "table" ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Livre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          ISBN
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Auteur
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Catégorie
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      {filteredLivres.map((livre) => (
                        <tr key={livre.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                                <BookOpen className="w-5 h-5" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {livre.titre}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {new Date(livre.datePublication).getFullYear()} • {livre.nbPages} pages
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-mono">
                            {livre.isbn}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {livre.auteurNom}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              <Tag className="w-3 h-3 mr-1" />
                              {livre.categorieNom}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutColor(livre.statut)}`}>
                              {livre.statut}
                            </span>
                            <div className="text-xs text-gray-500 mt-1">
                              {livre.nbEmprunts} emprunt(s)
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleView(livre)}
                                className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                title="Voir détails"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEdit(livre)}
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                title="Modifier"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(livre)}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredLivres.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">Aucun livre trouvé</p>
                  </div>
                )}
              </div>
            ) : (
              /* Vue Grille */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredLivres.map((livre) => (
                  <div key={livre.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutColor(livre.statut)}`}>
                          {livre.statut}
                        </span>
                        <span className="text-xs text-gray-500">
                          {livre.nbEmprunts} emprunt(s)
                        </span>
                      </div>

                      <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                        <BookOpen className="w-12 h-12 text-white" />
                      </div>

                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {livre.titre}
                      </h3>

                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {livre.auteurNom}
                        </div>
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          {livre.categorieNom}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(livre.datePublication).getFullYear()} • {livre.nbPages} pages
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          {livre.langue}
                        </div>
                      </div>
                    </div>

                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                          {livre.isbn}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleView(livre)}
                            className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(livre)}
                            className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(livre)}
                            className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ComponentCard>
      </div>

      {/* Modal de visualisation des détails */}
      {showViewModal && selectedLivre && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Détails du livre</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="w-full md:w-1/3 flex justify-center">
                  <div className="w-32 h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                    <BookOpen className="w-16 h-16" />
                  </div>
                </div>

                <div className="w-full md:w-2/3">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedLivre.titre}
                  </h1>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Auteur</label>
                      <p className="text-gray-900 dark:text-white">{selectedLivre.auteurNom}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Catégorie</label>
                      <p className="text-gray-900 dark:text-white">{selectedLivre.categorieNom}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">ISBN</label>
                      <p className="text-gray-900 dark:text-white font-mono">{selectedLivre.isbn}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Langue</label>
                      <p className="text-gray-900 dark:text-white">{selectedLivre.langue}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Date de publication</label>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(selectedLivre.datePublication).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Nombre de pages</label>
                      <p className="text-gray-900 dark:text-white">{selectedLivre.nbPages}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Exemplaires disponibles</label>
                      <p className="text-gray-900 dark:text-white">{selectedLivre.nbExemplaires}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Nombre d'emprunts</label>
                      <p className="text-gray-900 dark:text-white">{selectedLivre.nbEmprunts}</p>
                    </div>
                  </div>

                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatutColor(selectedLivre.statut)}`}>
                    {selectedLivre.statut}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">Description</label>
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {selectedLivre.description || "Aucune description disponible."}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'ajout */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Ajouter un livre</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Titre du livre *
                </label>
                <input
                  type="text"
                  value={formData.titre}
                  onChange={(e) => setFormData({...formData, titre: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ISBN *
                </label>
                <input
                  type="text"
                  value={formData.isbn}
                  onChange={(e) => setFormData({...formData, isbn: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Langue *
                </label>
                <input
                  type="text"
                  value={formData.langue}
                  onChange={(e) => setFormData({...formData, langue: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date de publication *
                </label>
                <input
                  type="date"
                  value={formData.datePublication}
                  onChange={(e) => setFormData({...formData, datePublication: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre de pages *
                </label>
                <input
                  type="number"
                  value={formData.nbPages}
                  onChange={(e) => setFormData({...formData, nbPages: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre d'exemplaires *
                </label>
                <input
                  type="number"
                  value={formData.nbExemplaires}
                  onChange={(e) => setFormData({...formData, nbExemplaires: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Auteur *
                </label>
                <select
                  value={formData.auteurId || ""}
                  onChange={(e) => setFormData({...formData, auteurId: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner un auteur</option>
                  {auteurs.map(auteur => (
                    <option key={auteur.id} value={auteur.id}>{auteur.nom}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Catégorie *
                </label>
                <select
                  value={formData.categorieId || ""}
                  onChange={(e) => setFormData({...formData, categorieId: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(categorie => (
                    <option key={categorie.id} value={categorie.id}>{categorie.nom}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL de la couverture
                </label>
                <input
                  type="text"
                  value={formData.cover}
                  onChange={(e) => setFormData({...formData, cover: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/cover.jpg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={submitAdd}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ajouter le livre
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de modification */}
      {showEditModal && selectedLivre && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Modifier le livre</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Titre du livre *
                </label>
                <input
                  type="text"
                  value={formData.titre}
                  onChange={(e) => setFormData({...formData, titre: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ISBN *
                </label>
                <input
                  type="text"
                  value={formData.isbn}
                  onChange={(e) => setFormData({...formData, isbn: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Langue *
                </label>
                <input
                  type="text"
                  value={formData.langue}
                  onChange={(e) => setFormData({...formData, langue: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date de publication *
                </label>
                <input
                  type="date"
                  value={formData.datePublication}
                  onChange={(e) => setFormData({...formData, datePublication: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre de pages *
                </label>
                <input
                  type="number"
                  value={formData.nbPages}
                  onChange={(e) => setFormData({...formData, nbPages: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre d'exemplaires *
                </label>
                <input
                  type="number"
                  value={formData.nbExemplaires}
                  onChange={(e) => setFormData({...formData, nbExemplaires: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Auteur *
                </label>
                <select
                  value={formData.auteurId || ""}
                  onChange={(e) => setFormData({...formData, auteurId: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner un auteur</option>
                  {auteurs.map(auteur => (
                    <option key={auteur.id} value={auteur.id}>{auteur.nom}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Catégorie *
                </label>
                <select
                  value={formData.categorieId || ""}
                  onChange={(e) => setFormData({...formData, categorieId: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(categorie => (
                    <option key={categorie.id} value={categorie.id}>{categorie.nom}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL de la couverture
                </label>
                <input
                  type="text"
                  value={formData.cover}
                  onChange={(e) => setFormData({...formData, cover: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/cover.jpg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={submitEdit}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Enregistrer les modifications
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && selectedLivre && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm p-6 text-center">
            <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Confirmer la suppression
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Êtes-vous sûr de vouloir supprimer le livre <strong>"{selectedLivre.titre}"</strong> ?
              Cette action est irréversible.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}