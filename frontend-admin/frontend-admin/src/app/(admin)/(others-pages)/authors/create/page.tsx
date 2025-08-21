"use client";

import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DatePicker from "@/components/form/date-picker";

export default function CreateAuthor() {
  const [author, setAuthor] = useState({ name: "", biography: "", birthDate: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAuthor({ ...author, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Auteur créé (simulation) : ${author.name}`);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Créer un Auteur" />
      <div className="space-y-6">
        <ComponentCard title="Formulaire Auteur">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block mb-1 font-medium text-gray-900 dark:text-gray-100">
              Nom de l'auteur
            </label>
            <input
              name="name"
              placeholder="Nom de l'auteur"
              value={author.name}
              onChange={handleChange}
              className="border p-2 w-full rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              required
            />

            <label className="block mb-1 font-medium text-gray-900 dark:text-gray-100">Biographie</label>
            <textarea
              name="biography"
              placeholder="Biographie"
              value={author.biography}
              onChange={handleChange}
              className="border p-2 w-full rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />

            <div>
              <DatePicker
                id="date-picker"
                label="Date de Naissance"
                placeholder="Sélectionner une date"
                onChange={(dates, currentDateString) => {
                  setAuthor({ ...author, birthDate: currentDateString });
                }}
              />
            </div>

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
