"use client";

import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DatePicker from "@/components/form/date-picker";
import toast, { Toaster } from "react-hot-toast";

export default function CreateAuthor() {
  const [author, setAuthor] = useState({
    nom: "",
    biographie: "",
    dateNaissance: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAuthor({ ...author, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/auteurs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(author),
      });

      if (!res.ok) throw new Error("Erreur lors de la création");

      toast.success("✅ Auteur créé avec succès !");
      setAuthor({ nom: "", biographie: "", dateNaissance: "" });
    } catch (err) {
      console.error(err);
      toast.error("❌ Impossible de créer l'auteur.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div>
        {/* ✅ Toaster global pour afficher les notifs */}
        <Toaster position="top-right" reverseOrder={false} />

        <PageBreadcrumb pageTitle="Créer un Auteur" />
        <div className="space-y-6">
          <ComponentCard title="Formulaire Auteur">
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block mb-1 font-medium">Nom de l'auteur</label>
              <input
                  name="nom"
                  placeholder="Nom de l'auteur"
                  value={author.nom}
                  onChange={handleChange}
                  className="border p-2 w-full rounded"
                  required
              />

              <label className="block mb-1 font-medium">Biographie</label>
              <textarea
                  name="biographie"
                  placeholder="Biographie"
                  value={author.biographie}
                  onChange={handleChange}
                  className="border p-2 w-full rounded"
              />

              <div>
                <DatePicker
                    id="date-picker"
                    label="Date de Naissance"
                    placeholder="Sélectionner une date"
                    onChange={(dates, currentDateString) => {
                      setAuthor({ ...author, dateNaissance: currentDateString });
                    }}
                />
              </div>

              <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                {loading ? "Création..." : "Créer"}
              </button>
            </form>
          </ComponentCard>
        </div>
      </div>
  );
}
