"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Identifiants invalides");
      }

      const data = await res.json();
      // Stocke le token pour les requêtes futures
      localStorage.setItem("token", data.token);

      // Vérifie le rôle
      if (data.user.role !== "ADMIN") {
        setError("Vous n'êtes pas autorisé à accéder à l'administration");
        return;
      }

      // Redirection vers le dashboard admin
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Erreur lors de la connexion");
    }
  };

  return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-96 space-y-6"
        >
          <h2 className="text-2xl font-bold text-center dark:text-gray-100">
            Connexion
          </h2>

          {error && (
              <div className="bg-red-100 text-red-700 p-2 rounded text-sm">{error}</div>
          )}

          <div className="flex flex-col space-y-3">
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            />
            <div className="relative">
              <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
              <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300"
              >
                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            </div>
          </div>

          <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition"
          >
            Se connecter
          </button>

          <p className="text-sm text-center dark:text-gray-300">
            Mot de passe oublié ?{" "}
            <a
                href="admin-login/forgot-password"
                className="text-blue-500 hover:underline"
            >
              Réinitialiser
            </a>
          </p>
        </form>
      </div>
  );
}
