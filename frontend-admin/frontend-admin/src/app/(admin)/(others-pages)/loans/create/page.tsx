"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

type LoanRequest = {
  id: number;
  utilisateurNom: string;
  livreTitre: string;
  auteurNom: string;
  cover?: string;
  dateDemande: string;
  statut: "EN_ATTENTE" | "VALIDE" | "REJETE" | "TERMINE";
};

type ToastProps = {
  message: string;
  onClose: () => void;
};

const Toast = ({ message, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // disparait après 3s
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
      <div className="fixed bottom-5 right-5 bg-red-600 text-white px-4 py-2 rounded shadow-lg animate-slide-in">
        {message}
      </div>
  );
};

export default function LoanRequests() {
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<LoanRequest | null>(null);

  // Modales
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [jours, setJours] = useState("14");
  const [motif, setMotif] = useState("");

  // Toast
  const [toastMessage, setToastMessage] = useState("");

  // 🔹 Charger les demandes en attente
  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/emprunts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Erreur lors du chargement des demandes");
      const data: LoanRequest[] = await res.json();
      setLoanRequests(data.filter((req) => req.statut === "EN_ATTENTE"));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // ✅ Accepter une demande
  const confirmAccept = async () => {
    if (!selectedRequest) return;
    try {
      const res = await fetch(
          `http://localhost:8080/api/emprunts/valider/${selectedRequest.id}?jours=${jours}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
      );

      if (!res.ok) throw new Error("Erreur lors de la validation");
      setShowAcceptModal(false);
      setSelectedRequest(null);
      setToastMessage(`Emprunt accepté pour ${selectedRequest.livreTitre}`);
      await fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  // ❌ Rejeter une demande
  const confirmReject = async () => {
    if (!selectedRequest) return;
    try {
      const res = await fetch(
          `http://localhost:8080/api/emprunts/rejeter/${selectedRequest.id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
      );

      if (!res.ok) throw new Error("Erreur lors du rejet");
      setShowRejectModal(false);
      setToastMessage(`Emprunt rejeté. Motif: ${motif}`);
      setMotif("");
      setSelectedRequest(null);
      await fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  return (
      <div className="dark:text-gray-100">
        <PageBreadcrumb pageTitle="Demandes d'emprunt" />

        <div className="space-y-6">
          <ComponentCard title="Liste des demandes en attente">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-700">
                <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border px-4 py-2 dark:border-gray-700">Utilisateur</th>
                  <th className="border px-4 py-2 dark:border-gray-700">Livre</th>
                  <th className="border px-4 py-2 dark:border-gray-700">Auteur</th>
                  <th className="border px-4 py-2 dark:border-gray-700">Date demande</th>
                  <th className="border px-4 py-2 dark:border-gray-700">Statut</th>
                  <th className="border px-4 py-2 dark:border-gray-700">Actions</th>
                </tr>
                </thead>
                <tbody>
                {loanRequests.length > 0 ? (
                    loanRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="border px-4 py-2 dark:border-gray-700">{req.utilisateurNom}</td>
                          <td className="border px-4 py-2 dark:border-gray-700">{req.livreTitre}</td>
                          <td className="border px-4 py-2 dark:border-gray-700">{req.auteurNom}</td>
                          <td className="border px-4 py-2 dark:border-gray-700">{req.dateDemande}</td>
                          <td className="border px-4 py-2 dark:border-gray-700">
                        <span className="px-2 py-1 rounded text-white bg-blue-500">
                          {req.statut}
                        </span>
                          </td>
                          <td className="border px-4 py-2 flex gap-2 dark:border-gray-700">
                            <button
                                onClick={() => setSelectedRequest(req)}
                                className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                            >
                              Détails
                            </button>
                            <button
                                onClick={() => {
                                  setSelectedRequest(req);
                                  setShowAcceptModal(true);
                                }}
                                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                            >
                              Accepter
                            </button>
                            <button
                                onClick={() => {
                                  setSelectedRequest(req);
                                  setShowRejectModal(true);
                                }}
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                            >
                              Refuser
                            </button>
                          </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-gray-500">
                        Aucune demande en attente.
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          </ComponentCard>
        </div>

        {/* ✅ Modal acceptation */}
        {showAcceptModal && selectedRequest && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-900 dark:text-gray-100 p-6 rounded-xl w-[420px] relative shadow-2xl">
                <h2 className="text-xl font-bold mb-4 text-center">✅ Valider l'emprunt</h2>
                <p className="mb-4">
                  Pour le livre <b>{selectedRequest.livreTitre}</b> par{" "}
                  <b>{selectedRequest.auteurNom}</b>
                </p>
                <label className="block mb-2">Nombre de jours :</label>
                <input
                    type="number"
                    value={jours}
                    onChange={(e) => setJours(e.target.value)}
                    className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:border-gray-700"
                />
                <div className="flex justify-end gap-3 mt-4">
                  <button
                      onClick={() => setShowAcceptModal(false)}
                      className="px-4 py-2 bg-gray-400 rounded text-white hover:bg-gray-500"
                  >
                    Annuler
                  </button>
                  <button
                      onClick={confirmAccept}
                      className="px-4 py-2 bg-green-600 rounded text-white hover:bg-green-700"
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* ❌ Modal rejet */}
        {showRejectModal && selectedRequest && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-900 dark:text-gray-100 p-6 rounded-xl w-[420px] relative shadow-2xl">
                <h2 className="text-xl font-bold mb-4 text-center">❌ Rejeter la demande</h2>
                <p className="mb-2">Motif du rejet :</p>
                <textarea
                    value={motif}
                    onChange={(e) => setMotif(e.target.value)}
                    className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:border-gray-700 mb-4"
                    placeholder="Indiquez le motif ici..."
                />
                <div className="flex justify-end gap-3">
                  <button
                      onClick={() => setShowRejectModal(false)}
                      className="px-4 py-2 bg-gray-400 rounded text-white hover:bg-gray-500"
                  >
                    Annuler
                  </button>
                  <button
                      onClick={confirmReject}
                      className="px-4 py-2 bg-red-600 rounded text-white hover:bg-red-700"
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* 🔔 Toast */}
        {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage("")} />}
      </div>
  );
}
