import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      // Simula verificação. Como é mock local, lemos o usuário salvo
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        logout();
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      // Hardcoded auth local, removendo necessidade de backend
      const USERS = {
        "ADMIN": { pass: "223344", role: "admin" },
        "Mãe": { pass: "123456", role: "viewer" },
        "Pai": { pass: "123456", role: "viewer" }
      };

      const foundUser = USERS[username];
      
      if (!foundUser || foundUser.pass !== password) {
        return { success: false, message: "Usuário ou senha incorretos" };
      }

      const userData = { username, role: foundUser.role };
      const newToken = "mock-jwt-token-" + username;

      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(userData));
      
      setToken(newToken);
      setUser(userData);

      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, message: "Erro interno no simulador de login" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const isAdmin = () => user?.role === "admin";
  const isViewer = () => user?.role === "viewer";

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAdmin,
    isViewer,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
