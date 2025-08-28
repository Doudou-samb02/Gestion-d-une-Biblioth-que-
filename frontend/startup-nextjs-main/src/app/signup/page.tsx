"use client";

import { useState } from "react";
import Link from "next/link";
import { Metadata } from "next";



const SignupPage = () => {
  // états pour les champs
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // fonction pour gérer l'envoi du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // validation basique côté client
    if (!fullName || !email || !password) {
      setErrorMsg("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: fullName,
          email: email,
          password: password,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.message || "Erreur lors de l'inscription.");
        return;
      }

      setSuccessMsg("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      // Optionnel : reset formulaire
      setFullName("");
      setEmail("");
      setPassword("");
    } catch (error) {
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
                Créez votre compte
              </h3>
              <p className="text-body-color mb-11 text-center text-base font-medium">
                C’est gratuit et simple.
              </p>

              {/* Message d'erreur */}
              {errorMsg && (
                <div className="mb-6 rounded border border-red-500 bg-red-100 px-4 py-2 text-red-700">
                  {errorMsg}
                </div>
              )}
              {/* Message de succès */}
              {successMsg && (
                <div className="mb-6 rounded border border-green-500 bg-green-100 px-4 py-2 text-green-700">
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-8">
                  <label htmlFor="fullName" className="text-dark mb-3 block text-sm dark:text-white">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Entrez votre nom complet"
                    required
                    className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base outline-hidden transition-all duration-300 dark:border-transparent dark:bg-[#2C303B] dark:focus:shadow-none"
                  />
                </div>

                <div className="mb-8">
                  <label htmlFor="email" className="text-dark mb-3 block text-sm dark:text-white">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Entrez votre email"
                    required
                    className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base outline-hidden transition-all duration-300 dark:border-transparent dark:bg-[#2C303B] dark:focus:shadow-none"
                  />
                </div>

                <div className="mb-8">
                  <label htmlFor="password" className="text-dark mb-3 block text-sm dark:text-white">
                    Mot de passe *
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez votre mot de passe"
                    required
                    className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base outline-hidden transition-all duration-300 dark:border-transparent dark:bg-[#2C303B] dark:focus:shadow-none"
                  />
                </div>

            

                <div className="mb-6">
                  <button
                    type="submit"
                    className="shadow-submit dark:shadow-submit-dark bg-primary hover:bg-primary/90 flex w-full items-center justify-center rounded-xs px-9 py-4 text-base font-medium text-white duration-300"
                  >
                    S'inscrire
                  </button>
                </div>
              </form>

              <p className="text-body-color text-center text-base font-medium">
                Déjà un compte ?{" "}
                <Link href="/signin" className="text-primary hover:underline">
                  Connectez-vous
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignupPage;
