"use client";

import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

type Author = { id: number; name: string; biography?: string; birthDate?: string };

export default function ListAuthors() {
  const [authors, setAuthors] = useState<Author[]>([
    { id: 1, name: "Paulo Coelho", biography: "Auteur brésilien", birthDate: "1947-08-24" },
  ]);

  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);

  const handleDelete = (id: number) => {
    setAuthors(authors.filter((a) => a.id !== id));
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editingAuthor) return;
    setEditingAuthor({ ...editingAuthor, [e.target.name]: e.target.value });
  };

  const handleEditSave = () => {
    if (!editingAuthor) return;
    setAuthors(authors.map((a) => (a.id === editingAuthor.id ? editingAuthor : a)));
    setEditingAuthor(null);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Liste des Auteurs" />

      <div className="space-y-6">
        <ComponentCard title="Auteurs">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border px-4 py-2 text-gray-900 dark:text-gray-100">Nom</th>
                  <th className="border px-4 py-2 text-gray-900 dark:text-gray-100">Biographie</th>
                  <th className="border px-4 py-2 text-gray-900 dark:text-gray-100">Date de naissance</th>
                  <th className="border px-4 py-2 text-gray-900 dark:text-gray-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {authors.map((author) => (
                  <tr key={author.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="border px-4 py-2 text-gray-900 dark:text-gray-100">{author.name}</td>
                    <td className="border px-4 py-2 text-gray-900 dark:text-gray-100">{author.biography}</td>
                    <td className="border px-4 py-2 text-gray-900 dark:text-gray-100">{author.birthDate}</td>
                    <td className="border px-4 py-2 flex gap-2">
                      <button
                        onClick={() => setEditingAuthor(author)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(author.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
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

      {/* Modal d'édition */}
      {editingAuthor && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-96 relative border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Modifier l'auteur</h2>
            <button
              onClick={() => setEditingAuthor(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              X
            </button>
            <div className="space-y-4">
              <input
                name="name"
                value={editingAuthor.name}
                onChange={handleEditChange}
                className="border p-2 w-full rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Nom de l'auteur"
              />
              <textarea
                name="biography"
                value={editingAuthor.biography}
                onChange={handleEditChange}
                className="border p-2 w-full rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Biographie"
              />
              <input
                name="birthDate"
                type="date"
                value={editingAuthor.birthDate}
                onChange={handleEditChange}
                className="border p-2 w-full rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
              <button
                onClick={handleEditSave}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
