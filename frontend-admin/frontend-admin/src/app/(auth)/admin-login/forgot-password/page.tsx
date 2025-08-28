"use client";
import React, { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage("Veuillez entrer votre email.");
      return;
    }
    // TODO: appel API réelle
    setMessage(`Un lien de réinitialisation a été envoyé à ${email}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-96 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center dark:text-gray-100">
          Réinitialisation du mot de passe
        </h2>

        {message && (
          <div className="bg-blue-100 text-blue-700 p-2 rounded text-sm">
            {message}
          </div>
        )}

        <input
          type="email"
          placeholder="Entrez votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition"
        >
          Envoyer le lien
        </button>
      </form>
    </div>
  );
}
