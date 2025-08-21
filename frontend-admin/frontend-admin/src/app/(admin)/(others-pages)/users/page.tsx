"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useState } from "react";

const utilisateursInit = [
  { id: 1, nom: "Alice Dupont", email: "alice@mail.com", role: "Admin" },
  { id: 2, nom: "Bob Martin", email: "bob@mail.com", role: "Lecteur" },
];

export default function UtilisateursPage() {
  const [utilisateurs, setUtilisateurs] = useState(utilisateursInit);
  const [editingUser, setEditingUser] = useState<typeof utilisateursInit[0] | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingUser) return;
    setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!editingUser) return;
    setUtilisateurs((prev) =>
      prev.map((u) => (u.id === editingUser.id ? editingUser : u))
    );
    setEditingUser(null);
  };

  return (
    <div className="dark:text-gray-100">
      <PageBreadcrumb pageTitle="Gestion des Utilisateurs" />
      <div className="space-y-6">
        <ComponentCard title="Liste des Utilisateurs">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800 text-left">
                  <th className="border px-4 py-2 dark:border-gray-700">ID</th>
                  <th className="border px-4 py-2 dark:border-gray-700">Nom</th>
                  <th className="border px-4 py-2 dark:border-gray-700">Email</th>
                  <th className="border px-4 py-2 dark:border-gray-700">Rôle</th>
                  <th className="border px-4 py-2 dark:border-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {utilisateurs.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="border px-4 py-2 dark:border-gray-700">{user.id}</td>
                    <td className="border px-4 py-2 dark:border-gray-700">{user.nom}</td>
                    <td className="border px-4 py-2 dark:border-gray-700">{user.email}</td>
                    <td className="border px-4 py-2 dark:border-gray-700">{user.role}</td>
                    <td className="border px-4 py-2 space-x-2 dark:border-gray-700">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        onClick={() => setEditingUser(user)}
                      >
                        Modifier
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        onClick={() =>
                          setUtilisateurs(utilisateurs.filter((u) => u.id !== user.id))
                        }
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

      {/* Modal pour modifier */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 dark:text-gray-100 p-6 rounded-lg w-96 shadow-lg relative">
            <h2 className="text-lg font-bold mb-4">Modifier l'utilisateur</h2>
            <button
              onClick={() => setEditingUser(null)}
              className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
            >
              ✕
            </button>
            <div className="space-y-3">
              <input
                name="nom"
                value={editingUser.nom}
                onChange={handleChange}
                className="border border-gray-300 dark:border-gray-700 p-2 w-full rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Nom"
              />
              <input
                name="email"
                value={editingUser.email}
                onChange={handleChange}
                className="border border-gray-300 dark:border-gray-700 p-2 w-full rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Email"
              />
              <select
                name="role"
                value={editingUser.role}
                onChange={handleChange}
                className="border border-gray-300 dark:border-gray-700 p-2 w-full rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="">Sélectionner le rôle</option>
                <option value="Admin">Admin</option>
                <option value="Lecteur">Lecteur</option>
              </select>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
