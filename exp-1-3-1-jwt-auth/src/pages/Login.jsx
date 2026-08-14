import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, error, setError } = useAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit() {
    if (!email || !password) { setError("Please fill in both fields"); return; }
    login(email, password);
  }

  function quickFill(e, p) { setEmail(e); setPassword(p); setError(""); }

  return (
    <div className="center-page">
      <div className="card">
        <h2>Sign in</h2>
        <p className="muted">Experiment 1.3.1 &mdash; JWT authentication</p>

        <label>Email</label>
        <input type="email" value={email} placeholder="admin@app.com"
               onChange={(e) => setEmail(e.target.value)}
               onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />

        <label>Password</label>
        <input type="password" value={password} placeholder="........"
               onChange={(e) => setPassword(e.target.value)}
               onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />

        {error && <p className="error">{error}</p>}

        <button className="btn" onClick={handleSubmit}>Login</button>

        <div className="hint">
          <p className="muted">Test accounts (click to fill):</p>
          <button className="chip" onClick={() => quickFill("admin@app.com", "admin123")}>admin</button>
          <button className="chip" onClick={() => quickFill("editor@app.com", "editor123")}>editor</button>
          <button className="chip" onClick={() => quickFill("viewer@app.com", "viewer123")}>viewer</button>
        </div>
      </div>
    </div>
  );
}
