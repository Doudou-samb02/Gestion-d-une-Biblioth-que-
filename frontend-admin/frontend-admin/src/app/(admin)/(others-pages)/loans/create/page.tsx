"use client";

import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Image from "next/image";

type User = {
  id: number;
  name: string;
  email: string;
};

type Book = {
  id: number;
  title: string;
  author: string;
  cover: string;
  genre?: string;
  publishedDate?: string;
};

type LoanRequest = {
  id: number;
  user: User;
  book: Book;
  requestDate: string;
  status: "pending" | "en cours" | "rejected";
};

export default function LoanRequests() {
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([
    {
      id: 1,
      user: { id: 1, name: "Anta Fall", email: "anta@example.com" },
      book: {
        id: 1,
        title: "L'Alchimiste",
        author: "Paulo Coelho",
        cover: "/covers/alchimiste.jpg",
        genre: "Roman",
        publishedDate: "1988-01-01",
      },
      requestDate: "2025-08-10",
      status: "pending",
    },
  ]);

  const [selectedRequest, setSelectedRequest] = useState<LoanRequest | null>(null);

  const handleAccept = (requestId: number) => {
    setLoanRequests((prev) =>
      prev.map((r) =>
        r.id === requestId ? { ...r, status: "en cours" } : r
      )
    );
  };

  const handleReject = (requestId: number) => {
    setLoanRequests((prev) =>
      prev.map((r) =>
        r.id === requestId ? { ...r, status: "rejected" } : r
      )
    );
  };

  return (
    <div className="dark:text-gray-100">
      <PageBreadcrumb pageTitle="Demandes d'emprunt" />

      <div className="space-y-6">
        <ComponentCard title="Liste des demandes">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border px-4 py-2 dark:border-gray-700">Utilisateur</th>
                  <th className="border px-4 py-2 dark:border-gray-700">Email</th>
                  <th className="border px-4 py-2 dark:border-gray-700">Livre</th>
                  <th className="border px-4 py-2 dark:border-gray-700">Statut</th>
                  <th className="border px-4 py-2 dark:border-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loanRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="border px-4 py-2 dark:border-gray-700">{req.user.name}</td>
                    <td className="border px-4 py-2 dark:border-gray-700">{req.user.email}</td>
                    <td className="border px-4 py-2 dark:border-gray-700">{req.book.title}</td>
                    <td className="border px-4 py-2 dark:border-gray-700">
                      <span
                        className={`px-2 py-1 rounded text-white ${
                          req.status === "pending"
                            ? "bg-blue-500"
                            : req.status === "en cours"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="border px-4 py-2 flex gap-2 dark:border-gray-700">
                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                      >
                        Détails
                      </button>
                      {req.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleAccept(req.id)}
                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                          >
                            Accepter
                          </button>
                          <button
                            onClick={() => handleReject(req.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                          >
                            Refuser
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ComponentCard>
      </div>

      {/* Modal amélioré */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 dark:text-gray-100 p-6 rounded-xl w-[420px] relative shadow-2xl">
            {/* Bouton fermer */}
            <button
              onClick={() => setSelectedRequest(null)}
              className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-lg"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4 text-center">📖 Détails de la demande</h2>

            {/* Section Livre */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2 border-b pb-1">Livre</h3>
              <div className="flex gap-4 items-start">
                <Image
                  src={selectedRequest.book.cover}
                  alt={selectedRequest.book.title}
                  width={90}
                  height={130}
                  className="rounded shadow"
                />
                <div>
                  <p><span className="font-medium">Titre :</span> {selectedRequest.book.title}</p>
                  <p><span className="font-medium">Auteur :</span> {selectedRequest.book.author}</p>
                  {selectedRequest.book.genre && (
                    <p><span className="font-medium">Genre :</span> {selectedRequest.book.genre}</p>
                  )}
                  {selectedRequest.book.publishedDate && (
                    <p><span className="font-medium">Publication :</span> {selectedRequest.book.publishedDate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section Utilisateur */}
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-2 border-b pb-1">Utilisateur</h3>
              <p><span className="font-medium">Nom :</span> {selectedRequest.user.name}</p>
              <p><span className="font-medium">Email :</span> {selectedRequest.user.email}</p>
            </div>

            {/* Statut */}
            <div className="text-center mt-4">
              <span
                className={`px-3 py-1 rounded text-white text-sm ${
                  selectedRequest.status === "pending"
                    ? "bg-blue-500"
                    : selectedRequest.status === "en cours"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                {selectedRequest.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
