// ============================================================
//  Mock JWT utility  (Experiment 1.3.1)
//  Builds and verifies a REAL 3-part JWT string, but signs it
//  in the browser. A production app signs on the SERVER, because
//  this secret is visible to anyone who opens DevTools.
// ============================================================

const SECRET = "cu-lab-secret-key";

// ---- base64url encode / decode -----------------------------
const enc = (obj) =>
  btoa(JSON.stringify(obj))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const dec = (str) => {
  let s = str.replace(/-/g, "+").replace(/_/g, "/");
  s += "=".repeat((4 - (s.length % 4)) % 4);
  return JSON.parse(atob(s));
};

// ---- fake HMAC (a simple deterministic hash) ---------------
function sign(data) {
  const input = data + SECRET;
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(16);
}

// ---- 1. CREATE  (server would do this after login) ---------
export function createToken(user, ttlSeconds = 3600) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);

  const payload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    iat: now,             // issued at
    exp: now + ttlSeconds // expires in 1 hour
  };

  const body = enc(header) + "." + enc(payload);
  return body + "." + sign(body);
}

// ---- 2. DECODE  (read claims without checking anything) ----
export function decodeToken(token) {
  try {
    const [h, p] = token.split(".");
    return { header: dec(h), payload: dec(p) };
  } catch {
    return null;
  }
}

// ---- 3. VERIFY  (signature + expiry) -----------------------
export function verifyToken(token) {
  try {
    if (!token) return { valid: false, reason: "No token found" };

    const parts = token.split(".");
    if (parts.length !== 3) return { valid: false, reason: "Malformed token" };

    const [h, p, sig] = parts;

    if (sign(h + "." + p) !== sig)
      return { valid: false, reason: "Signature mismatch - token was tampered with" };

    const payload = dec(p);

    if (payload.exp < Math.floor(Date.now() / 1000))
      return { valid: false, reason: "Token expired" };

    return { valid: true, payload };
  } catch {
    return { valid: false, reason: "Could not parse token" };
  }
}
