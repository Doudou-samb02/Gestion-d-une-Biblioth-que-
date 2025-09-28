"use client";

import React, { useState } from "react";
import { Search, Clock, User, Book, Calendar, CheckCircle, XCircle, Mail, Loader } from "lucide-react";

interface LoanRequest {
  id: number;
  utilisateurNom: string;
  utilisateurEmail: string;
  livreTitre: string;
  dateDemande: string;
  statut: string;
}

interface RecentLoanRequestsProps {
  data?: LoanRequest[] | null;
  onUpdate?: () => void; // Callback pour rafraîchir les données
}

export default function RecentLoanRequests({ data, onUpdate }: RecentLoanRequestsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [loadingAction, setLoadingAction] = useState<number | null>(null); // ID de la demande en cours de traitement

  // Utiliser les données fournies ou un tableau vide par défaut
  const requests: LoanRequest[] = data || [];

  // Filtrer les demandes
  const filteredRequests = requests.filter(request => {
    const matchesSearch =
      request.utilisateurNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.livreTitre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.utilisateurEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" ||
      request.statut.toLowerCase().includes(selectedStatus.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (statut: string) => {
    switch (statut.toUpperCase()) {
      case "ACCEPTÉ":
      case "APPROUVÉ":
      case "APPROVED":
        return <CheckCircle size={16} className="text-green-500" />;
      case "REFUSÉ":
      case "REJETÉ":
      case "REJECTED":
        return <XCircle size={16} className="text-red-500" />;
      case "EN_ATTENTE":
      case "EN ATTENTE":
      case "PENDING":
        return <Clock size={16} className="text-yellow-500" />;
      default:
        return <Clock size={16} className="text-yellow-500" />;
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut.toUpperCase()) {
      case "ACCEPTÉ":
      case "APPROUVÉ":
      case "APPROVED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "REFUSÉ":
      case "REJETÉ":
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "EN_ATTENTE":
      case "EN ATTENTE":
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    }
  };

  const getStatusDisplay = (statut: string): string => {
    switch (statut.toUpperCase()) {
      case "EN_ATTENTE":
        return "En attente";
      case "ACCEPTÉ":
      case "APPROVED":
        return "Accepté";
      case "REFUSÉ":
      case "REJECTED":
        return "Refusé";
      default:
        return statut;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "N/A") {
      return "Date non spécifiée";
    }

    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return "Date invalide";
    }
  };

  const handleAccept = async (requestId: number) => {
    setLoadingAction(requestId);
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/emprunts/valider/${requestId}?jours=14`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log('Demande acceptée avec succès');
        // Rafraîchir les données
        if (onUpdate) onUpdate();
      } else {
        console.error('Erreur lors de l\'acceptation:', await response.text());
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReject = async (requestId: number) => {
    setLoadingAction(requestId);
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/emprunts/rejeter/${requestId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log('Demande refusée avec succès');
        // Rafraîchir les données
        if (onUpdate) onUpdate();
      } else {
        console.error('Erreur lors du refus:', await response.text());
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      {/* En-tête */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Demandes d'Emprunt en Attente
          </h3>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
            {requests.length} demandes
          </span>
        </div>

        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Barre de recherche */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher par nom, livre ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtre par statut */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="accepté">Accepté</option>
            <option value="refusé">Refusé</option>
          </select>
        </div>
      </div>

      {/* Liste des demandes */}
      <div className="max-h-96 overflow-y-auto">
        {filteredRequests.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <Book size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Aucune demande trouvée</p>
            {requests.length === 0 ? (
              <p className="text-sm mt-2">Aucune demande en attente</p>
            ) : (
              <p className="text-sm mt-2">Aucune demande ne correspond aux critères de recherche</p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredRequests.map((request) => (
              <div key={request.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(request.statut)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.statut)}`}>
                      {getStatusDisplay(request.statut)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    #{request.id.toString().padStart(4, '0')}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
                  {/* Informations utilisateur */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User size={14} className="text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {request.utilisateurNom}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Utilisateur</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Mail size={14} className="text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white truncate">
                          {request.utilisateurEmail}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                      </div>
                    </div>
                  </div>

                  {/* Informations livre */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Book size={14} className="text-gray-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {request.livreTitre}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Livre demandé</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Calendar size={14} className="text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {formatDate(request.dateDemande)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Date de demande</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions - Boutons plus petits */}
                <div className="flex space-x-2 mt-3">
                  {request.statut.toUpperCase() === "EN_ATTENTE" && (
                    <>
                      <button
                        onClick={() => handleAccept(request.id)}
                        disabled={loadingAction === request.id}
                        className="flex items-center justify-center space-x-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-2 py-1 rounded text-xs font-medium transition-colors min-w-[80px]"
                      >
                        {loadingAction === request.id ? (
                          <Loader size={12} className="animate-spin" />
                        ) : (
                          <CheckCircle size={12} />
                        )}
                        <span>Accepter</span>
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        disabled={loadingAction === request.id}
                        className="flex items-center justify-center space-x-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-2 py-1 rounded text-xs font-medium transition-colors min-w-[80px]"
                      >
                        {loadingAction === request.id ? (
                          <Loader size={12} className="animate-spin" />
                        ) : (
                          <XCircle size={12} />
                        )}
                        <span>Refuser</span>
                      </button>
                    </>
                  )}
                  {(request.statut.toUpperCase() === "ACCEPTÉ" || request.statut.toUpperCase() === "APPROVED") && (
                    <button className="flex items-center justify-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors">
                      <Book size={12} />
                      <span>Détails</span>
                    </button>
                  )}
                  {(request.statut.toUpperCase() === "REFUSÉ" || request.statut.toUpperCase() === "REJECTED") && (
                    <button className="flex items-center justify-center space-x-1 bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors">
                      <XCircle size={12} />
                      <span>Refusée</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}