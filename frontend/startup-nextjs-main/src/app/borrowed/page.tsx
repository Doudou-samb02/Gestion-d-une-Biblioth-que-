"use client";

import { useEffect, useState } from "react";
import { BookOpen, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface EmpruntDTO {
  id: number;
  livreId: number;
  livreTitre: string;
  livreAuteur: string;
  utilisateurId: number;
  utilisateurNom: string;
  statut: string;
  rendu: boolean;
  dateDemande: string;
  dateEmprunt: string;
  dateLimiteRetour: string;
  dateRetour: string;
}

export default function BorrowedPage() {
  const [emprunts, setEmprunts] = useState<EmpruntDTO[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmprunts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/emprunts/mes-emprunts", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          credentials: "include",
        });

        if (res.ok) {
          const data: EmpruntDTO[] = await res.json();
          setEmprunts(data);
        } else {
          console.error("Erreur récupération emprunts:", res.status);
        }
      } catch (err) {
        console.error("Erreur réseau:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmprunts();
  }, []);

  const filteredEmprunts = emprunts
    .filter((emprunt) =>
      emprunt.livreTitre?.toLowerCase().includes(search.toLowerCase()) ||
      emprunt.livreAuteur?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((emprunt) => {
      switch (statusFilter) {
        case "all": return true;
        case "active": return emprunt.statut === "VALIDE" && !emprunt.rendu;
        case "pending": return emprunt.statut === "EN_ATTENTE";
        case "late":
          return emprunt.statut === "VALIDE" &&
                 !emprunt.rendu &&
                 emprunt.dateLimiteRetour &&
                 new Date(emprunt.dateLimiteRetour) < new Date();
        case "returned": return emprunt.rendu;
        default: return emprunt.statut === statusFilter;
      }
    });

  const getStatusIcon = (emprunt: EmpruntDTO) => {
    if (emprunt.rendu)
      return <CheckCircle className="text-green-500" size={20} />;
    if (emprunt.statut === "EN_ATTENTE")
      return <Clock className="text-yellow-500" size={20} />;
    if (emprunt.statut === "VALIDE" &&
        emprunt.dateLimiteRetour &&
        new Date(emprunt.dateLimiteRetour) < new Date())
      return <XCircle className="text-red-500" size={20} />;
    if (emprunt.statut === "REJETE")
      return <AlertCircle className="text-gray-500" size={20} />;
    return <BookOpen className="text-blue-500" size={20} />;
  };

  const getStatusText = (emprunt: EmpruntDTO) => {
    if (emprunt.rendu) return "Rendu";
    if (emprunt.statut === "EN_ATTENTE") return "En attente de validation";
    if (emprunt.statut === "VALIDE" &&
        emprunt.dateLimiteRetour &&
        new Date(emprunt.dateLimiteRetour) < new Date())
      return "En retard";
    if (emprunt.statut === "VALIDE") return "En cours";
    if (emprunt.statut === "REJETE") return "Rejeté";
    if (emprunt.statut === "TERMINE") return "Terminé";
    return emprunt.statut;
  };

  const getStatusColor = (emprunt: EmpruntDTO) => {
    if (emprunt.rendu) return "text-green-600 bg-green-50 border-green-200";
    if (emprunt.statut === "EN_ATTENTE") return "text-yellow-600 bg-yellow-50 border-yellow-200";
    if (emprunt.statut === "VALIDE" && emprunt.dateLimiteRetour && new Date(emprunt.dateLimiteRetour) < new Date())
      return "text-red-600 bg-red-50 border-red-200";
    if (emprunt.statut === "VALIDE") return "text-blue-600 bg-blue-50 border-blue-200";
    if (emprunt.statut === "REJETE") return "text-gray-600 bg-gray-50 border-gray-200";
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Mes Emprunts
      </h1>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{emprunts.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">
            {emprunts.filter(e => e.statut === "EN_ATTENTE").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">En attente</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">
            {emprunts.filter(e => e.statut === "VALIDE" && !e.rendu).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Actifs</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">
            {emprunts.filter(e => e.rendu).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Rendus</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Rechercher par titre ou auteur..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Emprunts actifs</option>
          <option value="pending">En attente</option>
          <option value="late">En retard</option>
          <option value="returned">Rendus</option>
        </select>
      </div>

      {/* Liste des emprunts */}
      <div className="space-y-4">
        {filteredEmprunts.map((emprunt) => (
          <div
            key={emprunt.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Informations du livre */}
              <div className="flex items-start gap-4 flex-1">
                <div className="w-16 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen size={24} className="text-gray-400" />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {emprunt.livreTitre || "Titre inconnu"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    par {emprunt.livreAuteur || "Auteur inconnu"}
                  </p>

                  {/* Informations spécifiques au statut */}
                  <div className="space-y-2">
                    {/* Statut EN_ATTENTE - Affichage spécifique */}
                    {emprunt.statut === "EN_ATTENTE" && (
                      <>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>Demandé le :</strong> {formatDate(emprunt.dateDemande)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>En attente de validation par l'administrateur</strong>
                        </p>
                      </>
                    )}

                    {/* Statut VALIDE - Affichage complet */}
                    {emprunt.statut === "VALIDE" && !emprunt.rendu && (
                      <>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>Emprunté le :</strong> {formatDate(emprunt.dateEmprunt)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>À rendre avant le :</strong> {formatDate(emprunt.dateLimiteRetour)}
                        </p>
                        {emprunt.dateLimiteRetour && new Date(emprunt.dateLimiteRetour) < new Date() && (
                          <p className="text-sm text-red-600 font-medium">
                            ⚠ Retard : {Math.ceil((new Date().getTime() - new Date(emprunt.dateLimiteRetour).getTime()) / (1000 * 3600 * 24))} jour(s) de retard
                          </p>
                        )}
                      </>
                    )}

                    {/* Livre rendu */}
                    {emprunt.rendu && (
                      <>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>Emprunté le :</strong> {formatDate(emprunt.dateEmprunt)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>Rendu le :</strong> {formatDate(emprunt.dateRetour)}
                        </p>
                      </>
                    )}

                    {/* Statut REJETE */}
                    {emprunt.statut === "REJETE" && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Demande rejetée le :</strong> {formatDate(emprunt.dateDemande)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Badge de statut */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-full border ${getStatusColor(emprunt)}`}>
                {getStatusIcon(emprunt)}
                <span className="text-sm font-medium">{getStatusText(emprunt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEmprunts.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {emprunts.length === 0
              ? "Vous n'avez aucun emprunt pour le moment."
              : "Aucun emprunt ne correspond aux critères de recherche."}
          </p>
          {emprunts.length === 0 && (
            <p className="text-gray-400 dark:text-gray-500 mt-2">
              Parcourez notre catalogue pour trouver des livres à emprunter.
            </p>
          )}
        </div>
      )}
    </div>
  );
}