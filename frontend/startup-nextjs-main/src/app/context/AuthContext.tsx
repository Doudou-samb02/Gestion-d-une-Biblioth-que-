"use client";
import { createContext, useState, useContext, ReactNode, useEffect } from "react";

interface User {
  id: number;
  nom: string;
  email: string;
  role: "ADMIN" | "LECTEUR";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  authFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // 🔹 Récupération du user si token existe
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:8080/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Token invalide");
        const data = await res.json();
        setUser(data);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      }
    };

    loadUser();

    // Sync si stockage local change dans un autre onglet
    const handleStorage = () => loadUser();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // 🔹 Login
  const login = async (email: string, password: string): Promise<User> => {
    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Identifiants invalides");
    const data = await res.json();

    // Stockage token et user
    localStorage.setItem("token", data.token);
    setUser(data.user);

    return data.user;
  };

  // 🔹 Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // 🔹 Update user
  const updateUser = (data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  // 🔹 fetch sécurisé centralisé
  const authFetch = async (input: RequestInfo, init?: RequestInit) => {
    const token = localStorage.getItem("token");
    const headers = {
      ...(init?.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    };

    return fetch(input, { ...init, headers });
  };

  return (
      <AuthContext.Provider value={{ user, login, logout, updateUser, authFetch }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
