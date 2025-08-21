import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const monthlyData = [
  { month: "Jan", loans: 12 },
  { month: "Fév", loans: 20 },
  { month: "Mar", loans: 15 },
  { month: "Avr", loans: 25 },
  { month: "Mai", loans: 18 },
];

export function MonthlyLoansChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={monthlyData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis dataKey="month" stroke="#8884d8" />
        <YAxis stroke="#8884d8" />
        <Tooltip />
        <Line type="monotone" dataKey="loans" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
