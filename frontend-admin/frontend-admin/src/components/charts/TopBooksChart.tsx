"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-bold text-gray-900 dark:text-white">{data.titre || data.title}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{data.auteur || data.author}</p>
        <p className="text-blue-600 font-semibold mt-1">
          {data.nombreEmprunts || data.count} emprunts
        </p>
      </div>
    );
  }
  return null;
};

// Fonction pour formater les données du backend
const formatTopBooksData = (backendData) => {
  if (!backendData || !Array.isArray(backendData)) return [];

  return backendData.map((item, index) => ({
    title: item.titre || item.title || `Livre ${index + 1}`,
    author: item.auteur || item.author || 'Auteur inconnu',
    count: item.nombreEmprunts || item.count || 0,
    trend: item.tendance || 0 // Optionnel
  }));
};

export function TopBooksChart({ data }) {
  const [timeRange, setTimeRange] = useState<"month" | "year">("year");
  const [sortBy, setSortBy] = useState<"count" | "trend">("count");

  // Formater les données du backend
  const formattedData = formatTopBooksData(data);

  if (!data || formattedData.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <p>Aucune donnée disponible</p>
          <p className="text-sm">Les livres populaires seront affichés ici</p>
        </div>
      </div>
    );
  }

  const sortedData = [...formattedData].sort((a, b) => b.count - a.count);

  return (
    <div className="w-full">
      {/* En-tête avec contrôles */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-2 sm:space-y-0">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Livres les Plus Populaires
        </h3>

        <div className="flex space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 px-3 py-1 text-sm"
          >
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
          </select>
        </div>
      </div>

      {/* Graphique */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} horizontal={false} />
          <XAxis
            type="number"
            stroke="#6B7280"
            fontSize={12}
          />
          <YAxis
            type="category"
            dataKey="title"
            stroke="#6B7280"
            fontSize={12}
            width={90}
            tick={{ fill: '#6B7280' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="count"
            radius={[0, 4, 4, 0]}
          >
            {sortedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`}
                fill={index < 3 ? 
                  (index === 0 ? "#3B82F6" : index === 1 ? "#10B981" : "#F59E0B") : 
                  "#6B7280"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Légende des tops */}
      <div className="flex justify-center space-x-4 mt-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">1er</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">2ème</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">3ème</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-gray-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Autres</span>
        </div>
      </div>
    </div>
  );
}