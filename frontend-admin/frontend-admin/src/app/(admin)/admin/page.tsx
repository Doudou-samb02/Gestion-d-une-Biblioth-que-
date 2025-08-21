"use client";

import React, { useState } from "react";
import { MonthlyLoansChart } from "@/components/charts/MonthlyLoansChart";
import { TopBooksChart } from "@/components/charts/TopBooksChart";
import { LoansByGenreChart } from "@/components/charts/LoansByGenreChart";
import LibraryMetrics from "@/components/bibliotheque/LibraryMetrics";
import RecentLoans from "@/components/bibliotheque/RecentLoans";
import RecentLoanRequests from "@/components/bibliotheque/RecentLoanRequests";




export default function AdminHomePage() {
  // Simulations de données pour les metrics
  const metricsData = {
    booksCount: 120,
    authorsCount: 45,
    loansInProgress: 32,
    pendingRequests: 10,
  };

  return (
    //pour les graphics et donnees de la page d accueil
    <div className="space-y-6">
      {/* 1️⃣ Metrics */}
      <LibraryMetrics {...metricsData} />se trouve dans componenennt y mettre donnes base de donnees

      {/* 2️⃣ Graphiques / Statistiques */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6 xl:col-span-4">
          <MonthlyLoansChart /> se trouve dans componenennt y mettre donnes base de donnees
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-4">
          <TopBooksChart /> se trouve dans componenennt y mettre donnes base de donnees
        </div>
        <div className="col-span-12 md:col-span-12 xl:col-span-4">
          <LoansByGenreChart /> se trouve dans componenennt y mettre donnes base de donnees
        </div>
      </div>

      {/* 3️⃣ Listes récentes */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6">
          <RecentLoanRequests />
        </div>
        <div className="col-span-12 md:col-span-6">
          <RecentLoans />
        </div>
      </div>
    </div>
    
  );
  
}
