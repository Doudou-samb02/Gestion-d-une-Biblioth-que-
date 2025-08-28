"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Edit2, Trash2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

type Livre = {
  id: number;
  titre: string;
  isbn: string;
  datePublication: string;
  cover: string;
  auteurId: number;
  auteurNom: string;
  categorieId: number;
  categorieNom: string;
};

type Auteur = { id: number; nom: string };
type Categorie = { id: number; nom: string };

export default function LivresPage() {
  const [livres, setLivres] = useState<Livre[]>([]);
  const [auteurs, setAuteurs] = useState<Auteur[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);

  const [selectedLivre, setSelectedLivre] = useState<Livre | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Champs pour la modification
  const [titre, setTitre] = useState("");
  const [isbn, setIsbn] = useState("");
  const [datePublication, setDatePublication] = useState("");
  const [auteurId, setAuteurId] = useState<number | null>(null);
  const [categorieId, setCategorieId] = useState<number | null>(null);

  const token = localStorage.getItem("token");

  // 🔹 Fetch livres
  const fetchLivres = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/livres", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur lors du chargement des livres");
      const data: Livre[] = await res.json();
      setLivres(data);
    } catch (err) {
      console.error(err);
      toast.error("Impossible de charger les livres");
    }
  };

  // 🔹 Fetch auteurs
  const fetchAuteurs = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/auteurs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur lors du chargement des auteurs");
      const data: Auteur[] = await res.json();
      setAuteurs(data);
    } catch (err) {
      console.error(err);
      toast.error("Impossible de charger les auteurs");
    }
  };

  // 🔹 Fetch catégories
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur lors du chargement des catégories");
      const data: Categorie[] = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
      toast.error("Impossible de charger les catégories");
    }
  };

  useEffect(() => {
    fetchLivres();
    fetchAuteurs();
    fetchCategories();
  }, []);

  // 🔹 Edit livre
  const handleEdit = (livre: Livre) => {
    setSelectedLivre(livre);
    setTitre(livre.titre);
    setIsbn(livre.isbn);
    setDatePublication(livre.datePublication);
    setAuteurId(livre.auteurId);
    setCategorieId(livre.categorieId);
    setShowEditModal(true);
  };

  const submitEdit = async () => {
    if (!selectedLivre) return;
    try {
      const res = await fetch(`http://localhost:8080/api/livres/${selectedLivre.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titre,
          isbn,
          datePublication,
          auteurId,
          categorieId,
        }),
      });
      if (!res.ok) throw new Error("Erreur lors de la modification");
      await fetchLivres();
      setShowEditModal(false);
      toast.success("Livre modifié !");
    } catch (err) {
      console.error(err);
      toast.error("Impossible de modifier le livre");
    }
  };

  // 🔹 Delete livre
  const handleDelete = (livre: Livre) => {
    setSelectedLivre(livre);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedLivre) return;
    try {
      const res = await fetch(`http://localhost:8080/api/livres/${selectedLivre.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      setLivres(livres.filter((l) => l.id !== selectedLivre.id));
      setShowDeleteModal(false);
      toast.success("Livre supprimé !");
    } catch (err) {
      console.error(err);
      toast.error("Impossible de supprimer le livre");
    }
  };

  return (
      <div>
        <Toaster position="top-right" />
        <PageBreadcrumb pageTitle="Gestion des Livres" />
        <div className="space-y-6">
          <ComponentCard title="Liste des Livres">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-700">
                <thead>
                <tr className="bg-gray-100 dark:bg-gray-800 text-left">
                  <th className="border px-4 py-2 dark:border-gray-700">ID</th>
                  <th className="border px-4 py-2 dark:border-gray-700">Titre</th>
                  <th className="border px-4 py-2 dark:border-gray-700">ISBN</th>
                  <th className="border px-4 py-2 dark:border-gray-700">Date Pub.</th>
                  <th className="border px-4 py-2 dark:border-gray-700">Auteur</th>
                  <th className="border px-4 py-2 dark:border-gray-700">Catégorie</th>
                  <th className="border px-4 py-2 dark:border-gray-700">Actions</th>
                </tr>
                </thead>
                <tbody>
                {livres.map((livre) => (
                    <tr key={livre.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="border px-4 py-2 dark:border-gray-700">{livre.id}</td>
                      <td className="border px-4 py-2 dark:border-gray-700">{livre.titre}</td>
                      <td className="border px-4 py-2 dark:border-gray-700">{livre.isbn}</td>
                      <td className="border px-4 py-2 dark:border-gray-700">{livre.datePublication}</td>
                      <td className="border px-4 py-2 dark:border-gray-700">{livre.auteurNom}</td>
                      <td className="border px-4 py-2 dark:border-gray-700">{livre.categorieNom}</td>
                      <td className="border px-4 py-2 flex gap-2 dark:border-gray-700">
                        <button
                            onClick={() => handleEdit(livre)}
                            className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 flex items-center justify-center"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                            onClick={() => handleDelete(livre)}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center justify-center"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          </ComponentCard>
        </div>

        {/* 🔹 Modale Edit */}
        {showEditModal && selectedLivre && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-900 dark:text-gray-100 p-6 rounded-xl w-[420px] relative shadow-2xl">
                <h2 className="text-xl font-bold mb-4 text-center">Modifier le Livre</h2>
                <div className="space-y-3">
                  <input
                      type="text"
                      value={titre}
                      onChange={(e) => setTitre(e.target.value)}
                      placeholder="Titre"
                      className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:border-gray-700"
                  />
                  <input
                      type="text"
                      value={isbn}
                      onChange={(e) => setIsbn(e.target.value)}
                      placeholder="ISBN"
                      className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:border-gray-700"
                  />
                  <input
                      type="date"
                      value={datePublication}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setDatePublication(e.target.value)}
                      className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:border-gray-700"
                  />
                  <select
                      value={auteurId ?? ""}
                      onChange={(e) => setAuteurId(Number(e.target.value))}
                      className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:border-gray-700"
                  >
                    <option value="">-- Sélectionner Auteur --</option>
                    {auteurs.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.nom}
                        </option>
                    ))}
                  </select>
                  <select
                      value={categorieId ?? ""}
                      onChange={(e) => setCategorieId(Number(e.target.value))}
                      className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:border-gray-700"
                  >
                    <option value="">-- Sélectionner Catégorie --</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nom}
                        </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 bg-gray-400 rounded text-white hover:bg-gray-500"
                  >
                    Annuler
                  </button>
                  <button
                      onClick={submitEdit}
                      className="px-4 py-2 bg-green-600 rounded text-white hover:bg-green-700"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* 🔹 Modale Delete */}
        {showDeleteModal && selectedLivre && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-900 dark:text-gray-100 p-6 rounded-xl w-[320px] relative shadow-2xl">
                <h2 className="text-lg font-bold mb-4 text-center">Confirmer la suppression</h2>
                <p className="text-center mb-4">Voulez-vous vraiment supprimer "{selectedLivre.titre}" ?</p>
                <div className="flex justify-end gap-3">
                  <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-4 py-2 bg-gray-400 rounded text-white hover:bg-gray-500"
                  >
                    Annuler
                  </button>
                  <button
                      onClick={confirmDelete}
                      className="px-4 py-2 bg-red-600 rounded text-white hover:bg-red-700"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}
