"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  User,
  BookOpen,
  Calendar,
  Mail,
  Eye,
  AlertTriangle,
  Download,
  RefreshCw,
  Shield,
  XCircle as XCircleIcon
} from "lucide-react";
import toast from "react-hot-toast";

type LoanRequest = {
  id: number;
  utilisateurNom: string;
  livreTitre: string;
  auteurNom: string;
  cover?: string;
  dateDemande: string;
  statut: "EN_ATTENTE" | "VALIDE" | "REJETE" | "TERMINE";
  emailUtilisateur?: string;
  utilisateurId?: number;
  livreId?: number;
};

// Service API pour communiquer avec le backend Spring Boot
const loanRequestService = {
  async getPendingRequests(): Promise<LoanRequest[]> {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8080/api/emprunts', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des demandes');
    }

    const empruntDTOs = await response.json();

    // Filtrer seulement les demandes en attente
    return empruntDTOs
      .filter((dto: any) => dto.statut === "EN_ATTENTE")
      .map((dto: any) => ({
        id: dto.id,
        utilisateurNom: dto.utilisateurNom,
        livreTitre: dto.livreTitre,
        auteurNom: dto.auteurNom,
        dateDemande: dto.dateDemande,
        statut: dto.statut,
        emailUtilisateur: dto.utilisateurEmail,
        utilisateurId: dto.utilisateurId,
        livreId: dto.livreId,
        cover: dto.cover
      }));
  },

  async validerEmprunt(id: number, jours: number): Promise<void> {
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
  },

  async rejeterEmprunt(id: number): Promise<void> {
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
  },

  async getEmpruntDetails(id: number): Promise<any> {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8080/api/emprunts/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des détails');
    }

    return await response.json();
  }
};

export default function LoanRequests() {
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<LoanRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<LoanRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modales
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [jours, setJours] = useState("14");
  const [motif, setMotif] = useState("");
  const [requestDetails, setRequestDetails] = useState<any>(null);

  // 🔹 Charger les demandes en attente depuis l'API
  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const data = await loanRequestService.getPendingRequests();
      setLoanRequests(data);
      setFilteredRequests(data);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du chargement des demandes");
      setLoanRequests([]);
      setFilteredRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Filtrage des demandes
  useEffect(() => {
    const filtered = loanRequests.filter(request =>
      request.utilisateurNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.livreTitre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.auteurNom.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRequests(filtered);
  }, [searchTerm, loanRequests]);

  // ✅ Accepter une demande
  const confirmAccept = async () => {
    if (!selectedRequest) return;
    try {
      await loanRequestService.validerEmprunt(selectedRequest.id, parseInt(jours));

      // Mettre à jour la liste locale
      setLoanRequests(prev => prev.filter(req => req.id !== selectedRequest.id));
      setShowAcceptModal(false);
      setSelectedRequest(null);
      toast.success(`Emprunt accepté pour ${selectedRequest.livreTitre} (${jours} jours)`);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la validation");
    }
  };

  // ❌ Rejeter une demande
  const confirmReject = async () => {
    if (!selectedRequest) return;
    try {
      await loanRequestService.rejeterEmprunt(selectedRequest.id);

      // Mettre à jour la liste locale
      setLoanRequests(prev => prev.filter(req => req.id !== selectedRequest.id));
      setShowRejectModal(false);
      setMotif("");
      setSelectedRequest(null);
      toast.success(`Demande rejetée${motif ? `: ${motif}` : ''}`);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du rejet");
    }
  };

  // 🔍 Voir les détails d'une demande
  const handleViewDetails = async (request: LoanRequest) => {
    try {
      setSelectedRequest(request);
      const details = await loanRequestService.getEmpruntDetails(request.id);
      setRequestDetails(details);
      setShowDetailModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du chargement des détails");
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getDaysSinceRequest = (dateDemande: string) => {
    const requestDate = new Date(dateDemande);
    const today = new Date();
    const diffTime = today.getTime() - requestDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
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
          <PageBreadcrumb pageTitle="Demandes d'emprunt" />
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
          pageTitle="Demandes d'Emprunt en Attente"
          links={[
            { label: "Dashboard", href: "/admin" },
            { label: "Emprunts", href: "/loans" },
            { label: "Demandes", href: "/loan-requests" }
          ]}
        />

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Demandes en attente</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{loanRequests.length}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">En attente depuis plus de 7j</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {loanRequests.filter(req => getDaysSinceRequest(req.dateDemande) > 7).length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Utilisateurs différents</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {new Set(loanRequests.map(req => req.utilisateurId)).size}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <User className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Livres demandés</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {new Set(loanRequests.map(req => req.livreId)).size}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        <ComponentCard
          title="Demandes en Attente de Validation"
          action={
            <div className="flex items-center gap-3">
              <button
                onClick={fetchRequests}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Actualiser"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          }
        >
          <div className="space-y-4">
            {/* Liste des demandes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRequests.map((request) => {
                const daysSince = getDaysSinceRequest(request.dateDemande);
                const isUrgent = daysSince > 7;

                return (
                  <div key={request.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
                    {/* En-tête avec statut */}
                    <div className={`p-4 ${isUrgent ? 'bg-orange-50 dark:bg-orange-900/20 border-b border-orange-200 dark:border-orange-800' : 'bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800'}`}>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          <Clock className="w-3 h-3 mr-1" />
                          En attente
                        </span>
                        {isUrgent && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {daysSince} jours
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Contenu */}
                    <div className="p-4">
                      {/* Utilisateur */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {getInitials(request.utilisateurNom)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 dark:text-white truncate">
                            {request.utilisateurNom}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {request.emailUtilisateur}
                          </div>
                        </div>
                      </div>

                      {/* Livre */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 dark:text-white truncate">
                            {request.livreTitre}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {request.auteurNom}
                          </div>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(request.dateDemande)}
                        </div>
                        <span className={isUrgent ? "text-orange-600 dark:text-orange-400" : "text-gray-500"}>
                          {daysSince === 0 ? "Aujourd'hui" : `Il y a ${daysSince} jour(s)`}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleViewDetails(request)}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                            title="Détails"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowAcceptModal(true);
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                            title="Accepter"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowRejectModal(true);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                            title="Refuser"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredRequests.length === 0 && (
              <div className="text-center py-12">
                <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm ? "Aucune demande ne correspond à votre recherche" : "Aucune demande en attente"}
                </p>
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
        </ComponentCard>
      </div>

      {/* Modal Détails */}
      {showDetailModal && selectedRequest && requestDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Détails de la demande</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Informations utilisateur */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Informations utilisateur
                </h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Nom complet</label>
                    <p className="text-gray-900 dark:text-white">{selectedRequest.utilisateurNom}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                    <p className="text-gray-900 dark:text-white">{selectedRequest.emailUtilisateur}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">ID Utilisateur</label>
                    <p className="text-gray-900 dark:text-white">{selectedRequest.utilisateurId}</p>
                  </div>
                </div>
              </div>

              {/* Informations livre */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Informations livre
                </h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Titre</label>
                    <p className="text-gray-900 dark:text-white">{selectedRequest.livreTitre}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Auteur</label>
                    <p className="text-gray-900 dark:text-white">{selectedRequest.auteurNom}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">ID Livre</label>
                    <p className="text-gray-900 dark:text-white">{selectedRequest.livreId}</p>
                  </div>
                </div>
              </div>

              {/* Informations demande */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Informations demande
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Date demande</label>
                    <p className="text-gray-900 dark:text-white">{formatDate(selectedRequest.dateDemande)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Jours d'attente</label>
                    <p className="text-gray-900 dark:text-white">{getDaysSinceRequest(selectedRequest.dateDemande)} jour(s)</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Statut</label>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      En attente
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Acceptation */}
      {showAcceptModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Valider l'emprunt</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Accepter la demande de <strong>{selectedRequest.utilisateurNom}</strong> pour le livre <strong>"{selectedRequest.livreTitre}"</strong> ?
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Durée de l'emprunt (jours)
                </label>
                <select
                  value={jours}
                  onChange={(e) => setJours(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="7">7 jours</option>
                  <option value="14">14 jours</option>
                  <option value="21">21 jours</option>
                  <option value="30">30 jours</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowAcceptModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmAccept}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Confirmer l'acceptation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Rejet */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rejeter la demande</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Rejeter la demande de <strong>{selectedRequest.utilisateurNom}</strong> pour le livre <strong>"{selectedRequest.livreTitre}"</strong> ?
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Motif du rejet (optionnel)
                </label>
                <textarea
                  value={motif}
                  onChange={(e) => setMotif(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Indiquez le motif du rejet..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmReject}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirmer le rejet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}