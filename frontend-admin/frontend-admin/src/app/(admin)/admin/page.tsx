"use client";

import React, { useState, useEffect } from "react";
import { MonthlyLoansChart } from "@/components/charts/MonthlyLoansChart";
import { TopBooksChart } from "@/components/charts/TopBooksChart";
import { LoansByGenreChart } from "@/components/charts/LoansByGenreChart";
import LibraryMetrics from "@/components/bibliotheque/LibraryMetrics";
import RecentLoans from "@/components/bibliotheque/RecentLoans";
import RecentLoanRequests from "@/components/bibliotheque/RecentLoanRequests";
import { DashboardSkeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Service API avec gestion JWT
const apiService = {
  // Récupérer le token JWT du localStorage
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken') ||
             localStorage.getItem('jwtToken') ||
             localStorage.getItem('token');
    }
    return null;
  },

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Vérifier si le token est expiré (optionnel)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },

  // Méthode générique pour les requêtes authentifiées
  async fetchWithAuth(url: string): Promise<any> {
    const token = this.getToken();

    if (!token) {
      throw new Error('NOT_AUTHENTICATED');
    }

    console.log('🔐 Using JWT token:', token.substring(0, 20) + '...');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('📡 Response status:', response.status, 'for URL:', url);

    if (response.status === 401 || response.status === 403) {
      // Token invalide ou expiré
      localStorage.removeItem('authToken');
      throw new Error('UNAUTHORIZED');
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }

    return response.json();
  },

  // Méthodes spécifiques pour chaque endpoint
  async fetchMetrics() {
    return this.fetchWithAuth(`${API_BASE_URL}/api/admin/dashboard/metrics`);
  },

  async fetchMonthlyStats() {
    return this.fetchWithAuth(`${API_BASE_URL}/api/admin/dashboard/stats/mensuels`);
  },

  async fetchTopBooks() {
    return this.fetchWithAuth(`${API_BASE_URL}/api/admin/dashboard/stats/top-livres`);
  },

  async fetchGenreStats() {
    return this.fetchWithAuth(`${API_BASE_URL}/api/admin/dashboard/stats/par-genre`);
  },

  async fetchRecentLoans() {
    return this.fetchWithAuth(`${API_BASE_URL}/api/admin/dashboard/emprunts/recents`);
  },

  async fetchPendingRequests() {
    return this.fetchWithAuth(`${API_BASE_URL}/api/admin/dashboard/demandes/en-attente`);
  },

  async fetchAllData() {
    const data = await this.fetchWithAuth(`${API_BASE_URL}/api/admin/dashboard/complet`);

    // Ajuster la structure des données pour correspondre à votre état
    return {
      metrics: data.metrics,
      monthlyStats: data.monthlyStats,
      topBooks: data.topBooks,
      genreStats: data.genreStats,
      recentLoans: data.recentLoans,
      pendingRequests: data.pendingRequests
    };
  }
};

// Types pour les données
interface DashboardMetrics {
  booksCount: number;
  authorsCount: number;
  loansInProgress: number;
  pendingRequests: number;
}

interface DashboardData {
  metrics: DashboardMetrics | null;
  monthlyStats: any;
  topBooks: any;
  genreStats: any;
  recentLoans: any;
  pendingRequests: any;
}

export default function AdminHomePage() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    metrics: null,
    monthlyStats: null,
    topBooks: null,
    genreStats: null,
    recentLoans: null,
    pendingRequests: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fonction pour gérer les redirections en cas d'erreur d'authentification
  const handleAuthError = (error: Error) => {
    console.error('🔐 Authentication error:', error);

    if (error.message === 'NOT_AUTHENTICATED' || error.message === 'UNAUTHORIZED') {
      // Rediriger vers la page de login
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      localStorage.removeItem('jwtToken');
      router.push('/login?redirect=/admin');
      return true;
    }
    return false;
  };

  // Fonction pour charger les données
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🚀 Starting dashboard data loading...');

      // Vérifier l'authentification
      if (!apiService.isAuthenticated()) {
        throw new Error('NOT_AUTHENTICATED');
      }

      // Essayer d'abord l'endpoint complet
      try {
        console.log('🔄 Trying complete endpoint...');
        const allData = await apiService.fetchAllData();

        console.log('📊 Complete endpoint response:', allData);

        setDashboardData({
          metrics: allData.metrics || null,
          monthlyStats: allData.monthlyStats || [],
          topBooks: allData.topBooks || [],
          genreStats: allData.genreStats || [],
          recentLoans: allData.recentLoans || [],
          pendingRequests: allData.pendingRequests || []
        });

      } catch (completeError) {
        console.log('⚠️ Complete endpoint failed, trying individual endpoints...', completeError);

        // Fallback: Chargement individuel
        const [
          metrics,
          monthlyStats,
          topBooks,
          genreStats,
          recentLoans,
          pendingRequests
        ] = await Promise.all([
          apiService.fetchMetrics().catch(e => {
            console.error('Error fetching metrics:', e);
            return null;
          }),
          apiService.fetchMonthlyStats().catch(e => {
            console.error('Error fetching monthly stats:', e);
            return [];
          }),
          apiService.fetchTopBooks().catch(e => {
            console.error('Error fetching top books:', e);
            return [];
          }),
          apiService.fetchGenreStats().catch(e => {
            console.error('Error fetching genre stats:', e);
            return [];
          }),
          apiService.fetchRecentLoans().catch(e => {
            console.error('Error fetching recent loans:', e);
            return [];
          }),
          apiService.fetchPendingRequests().catch(e => {
            console.error('Error fetching pending requests:', e);
            return [];
          })
        ]);

        setDashboardData({
          metrics,
          monthlyStats,
          topBooks,
          genreStats,
          recentLoans,
          pendingRequests
        });
      }

      console.log('🎉 Dashboard data loaded successfully!');

    } catch (err) {
      console.error('💥 Error loading dashboard:', err);

      if (err instanceof Error) {
        // Gérer les erreurs d'authentification
        if (handleAuthError(err)) {
          return; // La redirection est gérée, on arrête ici
        }

        // Autres erreurs
        setError(err.message || 'Une erreur est survenue lors du chargement des données');
      } else {
        setError('Une erreur inconnue est survenue');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Composant de chargement
  if (loading) {
    return <DashboardSkeleton />;
  }

  // Composant d'erreur
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 space-y-4 p-6">
        <div className="text-red-600 text-lg font-semibold">Erreur</div>
        <div className="text-gray-600 text-center max-w-md">
          {error}
        </div>
        <div className="flex space-x-4">
          <button
            onClick={loadDashboardData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Réessayer
          </button>
          <button
            onClick={() => router.push('/login')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Se reconnecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tableau de Bord Admin
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Connecté en tant qu'administrateur
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              localStorage.removeItem('authToken');
              localStorage.removeItem('token');
              localStorage.removeItem('jwtToken');
              router.push('/login');
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Déconnexion
          </button>
          <button
            onClick={loadDashboardData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Actualiser
          </button>
        </div>
      </div>

      {/* Métriques */}
      {dashboardData.metrics && (
        <LibraryMetrics
          booksCount={dashboardData.metrics.booksCount || 0}
          authorsCount={dashboardData.metrics.authorsCount || 0}
          loansInProgress={dashboardData.metrics.loansInProgress || 0}
          pendingRequests={dashboardData.metrics.pendingRequests || 0}
          livresDisponibles={0}
          tauxRetour={0}
        />
      )}

      {/* Graphiques */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Statistiques
        </h2>

        <div className="grid grid-cols-12 gap-6">
          {/* Graphique des emprunts mensuels */}
          <div className="col-span-12 lg:col-span-7">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 h-full">
              <h3 className="font-medium mb-4 text-gray-700 dark:text-gray-300">
                Emprunts Mensuels
              </h3>
              {dashboardData.monthlyStats && dashboardData.monthlyStats.length > 0 ? (
                <MonthlyLoansChart data={dashboardData.monthlyStats} />
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  Aucune donnée disponible
                </div>
              )}
            </div>
          </div>

          {/* Top livres */}
          <div className="col-span-12 lg:col-span-5">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 h-full">
              <h3 className="font-medium mb-4 text-gray-700 dark:text-gray-300">
                Livres Populaires
              </h3>
              {dashboardData.topBooks && dashboardData.topBooks.length > 0 ? (
                <TopBooksChart data={dashboardData.topBooks} />
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  Aucune donnée disponible
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Répartition par genre */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 h-full">
              <h3 className="font-medium mb-4 text-gray-700 dark:text-gray-300">
                Répartition par Genre
              </h3>
              {dashboardData.genreStats && dashboardData.genreStats.length > 0 ? (
                <LoansByGenreChart data={dashboardData.genreStats} />
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  Aucune donnée disponible
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Activité récente */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Activité Récente
        </h2>
        <div className="grid grid-cols-12 gap-6">
          {/* Demandes en attente */}
          <div className="col-span-12 xl:col-span-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 h-full">
              <h3 className="font-medium mb-4 text-gray-700 dark:text-gray-300">
                Demandes en Attente ({dashboardData.pendingRequests?.length || 0})
              </h3>
              {dashboardData.pendingRequests && dashboardData.pendingRequests.length > 0 ? (
                <RecentLoanRequests
                  data={dashboardData.pendingRequests}
                  onUpdate={loadDashboardData}
                />
              ) : (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  Aucune demande en attente
                </div>
              )}
            </div>
          </div>

          {/* Emprunts récents */}
          <div className="col-span-12 xl:col-span-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 h-full">
              <h3 className="font-medium mb-4 text-gray-700 dark:text-gray-300">
                Emprunts Récents ({dashboardData.recentLoans?.length || 0})
              </h3>
              {dashboardData.recentLoans && dashboardData.recentLoans.length > 0 ? (
                <RecentLoans
                  data={dashboardData.recentLoans}
                  onUpdate={loadDashboardData}
                />
              ) : (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  Aucun emprunt récent
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Debug info (à retirer en production) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <summary className="cursor-pointer font-medium">Données de débogage</summary>
          <pre className="mt-2 text-xs overflow-auto max-h-64">
            {JSON.stringify(dashboardData, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}