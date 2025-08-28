"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

type Emprunt = {
  id: number;
  livre: { titre: string };
  dateEmprunt: string;
  dateRetour?: string;
};

type Utilisateur = {
  id: number;
  nom: string;
  prenom?: string;
  email: string;
  role: string;
  emprunts?: Emprunt[];
};

export default function UtilisateursPage() {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [editingUser, setEditingUser] = useState<Utilisateur | null>(null);
  const [selectedUser, setSelectedUser] = useState<Utilisateur | null>(null);

  // Charger utilisateurs depuis API
  useEffect(() => {
    fetch("http://localhost:8080/api/utilisateurs", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    })
        .then((res) => res.json())
        .then(setUtilisateurs)
        .catch((err) => console.error("Erreur chargement utilisateurs:", err));
  }, []);

  // Modifier utilisateur
  const handleSave = async () => {
    if (!editingUser) return;
    try {
      const res = await fetch(
          `http://localhost:8080/api/utilisateurs/${editingUser.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
            body: JSON.stringify(editingUser),
          }
      );
      if (!res.ok) throw new Error("Erreur modification utilisateur");
      setUtilisateurs((prev) =>
          prev.map((u) => (u.id === editingUser.id ? editingUser : u))
      );
      toast.success("Utilisateur modifié avec succès !");
      setEditingUser(null);
    } catch (err) {
      toast.error("Impossible de modifier l'utilisateur.");
      console.error(err);
    }
  };

  // Supprimer utilisateur
  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/utilisateurs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      if (!res.ok) throw new Error("Erreur suppression utilisateur");
      setUtilisateurs(utilisateurs.filter((u) => u.id !== id));
      toast.success("Utilisateur supprimé !");
    } catch (err) {
      toast.error("Impossible de supprimer l'utilisateur.");
      console.error(err);
    }
  };

  // Voir détails utilisateur
  const handleShowDetails = async (id: number) => {
    try {
      // Détails de l’utilisateur
      const userRes = await fetch(`http://localhost:8080/api/utilisateurs/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      if (!userRes.ok) throw new Error("Erreur récupération utilisateur");
      const userData = await userRes.json();

      // Emprunts de l’utilisateur
      const empruntsRes = await fetch(
          `http://localhost:8080/api/emprunts/utilisateur/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          }
      );
      const empruntsData = empruntsRes.ok ? await empruntsRes.json() : [];

      setSelectedUser({ ...userData, emprunts: empruntsData });
    } catch (err) {
      toast.error("Impossible de récupérer les détails.");
      console.error(err);
    }
  };

  return (
      <div className="dark:text-gray-100">
        <Toaster position="top-right" />
        <PageBreadcrumb pageTitle="Gestion des Utilisateurs" />
        <div className="space-y-6">
          <ComponentCard title="Liste des Utilisateurs">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-700">
                <thead>
                <tr className="bg-gray-100 dark:bg-gray-800 text-left">
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Nom</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Rôle</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {utilisateurs.map((user) => (
                    <tr
                        key={user.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="border px-4 py-2">{user.id}</td>
                      <td className="border px-4 py-2">
                        {user.nom} {user.prenom || ""}
                      </td>
                      <td className="border px-4 py-2">{user.email}</td>
                      <td className="border px-4 py-2">{user.role}</td>
                      <td className="border px-4 py-2 flex gap-2">
                        <button
                            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={() => setEditingUser(user)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                            className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                            className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            onClick={() => handleShowDetails(user.id)}
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          </ComponentCard>
        </div>

        {/* Modal édition */}
        {editingUser && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-96 relative">
                <h2 className="text-lg font-bold mb-4">Modifier l'utilisateur</h2>
                <button
                    onClick={() => setEditingUser(null)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                <div className="space-y-4">
                  <input
                      name="nom"
                      value={editingUser.nom}
                      onChange={(e) =>
                          setEditingUser({ ...editingUser, nom: e.target.value })
                      }
                      className="border p-2 w-full rounded"
                      placeholder="Nom"
                  />
                  <input
                      name="prenom"
                      value={editingUser.prenom || ""}
                      onChange={(e) =>
                          setEditingUser({ ...editingUser, prenom: e.target.value })
                      }
                      className="border p-2 w-full rounded"
                      placeholder="Prénom"
                  />
                  <input
                      name="email"
                      value={editingUser.email}
                      onChange={(e) =>
                          setEditingUser({ ...editingUser, email: e.target.value })
                      }
                      className="border p-2 w-full rounded"
                      placeholder="Email"
                  />
                  <select
                      name="role"
                      value={editingUser.role}
                      onChange={(e) =>
                          setEditingUser({ ...editingUser, role: e.target.value })
                      }
                      className="border p-2 w-full rounded"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Lecteur">Lecteur</option>
                  </select>
                  <button
                      onClick={handleSave}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Sauvegarder
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* Modal détails */}
        {selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-[500px] relative">
                <h2 className="text-lg font-bold mb-4">
                  Détails de {selectedUser.nom} {selectedUser.prenom}
                </h2>
                <button
                    onClick={() => setSelectedUser(null)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                <div className="space-y-2">
                  <p>
                    <strong>Email :</strong> {selectedUser.email}
                  </p>
                  <p>
                    <strong>Rôle :</strong> {selectedUser.role}
                  </p>
                  <h3 className="mt-4 font-semibold">📚 Emprunts</h3>
                  <ul className="list-disc ml-6">
                    {selectedUser.emprunts && selectedUser.emprunts.length > 0 ? (
                        selectedUser.emprunts.map((e) => (
                            <li key={e.id}>
                              {e.livre.titre} — Emprunté le {e.dateEmprunt}
                              {e.dateRetour && ` (retourné le ${e.dateRetour})`}
                            </li>
                        ))
                    ) : (
                        <li>Aucun emprunt trouvé</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}
