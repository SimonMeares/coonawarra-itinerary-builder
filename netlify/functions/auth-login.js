// netlify/functions/auth-login.js
//
// POST { idToken }  ->  { token, expiresAt }  on success, 401 on anything else
//
// Exchanges a Google Identity Services ID token (from the frontend's
// "Sign In With Google" button) for this app's own longer-lived session
// token. No Notion/Blobs/deploy access here - this function's only job is
// the exchange, same separation of concerns as the CRM dashboard's
// equivalent.

import { verifyGoogleIdToken, mintSessionToken, jsonResponse } from "./_lib/auth.js";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed." });
  }

  let idToken;
  try {
    idToken = JSON.parse(event.body || "{}").idToken;
  } catch {
    return jsonResponse(400, { error: "Invalid JSON body." });
  }
  if (!idToken) {
    return jsonResponse(400, { error: "idToken is required." });
  }

  try {
    const email = await verifyGoogleIdToken(idToken);
    if (email !== process.env.WHITELISTED_EMAIL) {
      return jsonResponse(401, { error: "unauthorized" });
    }
    const { token, expiresAt } = mintSessionToken(email);
    return jsonResponse(200, { token, expiresAt });
  } catch {
    // Never leak whether the failure was a bad token, wrong email, or a
    // Google API error - all of these are just "unauthorized" to the caller.
    return jsonResponse(401, { error: "unauthorized" });
  }
};
