"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await fetch("http://localhost:8080/api/utilisateurs/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, email, motDePasse, role: "USER" }),
      });

      if (!res.ok) {
        setErrorMsg("Erreur lors de l'inscription");
        return;
      }

      alert("Inscription réussie !");
      router.push("/signin"); // redirige vers la page de connexion
    } catch (error) {
      setErrorMsg("Erreur réseau ou serveur");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-center text-2xl mb-4">Inscription</h2>

      {errorMsg && (
        <div className="mb-4 text-red-600 bg-red-100 p-2 rounded">{errorMsg}</div>
      )}

      <input
        type="text"
        placeholder="Nom complet"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        required
        className="w-full p-2 mb-4 border rounded"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-2 mb-4 border rounded"
      />

      <input
        type="password"
        placeholder="Mot de passe"
        value={motDePasse}
        onChange={(e) => setMotDePasse(e.target.value)}
        required
        className="w-full p-2 mb-4 border rounded"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        S’inscrire
      </button>
    </form>
  );
}
