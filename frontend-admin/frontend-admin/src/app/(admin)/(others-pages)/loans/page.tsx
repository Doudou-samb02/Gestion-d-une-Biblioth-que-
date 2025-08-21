"use client";

import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

type Loan = {
  id: number;
  bookTitle: string;
  bookAuthor: string;
  userName: string;
  borrowDate: string;
  returnDate: string;
  status: "en cours" | "retourné" | "en retard";
};

export default function LoanManagement() {
  const [loans, setLoans] = useState<Loan[]>([
    {
      id: 1,
      bookTitle: "L'Alchimiste",
      bookAuthor: "Paulo Coelho",
      userName: "Anta Fall",
      borrowDate: "2025-08-01",
      returnDate: "2025-08-15",
      status: "en cours",
    },
    {
      id: 2,
      bookTitle: "1984",
      bookAuthor: "George Orwell",
      userName: "Mouhamadou Samb",
      borrowDate: "2025-07-20",
      returnDate: "2025-08-03",
      status: "en retard",
    },
  ]);

  const markReturned = (id: number) => {
    setLoans((prev) =>
      prev.map((loan) =>
        loan.id === id ? { ...loan, status: "retourné" } : loan
      )
    );
  };

  const extendLoan = (id: number) => {
    setLoans((prev) =>
      prev.map((loan) =>
        loan.id === id
          ? {
              ...loan,
              returnDate: new Date(
                new Date(loan.returnDate).getTime() + 7 * 24 * 60 * 60 * 1000
              )
                .toISOString()
                .split("T")[0],
            }
          : loan
      )
    );
  };

  const [filterStatus, setFilterStatus] = useState<
    "" | "en cours" | "retourné" | "en retard"
  >("");

  const filteredLoans = filterStatus
    ? loans.filter((l) => l.status === filterStatus)
    : loans;

  return (
    <div>
      <PageBreadcrumb pageTitle="Gestion des Emprunts" />

      <div className="space-y-6">
        <ComponentCard title="Tableau des Emprunts">
          <div className="flex justify-between mb-4">
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value as "" | "en cours" | "retourné" | "en retard"
                )
              }
              className="border p-2 rounded bg-white dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
            >
              <option value="">Tous les statuts</option>
              <option value="en cours">En cours</option>
              <option value="retourné">Retourné</option>
              <option value="en retard">En retard</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border px-4 py-2 text-left dark:border-gray-700 dark:text-gray-200">
                    Livre
                  </th>
                  <th className="border px-4 py-2 text-left dark:border-gray-700 dark:text-gray-200">
                    Auteur
                  </th>
                  <th className="border px-4 py-2 text-left dark:border-gray-700 dark:text-gray-200">
                    Utilisateur
                  </th>
                  <th className="border px-4 py-2 text-left dark:border-gray-700 dark:text-gray-200">
                    Date Emprunt
                  </th>
                  <th className="border px-4 py-2 text-left dark:border-gray-700 dark:text-gray-200">
                    Date Retour
                  </th>
                  <th className="border px-4 py-2 text-left dark:border-gray-700 dark:text-gray-200">
                    Statut
                  </th>
                  <th className="border px-4 py-2 text-left dark:border-gray-700 dark:text-gray-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLoans.map((loan) => (
                  <tr
                    key={loan.id}
                    className="bg-white dark:bg-gray-900 dark:text-gray-200"
                  >
                    <td className="border px-4 py-2 dark:border-gray-700">
                      {loan.bookTitle}
                    </td>
                    <td className="border px-4 py-2 dark:border-gray-700">
                      {loan.bookAuthor}
                    </td>
                    <td className="border px-4 py-2 dark:border-gray-700">
                      {loan.userName}
                    </td>
                    <td className="border px-4 py-2 dark:border-gray-700">
                      {loan.borrowDate}
                    </td>
                    <td className="border px-4 py-2 dark:border-gray-700">
                      {loan.returnDate}
                    </td>
                    <td className="border px-4 py-2 dark:border-gray-700">
                      <span
                        className={`px-2 py-1 rounded text-white ${
                          loan.status === "en cours"
                            ? "bg-blue-500"
                            : loan.status === "en retard"
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                      >
                        {loan.status}
                      </span>
                    </td>
                    <td className="border px-4 py-2 space-x-2 dark:border-gray-700">
                      {loan.status !== "retourné" && (
                        <>
                          <button
                            onClick={() => markReturned(loan.id)}
                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                          >
                            Retour
                          </button>
                          <button
                            onClick={() => extendLoan(loan.id)}
                            className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                          >
                            Prolonger
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
    </div>
  );
}
