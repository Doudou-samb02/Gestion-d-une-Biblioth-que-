"use client";

import React, { useState } from "react";
import { Search, User, Book, Calendar, CheckCircle, Clock, ArrowRight, Loader, Eye, X, Plus, Minus } from "lucide-react";

interface RecentLoan {
  id: number;
  utilisateur?: {
    id: number;
    nom?: string;
    prenom?: string;
    nomComplet?: string;
    email?: string;
  };
  utilisateurNom?: string;
  utilisateurId?: number;
  utilisateurEmail?: string;
  livre?: {
    id: number;
    titre?: string;
    auteur?: string;
    isbn?: string;
    categorie?: string;
  };
  livreTitre?: string;
  livreId?: number;
  dateEmprunt: string;
  dateRetourPrevue?: string;
  dateRetour?: string;
  statut: string;
}

interface RecentLoansProps {
  data?: RecentLoan[] | null;
  onUpdate?: () => void;
}

export default function RecentLoans({ data, onUpdate }: RecentLoansProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingAction, setLoadingAction] = useState<number | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<RecentLoan | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extendDays, setExtendDays] = useState(7);
  const [currentExtendLoan, setCurrentExtendLoan] = useState<RecentLoan | null>(null);

  // Utiliser les données fournies ou un tableau vide par défaut
  const loans: RecentLoan[] = data || [];

  // Fonctions de sécurité pour accéder aux propriétés imbriquées
  const getUtilisateurNom = (loan: RecentLoan): string => {
    if (loan.utilisateurNom) return loan.utilisateurNom;
    if (loan.utilisateur?.nomComplet) return loan.utilisateur.nomComplet;
    if (loan.utilisateur?.prenom && loan.utilisateur?.nom) {
      return `${loan.utilisateur.prenom} ${loan.utilisateur.nom}`;
    }
    return "Utilisateur inconnu";
  };

  const getUtilisateurEmail = (loan: RecentLoan): string => {
    return loan.utilisateurEmail || loan.utilisateur?.email || "Email non disponible";
  };

  const getLivreTitre = (loan: RecentLoan): string => {
    if (loan.livreTitre) return loan.livreTitre;
    if (loan.livre?.titre) return loan.livre.titre;
    return "Titre inconnu";
  };

  const getAuteurNom = (loan: RecentLoan): string => {
    return loan.livre?.auteur || "Auteur inconnu";
  };

  const getCategorie = (loan: RecentLoan): string => {
    return loan.livre?.categorie || "Non spécifié";
  };

  const getISBN = (loan: RecentLoan): string => {
    return loan.livre?.isbn || "Non disponible";
  };

  const getUtilisateurId = (loan: RecentLoan): number => {
    return loan.utilisateurId || loan.utilisateur?.id || loan.id;
  };

  const getLivreId = (loan: RecentLoan): number => {
    return loan.livreId || loan.livre?.id || loan.id;
  };

  // Filtrer les emprunts
  const filteredLoans = loans.filter(loan => {
    const utilisateurNom = getUtilisateurNom(loan).toLowerCase();
    const livreTitre = getLivreTitre(loan).toLowerCase();
    const auteurNom = getAuteurNom(loan).toLowerCase();

    const matchesSearch =
      utilisateurNom.includes(searchTerm.toLowerCase()) ||
      livreTitre.includes(searchTerm.toLowerCase()) ||
      auteurNom.includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const getStatusIcon = (statut: string) => {
    switch (statut.toUpperCase()) {
      case "RENDU":
      case "RETURNED":
      case "TERMINE":
        return <CheckCircle size={16} className="text-green-500" />;
      case "EN_COURS":
      case "IN_PROGRESS":
      case "VALIDE":
        return <Clock size={16} className="text-blue-500" />;
      case "EN_RETARD":
      case "LATE":
        return <Clock size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut.toUpperCase()) {
      case "RENDU":
      case "RETURNED":
      case "TERMINE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "EN_COURS":
      case "IN_PROGRESS":
      case "VALIDE":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "EN_RETARD":
      case "LATE":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusDisplay = (statut: string): string => {
    switch (statut.toUpperCase()) {
      case "RENDU":
      case "RETURNED":
      case "TERMINE":
        return "Rendu";
      case "EN_COURS":
      case "IN_PROGRESS":
      case "VALIDE":
        return "En cours";
      case "EN_RETARD":
      case "LATE":
        return "En retard";
      default:
        return statut;
    }
  };

  const isLate = (dateRetourPrevue: string): boolean => {
    if (!dateRetourPrevue) return false;
    try {
      return new Date(dateRetourPrevue) < new Date();
    } catch {
      return false;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Non spécifié";
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return "Date invalide";
    }
  };

  const calculateDaysLate = (dateRetourPrevue: string): number => {
    if (!dateRetourPrevue) return 0;
    try {
      const retourPrevu = new Date(dateRetourPrevue);
      const aujourdhui = new Date();
      const diffTime = aujourdhui.getTime() - retourPrevu.getTime();
      return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    } catch {
      return 0;
    }
  };

  const calculateDaysRemaining = (dateRetourPrevue: string): number => {
    if (!dateRetourPrevue) return 0;
    try {
      const retourPrevu = new Date(dateRetourPrevue);
      const aujourdhui = new Date();
      const diffTime = retourPrevu.getTime() - aujourdhui.getTime();
      return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    } catch {
      return 0;
    }
  };

  // Fonction pour afficher les détails dans un modal
  const handleShowDetails = (loan: RecentLoan) => {
    setSelectedLoan(loan);
    setShowDetailsModal(true);
  };

  // Fonction pour ouvrir le modal de prolongation
  const handleOpenExtendModal = (loan: RecentLoan) => {
    setCurrentExtendLoan(loan);
    setExtendDays(7); // Valeur par défaut
    setShowExtendModal(true);
  };

  // Fonction pour marquer un livre comme rendu
  const handleMarkAsReturned = async (loanId: number) => {
    setLoadingAction(loanId);
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/emprunts/rendre/${loanId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        if (onUpdate) onUpdate();
      } else {
        const errorText = await response.text();
        alert('Erreur: ' + errorText);
      }
    } catch (error) {
      alert('Erreur réseau lors du marquage comme rendu');
    } finally {
      setLoadingAction(null);
    }
  };

  // Fonction pour prolonger l'emprunt
  const handleExtendLoan = async () => {
    if (!currentExtendLoan) return;

    setLoadingAction(currentExtendLoan.id);
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/emprunts/${currentExtendLoan.id}/prolonger?jours=${extendDays}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setShowExtendModal(false);
        if (onUpdate) onUpdate();
      } else {
        const errorText = await response.text();
        alert('Erreur: ' + errorText);
      }
    } catch (error) {
      alert('Erreur réseau lors de la prolongation');
    } finally {
      setLoadingAction(null);
    }
  };

  // Modal de détails
  const DetailsModal = () => {
    if (!selectedLoan) return null;

    const isLoanLate = selectedLoan.dateRetourPrevue ? isLate(selectedLoan.dateRetourPrevue) : false;
    const daysLate = selectedLoan.dateRetourPrevue ? calculateDaysLate(selectedLoan.dateRetourPrevue) : 0;
    const daysRemaining = selectedLoan.dateRetourPrevue ? calculateDaysRemaining(selectedLoan.dateRetourPrevue) : 0;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Détails de l'emprunt #{selectedLoan.id}
            </h3>
            <button
              onClick={() => setShowDetailsModal(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Informations utilisateur */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <User size={18} className="mr-2" />
                Informations de l'emprunteur
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Nom complet</label>
                  <p className="font-medium">{getUtilisateurNom(selectedLoan)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Email</label>
                  <p className="font-medium">{getUtilisateurEmail(selectedLoan)}</p>
                </div>
              </div>
            </div>

            {/* Informations livre */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <Book size={18} className="mr-2" />
                Informations du livre
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Titre</label>
                  <p className="font-medium">{getLivreTitre(selectedLoan)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Auteur</label>
                  <p className="font-medium">{getAuteurNom(selectedLoan)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Catégorie</label>
                  <p className="font-medium">{getCategorie(selectedLoan)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">ISBN</label>
                  <p className="font-medium">{getISBN(selectedLoan)}</p>
                </div>
              </div>
            </div>

            {/* Dates et statut */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <Calendar size={18} className="mr-2" />
                Dates et statut
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Date d'emprunt</label>
                  <p className="font-medium">{formatDate(selectedLoan.dateEmprunt)}</p>
                </div>
                {selectedLoan.dateRetourPrevue && (
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Date de retour prévue</label>
                    <p className={`font-medium ${isLoanLate ? 'text-red-600' : 'text-green-600'}`}>
                      {formatDate(selectedLoan.dateRetourPrevue)}
                      {isLoanLate && ` (${daysLate} jours de retard)`}
                      {!isLoanLate && daysRemaining > 0 && ` (${daysRemaining} jours restants)`}
                    </p>
                  </div>
                )}
                {selectedLoan.dateRetour && (
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Date de retour effectif</label>
                    <p className="font-medium text-green-600">{formatDate(selectedLoan.dateRetour)}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Statut</label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedLoan.statut)}`}>
                    {getStatusDisplay(selectedLoan.statut)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowDetailsModal(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Modal de prolongation
  const ExtendModal = () => {
    if (!currentExtendLoan) return null;

    const calculateNewDate = () => {
      if (!currentExtendLoan.dateRetourPrevue) return "Date non disponible";
      try {
        const currentDate = new Date(currentExtendLoan.dateRetourPrevue);
        const newDate = new Date(currentDate.setDate(currentDate.getDate() + extendDays));
        return formatDate(newDate.toISOString());
      } catch {
        return "Date invalide";
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Prolonger l'emprunt
            </h3>
            <button
              onClick={() => setShowExtendModal(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Combien de jours supplémentaires souhaitez-vous ajouter à l'emprunt de <strong>{getLivreTitre(currentExtendLoan)}</strong> par <strong>{getUtilisateurNom(currentExtendLoan)}</strong> ?
            </p>

            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setExtendDays(Math.max(1, extendDays - 1))}
                disabled={extendDays <= 1}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <Minus size={20} />
              </button>

              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{extendDays}</div>
                <div className="text-sm text-gray-500">jours</div>
              </div>

              <button
                onClick={() => setExtendDays(Math.min(30, extendDays + 1))}
                disabled={extendDays >= 30}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="text-center text-sm text-gray-500">
              Limite: 1 à 30 jours maximum
            </div>

            {currentExtendLoan.dateRetourPrevue && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Nouvelle date de retour:</strong><br />
                  {calculateNewDate()}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowExtendModal(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleExtendLoan}
              disabled={loadingAction === currentExtendLoan.id}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {loadingAction === currentExtendLoan.id && <Loader size={16} className="animate-spin" />}
              <span>Confirmer la prolongation</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        {/* En-tête */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Emprunts Récents
            </h3>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
              {loans.length} emprunts
            </span>
          </div>

          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher par utilisateur, livre ou auteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Liste des emprunts */}
        <div className="max-h-96 overflow-y-auto">
          {filteredLoans.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <Book size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Aucun emprunt trouvé</p>
              {loans.length === 0 ? (
                <p className="text-sm mt-2">Aucun emprunt récent</p>
              ) : (
                <p className="text-sm mt-2">Aucun emprunt ne correspond aux critères de recherche</p>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLoans.map((loan) => {
                const isLoanLate = loan.dateRetourPrevue ? isLate(loan.dateRetourPrevue) : false;
                const daysLate = loan.dateRetourPrevue ? calculateDaysLate(loan.dateRetourPrevue) : 0;

                return (
                  <div key={loan.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(loan.statut)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.statut)}`}>
                          {getStatusDisplay(loan.statut)}
                        </span>
                        {isLoanLate && (loan.statut.toUpperCase() === "EN_COURS" || loan.statut.toUpperCase() === "VALIDE") && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            Retard: {daysLate}j
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        #{loan.id.toString().padStart(4, '0')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
                      {/* Informations utilisateur */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <User size={14} className="text-gray-400 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {getUtilisateurNom(loan)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Emprunteur</p>
                          </div>
                        </div>
                      </div>

                      {/* Informations livre */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Book size={14} className="text-gray-400 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {getLivreTitre(loan)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {getAuteurNom(loan)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar size={12} />
                        <span>Emprunt: {formatDate(loan.dateEmprunt)}</span>
                      </div>

                      {loan.dateRetourPrevue && (
                        <div className="flex items-center space-x-1">
                          <ArrowRight size={12} />
                          <span className={isLoanLate ? "text-red-600 font-medium" : "text-green-600"}>
                            Retour: {formatDate(loan.dateRetourPrevue)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleShowDetails(loan)}
                        className="flex items-center justify-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                      >
                        <Eye size={14} />
                        <span>Détails</span>
                      </button>

                      {(loan.statut.toUpperCase() === "EN_COURS" || loan.statut.toUpperCase() === "VALIDE") && (
                        <>
                          <button
                            onClick={() => handleMarkAsReturned(loan.id)}
                            disabled={loadingAction === loan.id}
                            className="flex items-center justify-center space-x-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                          >
                            {loadingAction === loan.id ? (
                              <Loader size={14} className="animate-spin" />
                            ) : (
                              <CheckCircle size={14} />
                            )}
                            <span>Marquer rendu</span>
                          </button>

                          {!isLoanLate && (
                            <button
                              onClick={() => handleOpenExtendModal(loan)}
                              className="flex items-center justify-center space-x-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                            >
                              <Calendar size={14} />
                              <span>Prolonger</span>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showDetailsModal && <DetailsModal />}
      {showExtendModal && <ExtendModal />}
    </>
  );
}