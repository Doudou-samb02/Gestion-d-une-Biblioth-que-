"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DatePicker from "@/components/form/date-picker";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import React, { useEffect, useState } from "react";

export default function CreateBook() {
  const [book, setBook] = useState({
    titre: "",
    isbn: "",
    auteurId: "",
    categorieId: "",
    datePublication: "",
    cover: "",
  });

  const [auteurs, setAuteurs] = useState<{ id: number; nom: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; nom: string }[]>([]);

  // Charger auteurs et catégories
  useEffect(() => {
    fetch("http://localhost:8080/api/auteurs")
        .then((res) => res.json())
        .then(setAuteurs);

    fetch("http://localhost:8080/api/categories")
        .then((res) => res.json())
        .then(setCategories);
  }, []);

  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/livres", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(book),
      });

      if (!res.ok) throw new Error("Erreur lors de la création");

      alert("Livre créé avec succès !");
      setBook({
        titre: "",
        isbn: "",
        auteurId: "",
        categorieId: "",
        datePublication: "",
        cover: "",
      });
    } catch (err) {
      console.error(err);
      alert("Impossible de créer le livre.");
    }
  };

  return (
      <div>
        <PageBreadcrumb pageTitle="Créer un Livre" />

        <div className="space-y-6">
          <ComponentCard title="Formulaire Livre">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Titre */}
              <div>
                <label className="block mb-1 font-medium">Titre</label>
                <input
                    name="titre"
                    value={book.titre}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                    required
                />
              </div>

              {/* ISBN */}
              <div>
                <label className="block mb-1 font-medium">ISBN</label>
                <input
                    name="isbn"
                    value={book.isbn}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                    required
                />
              </div>

              {/* Auteur */}
              <div>
                <label className="block mb-1 font-medium">Auteur</label>
                <select
                    name="auteurId"
                    value={book.auteurId}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                    required
                >
                  <option value="">Sélectionner un auteur</option>
                  {auteurs.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.nom}
                      </option>
                  ))}
                </select>
              </div>

              {/* Catégorie */}
              <div>
                <label className="block mb-1 font-medium">Catégorie</label>
                <select
                    name="categorieId"
                    value={book.categorieId}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                    required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nom}
                      </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <DatePicker
                    id="date-picker"
                    label="Date de Publication"
                    placeholder="Sélectionner une date"
                    onChange={(dates, currentDateString) =>
                        setBook({ ...book, datePublication: currentDateString })
                    }
                />
              </div>

              {/* Image */}
              <div>
                <label className="block mb-1 font-medium">Image de Couverture</label>
                <DropzoneComponent
                    onFileUploaded={(url) => setBook({ ...book, cover: url })}
                />
              </div>

              {/* Bouton */}
              <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Créer
              </button>
            </form>
          </ComponentCard>
        </div>
      </div>
  );
}
