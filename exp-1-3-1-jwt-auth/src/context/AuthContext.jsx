// ============================================================
//  EXPERIMENT 1.3.1 - Authentication state
//  Holds the token, verifies it, exposes login / logout.
//  No roles or permissions here - that is Experiment 1.3.2.
// ============================================================
import { createContext, useContext, useState, useEffect } from "react";
import { createToken, verifyToken } from "../utils/jwt";
import { USERS } from "../data/users";

const AuthContext = createContext(null);
const STORAGE_KEY = "jwt_auth_token";

export function AuthProvider({ children }) {
  const [token, setToken]     = useState(() => localStorage.getItem(STORAGE_KEY));
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  // Runs on first load and whenever the token changes.
  // This is what makes the session survive a page refresh.
  useEffect(() => {
    if (!token) { setUser(null); setLoading(false); return; }

    const result = verifyToken(token);

    if (result.valid) {
      setUser(result.payload);          // user data comes FROM the token
    } else {
      localStorage.removeItem(STORAGE_KEY);
      setToken(null);
      setUser(null);
      setError(result.reason);
    }
    setLoading(false);
  }, [token]);

  function login(email, password) {
    const found = USERS.find(
      (u) => u.email === email.trim().toLowerCase() && u.password === password
    );
    if (!found) { setError("Invalid email or password"); return false; }

    const newToken = createToken(found);      // a server would do this
    localStorage.setItem(STORAGE_KEY, newToken);
    setToken(newToken);
    setError("");
    return true;
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, logout, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
