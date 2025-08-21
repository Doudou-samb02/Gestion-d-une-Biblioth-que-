import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Gestion des Livres | Admin Bibliothèque",
  description: "Page de gestion des livres dans la bibliothèque",
};

const livres = [
  { id: 1, titre: "L'Alchimiste", auteur: "Paulo Coelho", genre: "Roman", date: "1988" },
  { id: 2, titre: "1984", auteur: "George Orwell", genre: "Dystopie", date: "1949" },
  { id: 3, titre: "Le Petit Prince", auteur: "Antoine de Saint-Exupéry", genre: "Conte", date: "1943" },
];

export default function LivresPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Gestion des Livres" />
      <div className="space-y-6">
        <ComponentCard title="Liste des Livres">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800 text-left">
                  <th className="border px-4 py-2 text-gray-900 dark:text-gray-100">ID</th>
                  <th className="border px-4 py-2 text-gray-900 dark:text-gray-100">Titre</th>
                  <th className="border px-4 py-2 text-gray-900 dark:text-gray-100">Auteur</th>
                  <th className="border px-4 py-2 text-gray-900 dark:text-gray-100">Genre</th>
                  <th className="border px-4 py-2 text-gray-900 dark:text-gray-100">Date</th>
                  <th className="border px-4 py-2 text-gray-900 dark:text-gray-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {livres.map((livre) => (
                  <tr key={livre.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="border px-4 py-2 text-gray-900 dark:text-gray-100">{livre.id}</td>
                    <td className="border px-4 py-2 text-gray-900 dark:text-gray-100">{livre.titre}</td>
                    <td className="border px-4 py-2 text-gray-900 dark:text-gray-100">{livre.auteur}</td>
                    <td className="border px-4 py-2 text-gray-900 dark:text-gray-100">{livre.genre}</td>
                    <td className="border px-4 py-2 text-gray-900 dark:text-gray-100">{livre.date}</td>
                    <td className="border px-4 py-2 space-x-2">
                      <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                        Modifier
                      </button>
                      <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
