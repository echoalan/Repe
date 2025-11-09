import { createContext, useContext, useEffect, useState } from "react";

const API_URL = "https://repe.coderalan.com/backend/public/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(true); // evita redirección temprana

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      setIsVerifying(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`${API_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch (err) {
        console.error("Error verificando usuario:", err);
      } finally {
        setLoading(false);
        setIsVerifying(false);
      }
    };

    verify();
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al iniciar sesión");
    }

    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const logout = async () => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
    } catch {}
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isVerifying }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
