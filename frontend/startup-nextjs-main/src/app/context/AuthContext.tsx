"use client";
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  nomComplet: string;
  email: string;
  dateNaissance: string;
  role: "ADMIN" | "LECTEUR";
}

interface AuthContextType {
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 🔹 Vérifier si le token est expiré
  const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convertir en millisecondes
      return Date.now() >= exp;
    } catch (error) {
      return true; // Si erreur de parsing, considérer comme expiré
    }
  };

  // 🔹 Vérifier la validité du token côté serveur
  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  // 🔹 Déconnexion automatique
  const autoLogout = (message?: string) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);

    // Rediriger vers la page de connexion avec un message
    if (router) {
      router.push(`/signin?message=${encodeURIComponent(message || 'Session expirée')}`);
    }
  };

  // 🔹 Intercepteur pour les requêtes API
  const setupFetchInterceptor = () => {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const [url, options] = args;

      // Vérifier seulement pour les requêtes vers notre API
      if (typeof url === 'string' && url.includes('localhost:8080')) {
        const token = localStorage.getItem("token");

        if (token && isTokenExpired(token)) {
          autoLogout('Votre session a expiré');
          throw new Error('Token expiré');
        }
      }

      try {
        const response = await originalFetch(...args);

        // Si erreur 401 (Unauthorized), déconnecter
        if (response.status === 401) {
          autoLogout('Session expirée - Veuillez vous reconnecter');
        }

        return response;
      } catch (error) {
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  };

  // 🔹 Récupération du user si token existe au chargement
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
          // Vérifier si le token est expiré
          if (isTokenExpired(token)) {
            autoLogout('Session expirée');
            return;
          }

          // Vérifier la validité côté serveur (optionnel)
          const isValid = await verifyToken(token);
          if (!isValid) {
            autoLogout('Session invalide');
            return;
          }

          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
        autoLogout('Erreur d\'authentification');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();

    // Setup intercepteur de requêtes
    const cleanupInterceptor = setupFetchInterceptor();

    // Vérifier périodiquement l'expiration du token (toutes les minutes)
    const tokenCheckInterval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token && isTokenExpired(token)) {
        autoLogout('Session expirée');
      }
    }, 60000); // 1 minute

    // Sync entre onglets
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "token" && !e.newValue) {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      cleanupInterceptor();
      clearInterval(tokenCheckInterval);
      window.removeEventListener("storage", handleStorage);
    };
  }, [router]);

  // 🔹 Login simplifié - prend token et userData
  const login = (token: string, userData: User) => {
    // Vérifier que le token n'est pas déjà expiré
    if (isTokenExpired(token)) {
      autoLogout('Token expiré');
      return;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // 🔹 Logout manuel
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push('/signin');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};