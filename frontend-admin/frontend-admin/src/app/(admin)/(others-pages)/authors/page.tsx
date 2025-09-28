"use client";

import React, { useState, useEffect } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  User,
  Calendar,
  BookOpen,
  MoreVertical,
  Eye,
  Download,
  Upload,
  MapPin,
  Award,
  ChevronDown,
  X,
  RefreshCw
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Auteur = {
  id: number;
  nomComplet: string;
  nationalite: string;
  biographie?: string;
  dateNaissance?: string;
  dateDeces?: string;
  booksCount: number;
};

type Livre = {
  id: number;
  titre: string;
  auteurNom: string;
  datePublication: string;
  statut: string;
};

export default function ListAuthors() {
  const router = useRouter();
  const [auteurs, setAuteurs] = useState<Auteur[]>([]);
  const [filteredAuteurs, setFilteredAuteurs] = useState<Auteur[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [nationaliteFilter, setNationaliteFilter] = useState("");
  const [sortBy, setSortBy] = useState<"nomComplet" | "dateNaissance" | "booksCount">("nomComplet");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [editingAuteur, setEditingAuteur] = useState<Auteur | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuteurDetails, setShowAuteurDetails] = useState<Auteur | null>(null);
  const [auteurLivres, setAuteurLivres] = useState<Livre[]>([]);

  // Charger les auteurs depuis l'API
  const fetchAuteurs = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/auteurs', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des auteurs');
      }

      const data = await response.json();
      setAuteurs(data);
      setFilteredAuteurs(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des auteurs");
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les livres d'un auteur
  const fetchAuteurLivres = async (auteurId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/auteurs/${auteurId}/livres`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAuteurLivres(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des livres:', error);
    }
  };

  useEffect(() => {
    fetchAuteurs();
  }, []);

  // Filtrage et tri
  useEffect(() => {
    let result = auteurs.filter(auteur =>
      auteur.nomComplet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auteur.biographie?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auteur.nationalite?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (nationaliteFilter && nationaliteFilter !== "Toutes") {
      result = result.filter(auteur => auteur.nationalite === nationaliteFilter);
    }

    // Tri
    result.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (sortBy === "dateNaissance") {
        aValue = new Date(a.dateNaissance || "");
        bValue = new Date(b.dateNaissance || "");
      }

      if (sortBy === "booksCount") {
        aValue = a.booksCount || 0;
        bValue = b.booksCount || 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredAuteurs(result);
  }, [auteurs, searchTerm, nationaliteFilter, sortBy, sortOrder]);

  const nationalites = Array.from(new Set(auteurs.map(a => a.nationalite).filter(Boolean)));

  // Supprimer un auteur
  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/auteurs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchAuteurs();
        setDeleteConfirm(null);
        toast.success("Auteur supprimé avec succès");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'auteur");
      console.error('Erreur:', error);
    }
  };

  // Modifier un auteur
  const handleEditSave = async () => {
    if (!editingAuteur) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/auteurs/${editingAuteur.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nomComplet: editingAuteur.nomComplet,
          nationalite: editingAuteur.nationalite,
          biographie: editingAuteur.biographie,
          dateNaissance: editingAuteur.dateNaissance,
          dateDeces: editingAuteur.dateDeces
        })
      });

      if (response.ok) {
        await fetchAuteurs();
        setEditingAuteur(null);
        toast.success("Auteur modifié avec succès");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la modification');
      }
    } catch (error) {
      toast.error("Erreur lors de la modification de l'auteur");
      console.error('Erreur:', error);
    }
  };

  // Afficher les détails d'un auteur
  const handleShowDetails = async (auteur: Auteur) => {
    setShowAuteurDetails(auteur);
    await fetchAuteurLivres(auteur.id);
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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <PageBreadcrumb pageTitle="Liste des Auteurs" />
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <PageBreadcrumb
          pageTitle="Gestion des Auteurs"
          links={[
            { label: "Dashboard", href: "/admin" },
            { label: "Auteurs", href: "/authors" }
          ]}
        />

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Auteurs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{auteurs.length}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Livres total</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {auteurs.reduce((sum, auteur) => sum + auteur.booksCount, 0)}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Nationalités</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {new Set(auteurs.map(a => a.nationalite)).size}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Moyenne livres/auteur</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {auteurs.length > 0 
                    ? (auteurs.reduce((sum, auteur) => sum + auteur.booksCount, 0) / auteurs.length).toFixed(1)
                    : '0'
                  }
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                <Award className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        <ComponentCard
          title="Liste des Auteurs"
          action={
            <div className="flex gap-2">
              <button
                onClick={fetchAuteurs}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Actualiser
              </button>
              <button
                onClick={() => router.push("/authors/create")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nouvel Auteur
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
                  placeholder="Rechercher un auteur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <select
                  value={nationaliteFilter}
                  onChange={(e) => setNationaliteFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Toutes les nationalités</option>
                  {nationalites.map(nat => (
                    <option key={nat} value={nat}>{nat}</option>
                  ))}
                </select>

                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                  <button
                    onClick={() => {
                      if (sortBy === "nomComplet") {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      } else {
                        setSortBy("nomComplet");
                        setSortOrder("asc");
                      }
                    }}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${
                      sortBy === "nomComplet"
                        ? "bg-white dark:bg-gray-700 shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    Nom {sortBy === "nomComplet" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                  <button
                    onClick={() => {
                      if (sortBy === "booksCount") {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      } else {
                        setSortBy("booksCount");
                        setSortOrder("desc");
                      }
                    }}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${
                      sortBy === "booksCount"
                        ? "bg-white dark:bg-gray-700 shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    Livres {sortBy === "booksCount" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                </div>
              </div>
            </div>

            {/* Tableau des auteurs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Auteur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Nationalité
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Dates
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Livres
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {filteredAuteurs.map((auteur) => (
                      <tr key={auteur.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {getInitials(auteur.nomComplet)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {auteur.nomComplet}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                {auteur.biographie || "Aucune biographie"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            <MapPin className="w-3 h-3 mr-1" />
                            {auteur.nationalite || "Non spécifiée"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(auteur.dateNaissance)}
                            </div>
                            {auteur.dateDeces && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                † {formatDate(auteur.dateDeces)}
                                {calculateAge(auteur.dateNaissance!, auteur.dateDeces) &&
                                  ` (${calculateAge(auteur.dateNaissance!, auteur.dateDeces)} ans)`}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {auteur.booksCount}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">livres</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleShowDetails(auteur)}
                              className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                              title="Voir détails"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingAuteur(auteur)}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(auteur.id)}
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

              {filteredAuteurs.length === 0 && (
                <div className="text-center py-12">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Aucun auteur trouvé</p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="mt-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Réinitialiser la recherche
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </ComponentCard>
      </div>

      {/* Modal de modification */}
      {editingAuteur && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Modifier l'auteur</h2>
              <button
                onClick={() => setEditingAuteur(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom complet *
                </label>
                <input
                  value={editingAuteur.nomComplet}
                  onChange={(e) => setEditingAuteur({...editingAuteur, nomComplet: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nationalité
                </label>
                <input
                  value={editingAuteur.nationalite || ""}
                  onChange={(e) => setEditingAuteur({...editingAuteur, nationalite: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Biographie
                </label>
                <textarea
                  value={editingAuteur.biographie || ""}
                  onChange={(e) => setEditingAuteur({...editingAuteur, biographie: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    value={editingAuteur.dateNaissance || ""}
                    onChange={(e) => setEditingAuteur({...editingAuteur, dateNaissance: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date de décès (optionnel)
                  </label>
                  <input
                    type="date"
                    value={editingAuteur.dateDeces || ""}
                    onChange={(e) => setEditingAuteur({...editingAuteur, dateDeces: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setEditingAuteur(null)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleEditSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de détails de l'auteur */}
      {showAuteurDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Détails de l'auteur
              </h2>
              <button
                onClick={() => setShowAuteurDetails(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Informations personnelles</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Nom complet</label>
                    <p className="text-gray-900 dark:text-white">{showAuteurDetails.nomComplet}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Nationalité</label>
                    <p className="text-gray-900 dark:text-white">{showAuteurDetails.nationalite || "Non spécifiée"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Biographie</label>
                    <p className="text-gray-900 dark:text-white mt-1">{showAuteurDetails.biographie || "Aucune biographie disponible"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Dates importantes</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Date de naissance</label>
                    <p className="text-gray-900 dark:text-white">{formatDate(showAuteurDetails.dateNaissance)}</p>
                  </div>
                  {showAuteurDetails.dateDeces && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Date de décès</label>
                      <p className="text-gray-900 dark:text-white">
                        {formatDate(showAuteurDetails.dateDeces)}
                        {calculateAge(showAuteurDetails.dateNaissance!, showAuteurDetails.dateDeces) &&
                          ` (${calculateAge(showAuteurDetails.dateNaissance!, showAuteurDetails.dateDeces)} ans)`}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Nombre de livres</label>
                    <p className="text-gray-900 dark:text-white">{showAuteurDetails.booksCount}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Livres de l'auteur</h3>
                {auteurLivres.length > 0 ? (
                  <div className="space-y-3">
                    {auteurLivres.map((livre) => (
                      <div key={livre.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{livre.titre}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Publié le: {formatDate(livre.datePublication)}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            livre.statut === 'DISPONIBLE' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {livre.statut}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">Aucun livre trouvé pour cet auteur</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm p-6 text-center">
            <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Confirmer la suppression
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Êtes-vous sûr de vouloir supprimer cet auteur ? Cette action est irréversible.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
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