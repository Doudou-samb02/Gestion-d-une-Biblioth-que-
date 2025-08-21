"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DatePicker from "@/components/form/date-picker";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import React, { useState } from "react";

export default function CreateBook() {
  const [book, setBook] = useState({
    title: "",
    author: "",
    genre: "",
    publishedDate: "",
    description: "",
  });

  // Exemple de liste d’auteurs (à remplacer plus tard par un fetch API)
  const authors = ["Cheikh Anta Diop", "Mariama Bâ", "Paulo Coelho", "Victor Hugo"];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Livre créé (simulation) :\nTitre: ${book.title}\nAuteur: ${book.author}\nGenre: ${book.genre}\nDate: ${book.publishedDate}`
    );
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Créer un Livre" />

      <div className="space-y-6">
        <ComponentCard title="Formulaire Livre">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Titre */}
            <div>
              <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">
                Titre
              </label>
              <input
                name="title"
                placeholder="Titre du livre"
                value={book.title}
                onChange={handleChange}
                className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400 
                bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
                required
              />
            </div>

            {/* Auteur */}
            <div>
              <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">
                Auteur
              </label>
              <select
                name="author"
                value={book.author}
                onChange={handleChange}
                className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400 
                bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
                required
              >
                <option value="">Sélectionner un auteur</option>
                {authors.map((auteur, idx) => (
                  <option key={idx} value={auteur}>
                    {auteur}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Brève description du livre"
                value={book.description}
                onChange={handleChange}
                className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400 
                bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
                rows={3}
              />
            </div>

            {/* Genre */}
            <div>
              <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">
                Genre
              </label>
              <select
                name="genre"
                value={book.genre}
                onChange={handleChange}
                className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400 
                bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
                required
              >
                <option value="">Sélectionner un genre</option>
                <option value="Roman">Roman</option>
                <option value="Science">Science</option>
                <option value="Histoire">Histoire</option>
                <option value="Fantastique">Fantastique</option>
              </select>
            </div>

            {/* Date de publication */}
            <div>
              <DatePicker
                id="date-picker"
                label="Date de Publication"
                placeholder="Sélectionner une date"
                onChange={(dates, currentDateString) => {
                  setBook({ ...book, publishedDate: currentDateString });
                }}
              />
            </div>

            {/* Image */}
            <div>
              <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">
                Image de Couverture
              </label>
              <DropzoneComponent />
            </div>

            {/* Bouton */}
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 
              dark:bg-green-600 dark:hover:bg-green-700"
            >
              Créer
            </button>
          </form>
        </ComponentCard>
      </div>
    </div>
  );
}
