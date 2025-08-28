"use client";

import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";

type User = {
  id: number;
  name: string;
  email: string;
};

type Book = {
  id: number;
  title: string;
  author: string;
};

type LoanRequest = {
  id: number;
  user: User;
  book: Book;
  requestDate: string;
  status: "pending" | "en cours" | "rejected";
};

export default function RecentLoanRequests() {
  const [requests, setRequests] = useState<LoanRequest[]>([
    {
      id: 1,
      user: { id: 1, name: "Anta Fall", email: "anta@example.com" },
      book: { id: 1, title: "L'Alchimiste", author: "Paulo Coelho" },
      requestDate: "2025-08-15",
      status: "pending",
    },
    {
      id: 2,
      user: { id: 2, name: "Mouhamadou Ndiaye", email: "mouhamadou@example.com" },
      book: { id: 2, title: "1984", author: "George Orwell" },
      requestDate: "2025-08-14",
      status: "en cours",
    },
  ]);

  const handleAccept = (id: number) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "en cours" } : r))
    );
  };

  const handleReject = (id: number) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r))
    );
  };

  return (
    <ComponentCard title="Dernières demandes d’emprunt">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="border px-4 py-2 dark:border-gray-700">Livre</th>
              <th className="border px-4 py-2 dark:border-gray-700">Utilisateur</th>
              <th className="border px-4 py-2 dark:border-gray-700">Date de demande</th>
              <th className="border px-4 py-2 dark:border-gray-700">Statut</th>
              <th className="border px-4 py-2 dark:border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="border px-4 py-2 dark:border-gray-700">{req.book.title}</td>
                <td className="border px-4 py-2 dark:border-gray-700">{req.user.name}</td>
                <td className="border px-4 py-2 dark:border-gray-700">{req.requestDate}</td>
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
                  {req.status !== "pending" && <span>-</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ComponentCard>
  );
}
