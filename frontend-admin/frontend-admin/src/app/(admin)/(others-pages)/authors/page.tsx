"use client";

import React, { useState, useEffect } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Pencil, Trash2, Eye } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

type Livre = {
  id: number;
  titre: string;
  categorie?: { id: number; nom: string };
};

type Author = {
  id: number;
  nom: string;
  biographie?: string;
  dateNaissance?: string;
  livres?: Livre[];
};

export default function ListAuthors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(false);

  // Charger les auteurs
  useEffect(() => {
    fetch("http://localhost:8080/api/auteurs", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    })
        .then((res) => res.json())
        .then(setAuthors)
        .catch((err) => console.error("Erreur fetch auteurs:", err));
  }, []);

  // Suppression
  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cet auteur ?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/auteurs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      if (!res.ok) throw new Error("Erreur suppression");
      setAuthors(authors.filter((a) => a.id !== id));
      toast.success("Auteur supprimé avec succès !");
    } catch (err) {
      toast.error("Impossible de supprimer l'auteur.");
      console.error(err);
    }
  };

  // Sauvegarde édition
  const handleEditSave = async () => {
    if (!editingAuthor) return;
    setLoading(true);
    try {
      const res = await fetch(
          `http://localhost:8080/api/auteurs/${editingAuthor.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
            body: JSON.stringify({
              nom: editingAuthor.nom,
              biographie: editingAuthor.biographie,
              dateNaissance: editingAuthor.dateNaissance,
            }),
          }
      );

      if (!res.ok) throw new Error("Erreur modification");

      setAuthors(
          authors.map((a) => (a.id === editingAuthor.id ? editingAuthor : a))
      );
      toast.success("Auteur modifié avec succès !");
      setEditingAuthor(null);
    } catch (err) {
      toast.error("Impossible de modifier l'auteur.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Détails auteur
  const handleShowDetails = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/auteurs/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      if (!res.ok) throw new Error("Erreur récupération détails");
      const data = await res.json();
      setSelectedAuthor(data);
    } catch (err) {
      toast.error("Impossible de récupérer les détails.");
      console.error(err);
    }
  };

  return (
      <div>
        <Toaster position="top-right" />
        <PageBreadcrumb pageTitle="Liste des Auteurs" />

        <div className="space-y-6">
          <ComponentCard title="Auteurs">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-700">
                <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border px-4 py-2">Nom</th>
                  <th className="border px-4 py-2">Biographie</th>
                  <th className="border px-4 py-2">Date de naissance</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {authors.map((author) => (
                    <tr
                        key={author.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="border px-4 py-2">{author.nom}</td>
                      <td className="border px-4 py-2">{author.biographie}</td>
                      <td className="border px-4 py-2">{author.dateNaissance}</td>
                      <td className="border px-4 py-2 flex gap-2">
                        <button
                            onClick={() => setEditingAuthor(author)}
                            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                            onClick={() => handleDelete(author.id)}
                            className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                            onClick={() => handleShowDetails(author.id)}
                            className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
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

        {/* Modal Edition */}
        {editingAuthor && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-96 relative">
                <h2 className="text-lg font-bold mb-4">Modifier l'auteur</h2>
                <button
                    onClick={() => setEditingAuthor(null)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                <div className="space-y-4">
                  <input
                      name="nom"
                      value={editingAuthor.nom}
                      onChange={(e) =>
                          setEditingAuthor({ ...editingAuthor, nom: e.target.value })
                      }
                      className="border p-2 w-full rounded"
                      placeholder="Nom"
                  />
                  <textarea
                      name="biographie"
                      value={editingAuthor.biographie}
                      onChange={(e) =>
                          setEditingAuthor({
                            ...editingAuthor,
                            biographie: e.target.value,
                          })
                      }
                      className="border p-2 w-full rounded"
                      placeholder="Biographie"
                  />
                  <input
                      name="dateNaissance"
                      type="date"
                      value={editingAuthor.dateNaissance || ""}
                      onChange={(e) =>
                          setEditingAuthor({
                            ...editingAuthor,
                            dateNaissance: e.target.value,
                          })
                      }
                      className="border p-2 w-full rounded"
                  />

                  <button
                      onClick={handleEditSave}
                      disabled={loading}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    {loading ? "Enregistrement..." : "Sauvegarder"}
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* Modal Détails */}
        {selectedAuthor && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-[500px] relative">
                <h2 className="text-lg font-bold mb-4">
                  Détails de {selectedAuthor.nom}
                </h2>
                <button
                    onClick={() => setSelectedAuthor(null)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                <div className="space-y-2">
                  <p>
                    <strong>Nom :</strong> {selectedAuthor.nom}
                  </p>
                  <p>
                    <strong>Biographie :</strong> {selectedAuthor.biographie}
                  </p>
                  <p>
                    <strong>Date de naissance :</strong>{" "}
                    {selectedAuthor.dateNaissance}
                  </p>
                  <h3 className="mt-4 font-semibold">📚 Livres écrits</h3>
                  <ul className="list-disc ml-6">
                    {selectedAuthor.livres && selectedAuthor.livres.length > 0 ? (
                        selectedAuthor.livres.map((livre) => (
                            <li key={livre.id}>
                              {livre.titre}{" "}
                              <span className="text-sm text-gray-500">
                        (Catégorie: {livre.categorie?.nom})
                      </span>
                            </li>
                        ))
                    ) : (
                        <li>Aucun livre trouvé</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}
