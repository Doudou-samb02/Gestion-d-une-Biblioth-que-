"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext"; // ajuste le chemin si nécessaire
import { useRouter } from "next/navigation";      // pour la redirection après logout

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.nom || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 🔹 Gestion de la déconnexion
  const handleLogout = () => {
    if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
      logout();
      router.push("/signin"); // redirection vers page login
    }
  };

  if (!user) {
    return (
        <div className="container mx-auto py-20 px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">⚠️ Vous n'êtes pas connecté</h1>
          <p>Veuillez vous connecter pour accéder à votre profil.</p>
        </div>
    );
  }

  // 🔹 Gestion de la sauvegarde du profil
  const handleSave = async () => {
    setError("");
    setMessage("");

    if (!name || !email) {
      setError("Nom et email sont obligatoires.");
      return;
    }

    if (password && password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8080/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nom: name, email: email, password: password || undefined }),
      });

      if (!res.ok) throw new Error("Erreur lors de la mise à jour");

      const updatedUser = await res.json();

      setMessage("Profil mis à jour avec succès !");
      setEditing(false);
      setPassword("");

      updateUser({ nom: updatedUser.nom, email: updatedUser.email });
    } catch (err) {
      console.error(err);
      setError("Impossible de mettre à jour le profil.");
    }
  };

  return (
      <div className="container mx-auto py-20 px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">👤 Mon Profil</h1>

        <div className="max-w-md mx-auto bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Nom</label>
            {editing ? (
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            ) : (
                <p className="text-gray-800 dark:text-gray-100">{user.nom}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Email</label>
            {editing ? (
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            ) : (
                <p className="text-gray-800 dark:text-gray-100">{user.email}</p>
            )}
          </div>

          {editing && (
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Mot de passe</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Laisser vide pour ne pas changer"
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
          )}

          {message && <p className="text-sm text-green-500 mb-4 text-center">{message}</p>}
          {error && <p className="text-sm text-red-500 mb-4 text-center">{error}</p>}

          <div className="flex justify-between items-center">
            {editing ? (
                <>
                  <button
                      onClick={handleSave}
                      className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Sauvegarder
                  </button>
                  <button
                      onClick={() => setEditing(false)}
                      className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-5 py-2 rounded-lg hover:bg-gray-400 transition"
                  >
                    Annuler
                  </button>
                </>
            ) : (
                <button
                    onClick={() => setEditing(true)}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Modifier le profil
                </button>
            )}

            <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
  );
}
