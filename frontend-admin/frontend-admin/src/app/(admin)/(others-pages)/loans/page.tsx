"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Edit2, Trash2, ArrowRightCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

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
};

export default function LoanManagement() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filterStatus, setFilterStatus] = useState<"" | "VALIDE" | "REJETE" | "TERMINE">("");

  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [editDateLimite, setEditDateLimite] = useState("");
  const [editStatus, setEditStatus] = useState<"VALIDE" | "REJETE" | "TERMINE">("VALIDE");

  // Mapping pour TypeScript : EN_ATTENTE → VALIDE
  const mapStatutForEdit = (s: Statut): "VALIDE" | "REJETE" | "TERMINE" =>
      s === "EN_ATTENTE" ? "VALIDE" : s;

  const fetchLoans = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/emprunts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Erreur lors du chargement des emprunts");
      const data: Loan[] = await res.json();
      setLoans(data.filter((l) => l.statut !== "EN_ATTENTE"));
    } catch (err) {
      console.error(err);
      toast.error("Impossible de charger les emprunts");
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  // 🔹 Marquer un emprunt comme retourné
  const handleReturn = async (loanId: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/emprunts/rendre/${loanId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Erreur lors du retour");
      await fetchLoans();
      toast.success("Emprunt marqué comme retourné !");
      setShowReturnModal(false);
      setSelectedLoan(null);
    } catch (err) {
      console.error(err);
      toast.error("Impossible de marquer comme retourné");
    }
  };

  // 🔹 Supprimer un emprunt
  const handleDelete = async (loanId: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/emprunts/${loanId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      setLoans(loans.filter((l) => l.id !== loanId));
      toast.success("Emprunt supprimé !");
      setShowDeleteModal(false);
      setSelectedLoan(null);
    } catch (err) {
      console.error(err);
      toast.error("Impossible de supprimer l'emprunt");
    }
  };

  // 🔹 Modifier un emprunt
  const handleEdit = async () => {
    if (!selectedLoan) return;
    try {
      const res = await fetch(`http://localhost:8080/api/emprunts/${selectedLoan.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dateLimiteRetour: editDateLimite,
          statut: editStatus,
        }),
      });
      if (!res.ok) throw new Error("Erreur lors de la modification");
      await fetchLoans();
      toast.success("Emprunt modifié !");
      setShowEditModal(false);
      setSelectedLoan(null);
    } catch (err) {
      console.error(err);
      toast.error("Impossible de modifier l'emprunt");
    }
  };

  const filteredLoans = filterStatus ? loans.filter((l) => l.statut === filterStatus) : loans;

  return (
      <div>
        <Toaster position="top-right" />
        <PageBreadcrumb pageTitle="Gestion des Emprunts" />

        <div className="space-y-6">
          <ComponentCard title="Tableau des Emprunts">
            <div className="flex justify-between mb-4">
              <select
                  value={filterStatus}
                  onChange={(e) =>
                      setFilterStatus(e.target.value as "" | "VALIDE" | "REJETE" | "TERMINE")
                  }
                  className="border p-2 rounded bg-white dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
              >
                <option value="">Tous les statuts</option>
                <option value="VALIDE">En cours</option>
                <option value="REJETE">Rejeté</option>
                <option value="TERMINE">Retourné</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-700">
                <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border px-4 py-2 dark:border-gray-700">Livre</th>
                  <th className="border px-4 py-2 dark:border-gray-700">Auteur</th>
                  <th className="border px-4 py-2 dark:border-gray-700">Utilisateur</th>
                  <th className="border px-4 py-2 dark:border-gray-700">Date Emprunt</th>
                  <th className="border px-4 py-2 dark:border-gray-700">Date Limite Retour</th>
                  <th className="border px-4 py-2 dark:border-gray-700">Date Retour</th>
                  <th className="border px-4 py-2 dark:border-gray-700">Statut</th>
                  <th className="border px-4 py-2 dark:border-gray-700">Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredLoans.length > 0 ? (
                    filteredLoans.map((loan) => (
                        <tr key={loan.id} className="bg-white dark:bg-gray-900 dark:text-gray-200">
                          <td className="border px-4 py-2 dark:border-gray-700">{loan.livreTitre}</td>
                          <td className="border px-4 py-2 dark:border-gray-700">{loan.auteurNom}</td>
                          <td className="border px-4 py-2 dark:border-gray-700">{loan.utilisateurNom}</td>
                          <td className="border px-4 py-2 dark:border-gray-700">{loan.dateEmprunt}</td>
                          <td className="border px-4 py-2 dark:border-gray-700">{loan.dateLimiteRetour}</td>
                          <td className="border px-4 py-2 dark:border-gray-700">{loan.dateRetour ?? "-"}</td>
                          <td className="border px-4 py-2 dark:border-gray-700">
                        <span
                            className={`px-2 py-1 rounded text-white ${
                                loan.statut === "VALIDE"
                                    ? "bg-blue-500"
                                    : loan.statut === "REJETE"
                                        ? "bg-red-500"
                                        : "bg-green-500"
                            }`}
                        >
                          {loan.statut === "VALIDE"
                              ? "En cours"
                              : loan.statut === "REJETE"
                                  ? "Rejeté"
                                  : "Retourné"}
                        </span>
                          </td>
                          <td className="border px-4 py-2 flex gap-2 dark:border-gray-700">
                            {loan.statut === "VALIDE" && (
                                <button
                                    onClick={() => {
                                      setSelectedLoan(loan);
                                      setShowReturnModal(true);
                                    }}
                                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 flex items-center justify-center"
                                >
                                  <ArrowRightCircle size={16} />
                                </button>
                            )}
                            <button
                                onClick={() => {
                                  setSelectedLoan(loan);
                                  setEditDateLimite(loan.dateLimiteRetour);
                                  setEditStatus(mapStatutForEdit(loan.statut));
                                  setShowEditModal(true);
                                }}
                                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 flex items-center justify-center"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                                onClick={() => {
                                  setSelectedLoan(loan);
                                  setShowDeleteModal(true);
                                }}
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center justify-center"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                      <td colSpan={8} className="text-center py-4 text-gray-500">
                        Aucun emprunt.
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          </ComponentCard>
        </div>

        {/* Modal Retour */}
        {showReturnModal && selectedLoan && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-900 dark:text-gray-100 p-6 rounded-xl w-[400px] relative shadow-2xl">
                <h2 className="text-xl font-bold mb-4 text-center">Confirmer le retour</h2>
                <p className="mb-6 text-center">
                  Voulez-vous marquer le livre <b>{selectedLoan.livreTitre}</b> comme retourné ?
                </p>
                <div className="flex justify-center gap-3">
                  <button
                      onClick={() => setShowReturnModal(false)}
                      className="px-4 py-2 bg-gray-400 rounded text-white hover:bg-gray-500"
                  >
                    Annuler
                  </button>
                  <button
                      onClick={() => handleReturn(selectedLoan.id)}
                      className="px-4 py-2 bg-green-600 rounded text-white hover:bg-green-700"
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* Modal Supprimer */}
        {showDeleteModal && selectedLoan && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-900 dark:text-gray-100 p-6 rounded-xl w-[400px] relative shadow-2xl">
                <h2 className="text-xl font-bold mb-4 text-center">Supprimer l'emprunt</h2>
                <p className="mb-6 text-center">
                  Voulez-vous vraiment supprimer l'emprunt du livre <b>{selectedLoan.livreTitre}</b> ?
                </p>
                <div className="flex justify-center gap-3">
                  <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-4 py-2 bg-gray-400 rounded text-white hover:bg-gray-500"
                  >
                    Annuler
                  </button>
                  <button
                      onClick={() => handleDelete(selectedLoan.id)}
                      className="px-4 py-2 bg-red-600 rounded text-white hover:bg-red-700"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* Modal Modifier */}
        {showEditModal && selectedLoan && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-900 dark:text-gray-100 p-6 rounded-xl w-[400px] relative shadow-2xl">
                <h2 className="text-xl font-bold mb-4 text-center">Modifier l'emprunt</h2>
                <label className="block mb-2">Date Limite Retour :</label>
                <input
                    type="date"
                    value={editDateLimite}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setEditDateLimite(e.target.value)}
                    className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:border-gray-700 mb-4"
                />
                <label className="block mb-2">Statut :</label>
                <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as "VALIDE" | "REJETE" | "TERMINE")}
                    className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:border-gray-700 mb-4"
                >
                  <option value="VALIDE">En cours</option>
                  <option value="REJETE">Rejeté</option>
                  <option value="TERMINE">Retourné</option>
                </select>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 bg-gray-400 rounded text-white hover:bg-gray-500"
                  >
                    Annuler
                  </button>
                  <button
                      onClick={handleEdit}
                      className="px-4 py-2 bg-yellow-600 rounded text-white hover:bg-yellow-700"
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}
