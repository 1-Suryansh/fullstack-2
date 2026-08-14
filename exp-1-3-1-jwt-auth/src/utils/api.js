// ============================================================
//  Mock API layer (Experiment 1.3.1 - "attach token to requests")
//  Shows the Authorization: Bearer <token> header, then fakes
//  what a real server would do with it.
// ============================================================
import { verifyToken } from "./jwt";

export async function callProtectedApi(url, token) {
  // This is exactly the header a real request would carry:
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };

  // --- pretend server side ---------------------------------
  await new Promise((r) => setTimeout(r, 300)); // fake network delay

  const incoming = headers.Authorization?.replace("Bearer ", "");
  const result = verifyToken(incoming);

  if (!result.valid) {
    return { status: 401, url, sentHeaders: headers, body: { error: result.reason } };
  }

  return {
    status: 200,
    url,
    sentHeaders: headers,
    body: { message: "Access granted", user: result.payload.name, role: result.payload.role },
  };
}
