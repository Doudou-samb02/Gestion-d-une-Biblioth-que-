import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const topBooksData = [
  { title: "L'Alchimiste", count: 34 },
  { title: "1984", count: 28 },
  { title: "Le Petit Prince", count: 22 },
  { title: "Harry Potter", count: 18 },
];

export function TopBooksChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={topBooksData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis dataKey="title" stroke="#8884d8" />
        <YAxis stroke="#8884d8" />
        <Tooltip />
        <Bar dataKey="count" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}
