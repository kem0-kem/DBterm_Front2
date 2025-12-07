import { createContext, useContext, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("authRole");
    const userId = localStorage.getItem("authUserId");
    if (!token || !role || !userId) return null;
    return { token, role, userId: Number(userId) };
  });

  const login = async (username, password) => {
    const res = await api.post("/api/auth/login", { username, password });
    const { token, role, userId } = res.data;
    localStorage.setItem("authToken", token);
    localStorage.setItem("authRole", role);
    localStorage.setItem("authUserId", String(userId));
    setUser({ token, role, userId });
    return { role };
  };

  const signup = async (payload) => {
    await api.post("/api/auth/signup", payload);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authRole");
    localStorage.removeItem("authUserId");
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
