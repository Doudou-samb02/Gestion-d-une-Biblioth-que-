"use client";

import React from "react";
import { BookOpen, User2, ClipboardCheck, Inbox, TrendingUp, TrendingDown } from "lucide-react";

type LibraryMetricsProps = {
  booksCount: number;
  authorsCount: number;
  loansInProgress: number;
  pendingRequests: number;
};

type Metric = {
  title: string;
  count: number;
  icon: React.ElementType;
  color: string;
  trend?: number;
  description: string;
};

export default function LibraryMetrics({
  booksCount,
  authorsCount,
  loansInProgress,
  pendingRequests,
}: LibraryMetricsProps) {
  const metrics: Metric[] = [
    {
      title: "Livres",
      count: booksCount,
      icon: BookOpen,
      color: "bg-blue-500",
      trend: 12,
      description: "Total dans la bibliothèque"
    },
    {
      title: "Auteurs",
      count: authorsCount,
      icon: User2,
      color: "bg-green-500",
      trend: 5,
      description: "Auteurs référencés"
    },
    {
      title: "Emprunts en cours",
      count: loansInProgress,
      icon: ClipboardCheck,
      color: "bg-yellow-500",
      trend: -3,
      description: "Emprunts actifs"
    },
    {
      title: "Demandes en attente",
      count: pendingRequests,
      icon: Inbox,
      color: "bg-red-500",
      trend: 2,
      description: "En attente de validation"
    },
  ];

  const TrendIndicator = ({ trend }: { trend: number }) => {
    const isPositive = trend > 0;
    const TrendIcon = isPositive ? TrendingUp : TrendingDown;

    return (
      <div className={`flex items-center text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        <TrendIcon size={14} className="mr-1" />
        <span>{Math.abs(trend)}%</span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.title}
            className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metric.count.toLocaleString()}
                </p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-1">
                  {metric.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {metric.description}
                </p>
              </div>

              <div className={`p-3 rounded-xl ${metric.color} text-white`}>
                <Icon size={24} />
              </div>
            </div>

            {metric.trend !== undefined && (
              <div className="mt-4">
                <TrendIndicator trend={metric.trend} />
              </div>
            )}

            {/* Effet de hover */}
            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-colors pointer-events-none" />
          </div>
        );
      })}
    </div>
  );
}