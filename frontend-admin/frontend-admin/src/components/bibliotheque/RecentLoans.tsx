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

type Loan = {
  id: number;
  user: User;
  book: Book;
  loanDate: string;
};

export default function RecentLoans() {
  const [loans] = useState<Loan[]>([
    {
      id: 1,
      user: { id: 1, name: "Anta Fall", email: "anta@example.com" },
      book: { id: 1, title: "L'Alchimiste", author: "Paulo Coelho" },
      loanDate: "2025-08-15",
    },
    {
      id: 2,
      user: { id: 2, name: "Mouhamadou Ndiaye", email: "mouhamadou@example.com" },
      book: { id: 2, title: "1984", author: "George Orwell" },
      loanDate: "2025-08-14",
    },
  ]);

  return (
    <ComponentCard title="Derniers emprunts validés">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="border px-4 py-2 dark:border-gray-700">Livre</th>
              <th className="border px-4 py-2 dark:border-gray-700">Utilisateur</th>
              <th className="border px-4 py-2 dark:border-gray-700">Date d’emprunt</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="border px-4 py-2 dark:border-gray-700">{loan.book.title}</td>
                <td className="border px-4 py-2 dark:border-gray-700">{loan.user.name}</td>
                <td className="border px-4 py-2 dark:border-gray-700">{loan.loanDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ComponentCard>
  );
}
