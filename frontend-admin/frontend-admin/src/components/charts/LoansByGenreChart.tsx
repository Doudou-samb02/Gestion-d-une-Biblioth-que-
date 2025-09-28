"use client";

import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, Sector } from "recharts";

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="font-bold">
        {payload.genre}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 5}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="text-sm">
        {`${value} emprunts`}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" className="text-xs">
        {`(${(percent * 100).toFixed(0)}%)`}
      </text>
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 dark:text-white">{payload[0].name}</p>
        <p className="text-blue-600">
          Emprunts: <span className="font-bold">{payload[0].value}</span>
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          Pourcentage: <span className="font-bold">{(payload[0].payload.percent * 100).toFixed(1)}%</span>
        </p>
      </div>
    );
  }
  return null;
};

// Fonction pour formater les données du backend
const formatGenreData = (backendData) => {
  if (!backendData || !Array.isArray(backendData)) return [];

  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#F97316", "#84CC16"];

  return backendData.map((item, index) => ({
    genre: item.genre || item.categorie || `Catégorie ${index + 1}`,
    value: item.nombreEmprunts || item.count || 0,
    color: colors[index % colors.length]
  }));
};

export function LoansByGenreChart({ data }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [view, setView] = useState<"chart" | "list">("chart");

  // Formater les données du backend
  const formattedData = formatGenreData(data);

  if (!data || formattedData.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <p>Aucune donnée disponible</p>
          <p className="text-sm">La répartition par genre sera affichée ici</p>
        </div>
      </div>
    );
  }

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const totalLoans = formattedData.reduce((sum, item) => sum + item.value, 0);

  // Ajouter le pourcentage à chaque élément
  const dataWithPercent = formattedData.map(item => ({
    ...item,
    percent: item.value / totalLoans
  }));

  return (
    <div className="w-full">
      {/* En-tête avec toggle */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Emprunts par Genre
        </h3>
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setView("chart")}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              view === "chart"
                ? "bg-white dark:bg-gray-600 shadow-sm"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            Graphique
          </button>
          <button
            onClick={() => setView("list")}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              view === "list"
                ? "bg-white dark:bg-gray-600 shadow-sm"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            Liste
          </button>
        </div>
      </div>

      {view === "chart" ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={dataWithPercent}
              dataKey="value"
              nameKey="genre"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              onMouseEnter={onPieEnter}
            >
              {dataWithPercent.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="space-y-3">
          {dataWithPercent.map((item, index) => (
            <div key={item.genre} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium text-gray-900 dark:text-white">{item.genre}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900 dark:text-white">{item.value} emprunts</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {((item.value / totalLoans) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Légende */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {dataWithPercent.map((item, index) => (
          <div key={item.genre} className="flex items-center space-x-2 text-xs">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-600 dark:text-gray-400">{item.genre}</span>
          </div>
        ))}
      </div>
    </div>
  );
}