"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 dark:text-white">{label}</p>
        <p className="text-blue-600">
          Emprunts: <span className="font-bold">{payload[0].value}</span>
        </p>
        {payload[1] && (
          <p className="text-green-600">
            Objectif: <span className="font-bold">{payload[1].value}</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

// Fonction pour formater les données du backend
const formatMonthlyData = (backendData) => {
  if (!backendData || !Array.isArray(backendData)) return [];

  return backendData.map(item => ({
    month: item.mois || item.month || 'Mois',
    loans: item.nombreEmprunts || item.count || item.loans || 0,
    objectifs: item.objectif || 0 // Optionnel: si vous avez des objectifs
  }));
};

export function MonthlyLoansChart({ data }) {
  const [timeRange, setTimeRange] = useState<"6m" | "1y">("1y");

  // Formater les données du backend
  const formattedData = formatMonthlyData(data);

  // Si pas de données, afficher un message
  if (!data || formattedData.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <p>Aucune donnée disponible</p>
          <p className="text-sm">Les statistiques mensuelles seront affichées ici</p>
        </div>
      </div>
    );
  }

  const filteredData = timeRange === "6m" ? formattedData.slice(-6) : formattedData;

  return (
    <div className="w-full">
      {/* En-tête avec filtre */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Évolution des Emprunts
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange("6m")}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              timeRange === "6m"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            6 mois
          </button>
          <button
            onClick={() => setTimeRange("1y")}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              timeRange === "1y"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            12 mois
          </button>
        </div>
      </div>

      {/* Graphique */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis
            dataKey="month"
            stroke="#6B7280"
            fontSize={12}
          />
          <YAxis
            stroke="#6B7280"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="objectifs"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.1}
            strokeWidth={2}
            name="Objectifs"
          />
          <Line
            type="monotone"
            dataKey="loans"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "#1D4ED8" }}
            name="Emprunts réels"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}