"use client";

import React from "react";
import { Book, User, LoanRequest } from "@/types"; // Si tu as des types définis
import { BookOpen, User2, ClipboardCheck, Inbox } from "lucide-react"; // Icônes

type LibraryMetricsProps = {
  booksCount: number;
  authorsCount: number;
  loansInProgress: number;
  pendingRequests: number;
};

export default function LibraryMetrics({
  booksCount,
  authorsCount,
  loansInProgress,
  pendingRequests,
}: LibraryMetricsProps) {
  const metrics = [
    { title: "Livres", count: booksCount, icon: BookOpen, color: "bg-blue-500" },
    { title: "Auteurs", count: authorsCount, icon: User2, color: "bg-green-500" },
    { title: "Emprunts en cours", count: loansInProgress, icon: ClipboardCheck, color: "bg-yellow-500" },
    { title: "Demandes en attente", count: pendingRequests, icon: Inbox, color: "bg-red-500" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.title}
            className={`flex items-center p-4 rounded-2xl border bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm`}
          >
            <div className={`p-3 rounded-full ${metric.color} text-white mr-4`}>
              <Icon size={24} />
            </div>
            <div>
              <p className="text-lg font-semibold">{metric.count}</p>
              <p className="text-sm text-gray-500 dark:text-gray-300">{metric.title}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
