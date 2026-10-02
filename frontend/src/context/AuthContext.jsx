import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authApi } from "../api/authApi";
import { getToken, saveToken } from "../api/axios";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(null);
  async function restore() {
    setLoading(true);
    setError(null);
    try {
      setUser(getToken() ? await authApi.me() : null);
    } catch (err) {
      if (err.response?.status === 401) setUser(null);
      else setError(err);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    restore();
    const expire = () => {
      setUser(null);
      toast.error("Your session has expired. Please sign in again.");
    };
    const sync = (e) => {
      if (e.key === "luma.auth.token") restore();
    };
    window.addEventListener("luma:session-expired", expire);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("luma:session-expired", expire);
      window.removeEventListener("storage", sync);
    };
  }, []);
  async function authenticate(mode, body) {
    const result = await authApi[mode](body);
    saveToken(result.token);
    setUser(result.user);
    setError(null);
    return result.user;
  }
  function logout() {
    saveToken(null);
    setUser(null);
    setError(null);
  }
  return (
    <AuthContext.Provider
      value={{ user, loading, error, restore, authenticate, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
