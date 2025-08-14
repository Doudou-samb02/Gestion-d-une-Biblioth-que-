"use client";

import Link from "next/link";
import { useState } from "react";

export default function SigninForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrorMsg("");

  try {
    const res = await fetch("http://localhost:8080/api/utilisateurs/connexion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        motDePasse: password,
      }),
    });

    if (!res.ok) {
      if (res.status === 401) {
        setErrorMsg("Email ou mot de passe incorrect.");
      } else {
        setErrorMsg("Erreur lors de la connexion.");
      }
      return;
    }

    // Ici on lit la réponse texte (et pas json)
    const message = await res.text();

    alert(message); // Affiche "Connexion réussie : Bienvenue <nom>"

    // Pas de stockage de token car pas encore de token envoyé
    // Tu peux faire une redirection ici si tu veux

  } catch {
    setErrorMsg("Erreur réseau ou serveur.");
  }
};


  return (
    <section className="relative z-10 overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[180px] lg:pb-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="shadow-three dark:bg-dark mx-auto max-w-[500px] rounded-sm bg-white px-6 py-10 sm:p-[60px]">
              <h3 className="mb-3 text-center text-2xl font-bold text-black sm:text-3xl dark:text-white">
                Connectez-vous à votre compte
              </h3>
              <p className="text-body-color mb-11 text-center text-base font-medium">
                Connectez-vous pour emprunter vos livres et gérer vos emprunts plus facilement.
              </p>

              {errorMsg && (
                <div className="mb-6 rounded border border-red-500 bg-red-100 px-4 py-2 text-red-700">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-8">
                  <label htmlFor="email" className="text-dark mb-3 block text-sm dark:text-white">
                    Votre Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Entrez votre Email"
                    required
                    className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-xs border bg-[#f8f8f8] px-6 py-3"
                  />
                </div>
                <div className="mb-8">
                  <label htmlFor="password" className="text-dark mb-3 block text-sm dark:text-white">
                    Votre Mot de Passe
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez votre Mot de Passe"
                    required
                    className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-xs border bg-[#f8f8f8] px-6 py-3"
                  />
                </div>
                <div className="mb-6">
                  <button
                    type="submit"
                    className="shadow-submit dark:shadow-submit-dark bg-primary hover:bg-primary/90 flex w-full items-center justify-center rounded-xs px-9 py-4 text-base font-medium text-white duration-300"
                  >
                    Se connecter
                  </button>
                </div>
              </form>

              <p className="text-body-color text-center text-base font-medium">
                Vous n'avez pas de compte ?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  S'inscrire
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
