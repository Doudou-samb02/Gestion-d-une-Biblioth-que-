"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {
  Edit2,
  Trash2,
  ArrowRightCircle,
  Search,
  Plus,
  Calendar,
  BookOpen,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MoreVertical,
  Download,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  IdCard,
  BarChart3,
  Eye,
  XCircle as XCircleIcon
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

type Statut = "EN_ATTENTE" | "VALIDE" | "REJETE" | "TERMINE";

type Loan = {
  id: number;
  livreTitre: string;
  auteurNom: string;
  utilisateurNom: string;
  dateEmprunt: string;
  dateLimiteRetour: string;
  dateRetour: string | null;
  statut: Statut;
  couvertureLivre?: string;
  emailUtilisateur?: string;
  telephoneUtilisateur?: string;
  adresseUtilisateur?: string;
  utilisateurId?: number;
  livreId?: number;
  isbn?: string;
  genreLivre?: string;
  datePublication?: string;
  dureeEmprunt?: number;
  prolongations?: number;
  dateDemande?: string;
  rendu?: boolean;
};

// Service API pour communiquer avec le backend Spring Boot
const empruntService = {
  async getAllEmprunts(): Promise<Loan[]> {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8080/api/emprunts', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des emprunts');
    }

    const empruntDTOs = await response.json();

    return empruntDTOs.map((dto: any) => ({
      id: dto.id,
      livreTitre: dto.livreTitre,
      auteurNom: dto.auteurNom,
      utilisateurNom: dto.utilisateurNom,
      dateEmprunt: dto.dateEmprunt || dto.dateDemande,
      dateLimiteRetour: dto.dateLimiteRetour,
      dateRetour: dto.dateRetour,
      statut: dto.statut as Statut,
      couvertureLivre: dto.cover,
      emailUtilisateur: dto.utilisateurEmail,
      utilisateurId: dto.utilisateurId,
      livreId: dto.livreId,
      rendu: dto.rendu,
      dateDemande: dto.dateDemande
    }));
  },

  async rendreEmprunt(id: number): Promise<Loan> {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8080/api/emprunts/rendre/${id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors du retour de l\'emprunt');
    }

    const dto = await response.json();
    return this.mapDtoToLoan(dto);
  },

  async deleteEmprunt(id: number): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8080/api/emprunts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression de l\'emprunt');
    }
  },

  async prolongerEmprunt(id: number, jours: number): Promise<Loan> {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8080/api/emprunts/${id}/prolonger?jours=${jours}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la prolongation de l\'emprunt');
    }

    const dto = await response.json();
    return this.mapDtoToLoan(dto);
  },

  async validerEmprunt(id: number, jours: number): Promise<Loan> {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8080/api/emprunts/valider/${id}?jours=${jours}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la validation de l\'emprunt');
    }

    const dto = await response.json();
    return this.mapDtoToLoan(dto);
  },

  async rejeterEmprunt(id: number): Promise<Loan> {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8080/api/emprunts/rejeter/${id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors du rejet de l\'emprunt');
    }

    const dto = await response.json();
    return this.mapDtoToLoan(dto);
  },

  mapDtoToLoan(dto: any): Loan {
    return {
      id: dto.id,
      livreTitre: dto.livreTitre,
      auteurNom: dto.auteurNom,
      utilisateurNom: dto.utilisateurNom,
      dateEmprunt: dto.dateEmprunt || dto.dateDemande,
      dateLimiteRetour: dto.dateLimiteRetour,
      dateRetour: dto.dateRetour,
      statut: dto.statut as Statut,
      couvertureLivre: dto.cover,
      emailUtilisateur: dto.utilisateurEmail,
      utilisateurId: dto.utilisateurId,
      livreId: dto.livreId,
      rendu: dto.rendu,
      dateDemande: dto.dateDemande
    };
  }
};

export default function LoanManagement() {
  const router = useRouter();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<Statut | "">("");
  const [sortBy, setSortBy] = useState<"dateEmprunt" | "dateLimiteRetour" | "livreTitre">("dateEmprunt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState(true);

  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showProlongerModal, setShowProlongerModal] = useState(false);
  const [showRejeterModal, setShowRejeterModal] = useState(false);

  const [editDateLimite, setEditDateLimite] = useState("");
  const [editStatus, setEditStatus] = useState<"VALIDE" | "REJETE" | "TERMINE">("VALIDE");
  const [prolongationJours, setProlongationJours] = useState(7);

  const fetchLoans = async () => {
    try {
      setIsLoading(true);
      const data = await empruntService.getAllEmprunts();
      // Filtrer pour exclure les emprunts avec statut EN_ATTENTE
      const filteredLoans = data.filter(loan => loan.statut !== "EN_ATTENTE");
      setLoans(filteredLoans);
      setFilteredLoans(filteredLoans);
    } catch (err) {
      console.error(err);
      toast.error("Impossible de charger les emprunts");
      setLoans([]);
      setFilteredLoans([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  useEffect(() => {
    let result = loans.filter(loan =>
      loan.livreTitre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.utilisateurNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.auteurNom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterStatus) {
      result = result.filter(loan => loan.statut === filterStatus);
    }

    result.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (sortBy.includes("date")) {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredLoans(result);
  }, [loans, searchTerm, filterStatus, sortBy, sortOrder]);

  const handleReturn = async (loanId: number) => {
    try {
      const updatedLoan = await empruntService.rendreEmprunt(loanId);
      setLoans(prev => prev.map(loan =>
        loan.id === loanId ? updatedLoan : loan
      ));
      toast.success("Emprunt marqué comme retourné !");
      setShowReturnModal(false);
      setSelectedLoan(null);
    } catch (err) {
      console.error(err);
      toast.error("Impossible de marquer comme retourné");
    }
  };

  const handleDelete = async (loanId: number) => {
    try {
      await empruntService.deleteEmprunt(loanId);
      setLoans(prev => prev.filter(loan => loan.id !== loanId));
      toast.success("Emprunt supprimé !");
      setShowDeleteModal(false);
      setSelectedLoan(null);
    } catch (err) {
      console.error(err);
      toast.error("Impossible de supprimer l'emprunt");
    }
  };

  const handleEdit = async () => {
    if (!selectedLoan) return;
    try {
      // Implémentation selon vos besoins spécifiques
      // Pour l'instant, on recharge les données
      await fetchLoans();
      toast.success("Emprunt modifié !");
      setShowEditModal(false);
      setSelectedLoan(null);
    } catch (err) {
      console.error(err);
      toast.error("Impossible de modifier l'emprunt");
    }
  };

  const handleProlonger = async () => {
    if (!selectedLoan) return;
    try {
      const updatedLoan = await empruntService.prolongerEmprunt(selectedLoan.id, prolongationJours);
      setLoans(prev => prev.map(loan =>
        loan.id === selectedLoan.id ? updatedLoan : loan
      ));
      toast.success(`Emprunt prolongé de ${prolongationJours} jours !`);
      setShowProlongerModal(false);
      setSelectedLoan(null);
    } catch (err) {
      console.error(err);
      toast.error("Impossible de prolonger l'emprunt");
    }
  };

  const handleRejeter = async () => {
    if (!selectedLoan) return;
    try {
      const updatedLoan = await empruntService.rejeterEmprunt(selectedLoan.id);
      setLoans(prev => prev.map(loan =>
        loan.id === selectedLoan.id ? updatedLoan : loan
      ));
      toast.success("Emprunt rejeté !");
      setShowRejeterModal(false);
      setSelectedLoan(null);
    } catch (err) {
      console.error(err);
      toast.error("Impossible de rejeter l'emprunt");
    }
  };

  const getStatusConfig = (statut: Statut) => {
    switch (statut) {
      case "VALIDE":
        return {
          color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
          icon: Clock,
          label: "En cours",
          badgeColor: "bg-blue-500"
        };
      case "REJETE":
        return {
          color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
          icon: XCircle,
          label: "Rejeté",
          badgeColor: "bg-red-500"
        };
      case "TERMINE":
        return {
          color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
          icon: CheckCircle2,
          label: "Retourné",
          badgeColor: "bg-green-500"
        };
      case "EN_ATTENTE":
        return {
          color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
          icon: Clock,
          label: "En attente",
          badgeColor: "bg-yellow-500"
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
          icon: Clock,
          label: "Inconnu",
          badgeColor: "bg-gray-500"
        };
    }
  };

  const isOverdue = (dateLimite: string) => {
    return new Date(dateLimite) < new Date();
  };

  const getDaysRemaining = (dateLimite: string) => {
    const today = new Date();
    const limitDate = new Date(dateLimite);
    const diffTime = limitDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Non spécifié";
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <PageBreadcrumb pageTitle="Gestion des Emprunts" />
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
        <Toaster position="top-right" />

        <PageBreadcrumb
          pageTitle="Gestion des Emprunts"
          links={[
            { label: "Dashboard", href: "/admin" },
            { label: "Emprunts", href: "/loans" }
          ]}
        />

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Emprunts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{loans.length}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">En cours</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {loans.filter(l => l.statut === "VALIDE").length}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Retournés</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {loans.filter(l => l.statut === "TERMINE").length}
                </p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rejetés</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {loans.filter(l => l.statut === "REJETE").length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>

        <ComponentCard
          title="Liste des Emprunts (sous traitement)"
          action={
            <div className="flex items-center gap-3">
              <button
                onClick={fetchLoans}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Actualiser"
              >
                <RefreshCw className="w-4 h-4" />
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
                  placeholder="Rechercher un livre, auteur ou utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as Statut | "")}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tous les statuts</option>
                  <option value="VALIDE">En cours</option>
                  <option value="REJETE">Rejetés</option>
                  <option value="TERMINE">Retournés</option>
                </select>

                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                  <button
                    onClick={() => {
                      if (sortBy === "dateEmprunt") {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      } else {
                        setSortBy("dateEmprunt");
                        setSortOrder("desc");
                      }
                    }}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${
                      sortBy === "dateEmprunt"
                        ? "bg-white dark:bg-gray-700 shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    Date {sortBy === "dateEmprunt" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                  <button
                    onClick={() => {
                      if (sortBy === "dateLimiteRetour") {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      } else {
                        setSortBy("dateLimiteRetour");
                        setSortOrder("asc");
                      }
                    }}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${
                      sortBy === "dateLimiteRetour"
                        ? "bg-white dark:bg-gray-700 shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    Retour {sortBy === "dateLimiteRetour" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                </div>
              </div>
            </div>

            {/* Tableau des emprunts */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Livre & Auteur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Utilisateur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Dates
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
                    {filteredLoans.map((loan) => {
                      const statusConfig = getStatusConfig(loan.statut);
                      const StatusIcon = statusConfig.icon;
                      const isLate = loan.statut === "VALIDE" && isOverdue(loan.dateLimiteRetour);
                      const daysRemaining = getDaysRemaining(loan.dateLimiteRetour);

                      return (
                        <tr key={loan.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                                <BookOpen className="w-5 h-5" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {loan.livreTitre}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {loan.auteurNom}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                {getInitials(loan.utilisateurNom)}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {loan.utilisateurNom}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {loan.emailUtilisateur}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="text-sm text-gray-900 dark:text-white">
                                <Calendar className="w-3 h-3 inline mr-1" />
                                {loan.dateDemande ? "Demande: " : "Emprunt: "}
                                {formatDate(loan.dateEmprunt || loan.dateDemande || "")}
                              </div>
                              {loan.dateLimiteRetour && (
                                <div className={`text-sm ${isLate ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400"}`}>
                                  <Clock className="w-3 h-3 inline mr-1" />
                                  Retour: {formatDate(loan.dateLimiteRetour)}
                                  {loan.statut === "VALIDE" && (
                                    <span className={`text-xs ml-2 ${isLate ? "text-red-600" : "text-gray-500"}`}>
                                      ({isLate ? `+${Math.abs(daysRemaining)}j retard` : `${daysRemaining}j restants`})
                                    </span>
                                  )}
                                </div>
                              )}
                              {loan.dateRetour && (
                                <div className="text-sm text-green-600 dark:text-green-400">
                                  <CheckCircle2 className="w-3 h-3 inline mr-1" />
                                  Retourné: {formatDate(loan.dateRetour)}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusConfig.label}
                            </span>
                            {isLate && loan.statut === "VALIDE" && (
                              <div className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                En retard
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedLoan(loan);
                                  setShowDetailModal(true);
                                }}
                                className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                title="Voir les détails"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {loan.statut === "VALIDE" && (
                                <>
                                  <button
                                    onClick={() => {
                                      setSelectedLoan(loan);
                                      setShowReturnModal(true);
                                    }}
                                    className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                    title="Marquer comme retourné"
                                  >
                                    <ArrowRightCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedLoan(loan);
                                      setShowProlongerModal(true);
                                    }}
                                    className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                                    title="Prolonger l'emprunt"
                                  >
                                    <BarChart3 className="w-4 h-4" />
                                  </button>
                                </>
                              )}

                              {loan.statut === "REJETE" && (
                                <button
                                  onClick={() => {
                                    setSelectedLoan(loan);
                                    setShowRejeterModal(true);
                                  }}
                                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                  title="Réactiver l'emprunt"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  setSelectedLoan(loan);
                                  setEditDateLimite(loan.dateLimiteRetour || "");
                                  setEditStatus(loan.statut);
                                  setShowEditModal(true);
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                title="Modifier"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedLoan(loan);
                                  setShowDeleteModal(true);
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredLoans.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Aucun emprunt trouvé</p>
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

      {/* Modal Détails */}
      {showDetailModal && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Détails de l'emprunt
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Informations du livre */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Informations du livre
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Titre</label>
                      <p className="text-gray-900 dark:text-white">{selectedLoan.livreTitre}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Auteur</label>
                      <p className="text-gray-900 dark:text-white">{selectedLoan.auteurNom}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">ID Livre</label>
                      <p className="text-gray-900 dark:text-white">{selectedLoan.livreId || "Non spécifié"}</p>
                    </div>
                  </div>
                </div>

                {/* Informations de l'utilisateur */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informations de l'utilisateur
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Nom complet</label>
                      <p className="text-gray-900 dark:text-white">{selectedLoan.utilisateurNom}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        Email
                      </label>
                      <p className="text-gray-900 dark:text-white">{selectedLoan.emailUtilisateur || "Non spécifié"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <IdCard className="w-4 h-4" />
                        ID Utilisateur
                      </label>
                      <p className="text-gray-900 dark:text-white">{selectedLoan.utilisateurId || "Non spécifié"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations de l'emprunt */}
              <div className="mt-6 space-y-4">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Informations de l'emprunt
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Date de demande</label>
                    <p className="text-gray-900 dark:text-white">{formatDate(selectedLoan.dateDemande || "")}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Date d'emprunt</label>
                    <p className="text-gray-900 dark:text-white">{formatDate(selectedLoan.dateEmprunt || "")}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Date limite de retour</label>
                    <p className={`${isOverdue(selectedLoan.dateLimiteRetour) ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white"}`}>
                      {formatDate(selectedLoan.dateLimiteRetour || "")}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Date de retour</label>
                    <p className={selectedLoan.dateRetour ? "text-green-600 dark:text-green-400" : "text-gray-500"}>
                      {selectedLoan.dateRetour ? formatDate(selectedLoan.dateRetour) : "Non retourné"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Statut</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusConfig(selectedLoan.statut).color}`}>
                      {getStatusConfig(selectedLoan.statut).label}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Retour effectué</label>
                    <p className="text-gray-900 dark:text-white">{selectedLoan.rendu ? "Oui" : "Non"}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Retour */}
      {showReturnModal && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6">
            <div className="text-center mb-4">
              <ArrowRightCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Confirmer le retour
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Marquer le livre <strong>"{selectedLoan.livreTitre}"</strong> comme retourné ?
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowReturnModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleReturn(selectedLoan.id)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Confirmer le retour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Rejeter */}
      {showRejeterModal && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Confirmer le rejet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Êtes-vous sûr de vouloir rejeter l'emprunt de <strong>"{selectedLoan.livreTitre}"</strong> ?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowRejeterModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleRejeter}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Rejeter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Prolonger */}
      {showProlongerModal && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Prolonger l'emprunt
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre de jours supplémentaires
                </label>
                <select
                  value={prolongationJours}
                  onChange={(e) => setProlongationJours(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={7}>7 jours</option>
                  <option value={14}>14 jours</option>
                  <option value={21}>21 jours</option>
                  <option value={30}>30 jours</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowProlongerModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleProlonger}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Prolonger
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Supprimer */}
      {showDeleteModal && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 text-center">
            <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Confirmer la suppression
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Êtes-vous sûr de vouloir supprimer l'emprunt de <strong>"{selectedLoan.livreTitre}"</strong> ?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(selectedLoan.id)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Modifier */}
      {showEditModal && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Modifier l'emprunt
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date limite de retour
                </label>
                <input
                  type="date"
                  value={editDateLimite}
                  onChange={(e) => setEditDateLimite(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Statut
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as "VALIDE" | "REJETE" | "TERMINE")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="VALIDE">En cours</option>
                  <option value="REJETE">Rejeté</option>
                  <option value="TERMINE">Retourné</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleEdit}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}