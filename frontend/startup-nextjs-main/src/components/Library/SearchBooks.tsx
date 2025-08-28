"use client";
import { useState } from "react";

export default function SearchBooks() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");

  const handleSearch = () => {
    console.log("Recherche :", search, genre);
    //  backend  ici
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-4">
      <input
        type="text"
        placeholder="Rechercher par titre ou auteur..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-lg px-4 py-2 flex-1"
      />
      <select
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        className="border rounded-lg px-4 py-2"
      >
      // backend ici aussi
        <option value="">Tous les genres</option>
        <option value="roman">Roman</option>
        <option value="science">Science</option>
        <option value="biographie">Biographie</option>
      </select>
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        Rechercher
      </button>
    </div>
  );
}
