import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { decodeToken } from "../utils/jwt";
import { callProtectedApi } from "../utils/api";

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const decoded = decodeToken(token);
  const [apiLog, setApiLog] = useState(null);

  const expiry = new Date(decoded.payload.exp * 1000).toLocaleTimeString();

  async function testApi() {
    setApiLog(await callProtectedApi("/api/profile", token));
  }

  return (
    <div className="page">
      <div className="navbar" style={{ borderRadius: 14, marginBottom: 20 }}>
        <strong>Experiment 1.3.1 &mdash; JWT Authentication</strong>
        <div className="nav-user">
          <span>{user.name}</span>
          <button className="btn-ghost" onClick={logout}>Logout</button>
        </div>
      </div>

      <h2>You are signed in</h2>
      <p className="muted">
        Nothing below came from a server. It was all decoded out of the token string.
      </p>

      <div className="card">
        <h3>1. Header &mdash; which algorithm signed it</h3>
        <pre>{JSON.stringify(decoded?.header, null, 2)}</pre>
      </div>

      <div className="card">
        <h3>2. Payload &mdash; the claims about you</h3>
        <pre>{JSON.stringify(decoded?.payload, null, 2)}</pre>
        <p className="muted">This token stops being accepted at {expiry}.</p>
      </div>

      <div className="card">
        <h3>3. Raw token in localStorage</h3>
        <p className="token">{token}</p>
        <p className="muted">
          Two dots split it into header . payload . signature.
          Paste it into jwt.io to see the same three parts.
        </p>
      </div>

      <div className="card">
        <h3>Sending the token with a request</h3>
        <button className="btn-sm" onClick={testApi}>Call protected API</button>
        {apiLog && <pre>{JSON.stringify(apiLog, null, 2)}</pre>}
        <p className="muted">Look for the Authorization: Bearer header in the output.</p>
      </div>
    </div>
  );
}
