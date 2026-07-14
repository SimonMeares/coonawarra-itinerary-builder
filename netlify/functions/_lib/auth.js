// netlify/functions/_lib/auth.js
//
// Auth helper shared by every gated function in this project. Restricted to
// a single whitelisted Google account (WHITELISTED_EMAIL) via Google
// Identity Services (GIS) on the frontend, reusing the same OAuth Client ID
// already used for the Gmail draft-creation popup - one Google Cloud client
// supports both flows, they're just different authorization requests.
//
// Same design as the ce-crm-dashboard sibling project: the GIS ID token
// itself is short-lived (~1hr), so auth-login.js verifies it once against
// Google and mints a longer-lived session token here - a plain HMAC-SHA256
// signature over "email.expiry", signed with SESSION_SECRET. This site's
// SESSION_SECRET is independent from the CRM dashboard's - rotating one
// never invalidates sessions on the other, since they're separate Netlify
// sites with separate env vars.
//
// Kill switch: rotating SESSION_SECRET in Netlify's environment variables
// instantly invalidates every outstanding session and forces re-login.
//
// One deliberate difference from the CRM dashboard: this project has a
// public, unauthenticated caller (the shared itinerary page's view-tracking
// ping in itineraries.js) that must keep working without a session token.
// requireAuth() itself doesn't know about that - each function decides
// which of its own request paths call it, not this helper.

import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// Real access control now happens in requireAuth() below, not CORS - CORS is
// a browser-only mechanism and does nothing against a direct script/curl
// call. This allowlist is just to avoid the wide-open "*" that was here
// before, while still letting the testing alias (a different origin from
// production) work during feature-branch testing without editing this list
// per branch.
const ALLOWED_ORIGINS = [
  "https://coonawarra-itinerary-builder.netlify.app",
  "https://testing--coonawarra-itinerary-builder.netlify.app",
  "http://localhost:5173",
  "http://localhost:8888",
];

function corsHeaders(event) {
  const origin = event.headers?.origin || event.headers?.Origin || "";
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function jsonResponse(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json", ...extraHeaders },
    body: JSON.stringify(body),
  };
}

function getEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set as a Netlify environment variable`);
  return value;
}

// Verifies a Google Identity Services ID token and returns the verified
// email, or throws. Never hand-roll this part - google-auth-library handles
// signature verification against Google's rotating public keys correctly.
async function verifyGoogleIdToken(idToken) {
  const clientId = getEnv("GOOGLE_CLIENT_ID");
  const client = new OAuth2Client(clientId);
  const ticket = await client.verifyIdToken({ idToken, audience: clientId });
  const payload = ticket.getPayload();
  if (!payload || !payload.email_verified || !payload.email) {
    throw new Error("Google ID token missing a verified email");
  }
  return payload.email;
}

function sign(data, secret) {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

// email + expiry, HMAC-signed. Format: base64(email).expiryMs.signatureHex
function mintSessionToken(email) {
  const secret = getEnv("SESSION_SECRET");
  const expiry = Date.now() + SESSION_TTL_MS;
  const payload = `${Buffer.from(email).toString("base64")}.${expiry}`;
  const signature = sign(payload, secret);
  return { token: `${payload}.${signature}`, expiresAt: expiry };
}

// Returns the verified email, or null for anything invalid/expired/malformed.
// Fails closed: any error (bad format, expired, missing secret, mismatched
// signature length) returns null rather than throwing past the caller.
function verifySessionToken(token) {
  try {
    const secret = getEnv("SESSION_SECRET");
    const parts = (token || "").split(".");
    if (parts.length !== 3) return null;
    const [emailB64, expiryStr, signatureHex] = parts;
    const payload = `${emailB64}.${expiryStr}`;
    const expected = sign(payload, secret);

    // timingSafeEqual throws on mismatched buffer lengths rather than
    // returning false - check lengths first so a garbage/truncated
    // signature is a clean "invalid", not an uncaught exception.
    const expectedBuf = Buffer.from(expected, "hex");
    const actualBuf = Buffer.from(signatureHex, "hex");
    if (expectedBuf.length !== actualBuf.length) return null;
    if (!crypto.timingSafeEqual(expectedBuf, actualBuf)) return null;

    const expiry = Number(expiryStr);
    if (!Number.isFinite(expiry) || Date.now() > expiry) return null;

    return Buffer.from(emailB64, "base64").toString("utf8");
  } catch {
    return null;
  }
}

// Call as the first line of any handler path that needs to be gated.
// Returns { ok: true, email } on success, or { ok: false, response } with a
// ready-made 401 to return immediately. Fails closed on every path - a
// misconfigured SESSION_SECRET results in a 401, never in silently skipping
// the check.
function requireAuth(event) {
  try {
    const header = event.headers?.authorization || event.headers?.Authorization || "";
    const match = /^Bearer\s+(.+)$/i.exec(header);
    const token = match ? match[1] : null;
    const email = token ? verifySessionToken(token) : null;

    if (!email || email !== getEnv("WHITELISTED_EMAIL")) {
      return { ok: false, response: jsonResponse(401, { error: "unauthorized" }, corsHeaders(event)) };
    }
    return { ok: true, email };
  } catch {
    return { ok: false, response: jsonResponse(401, { error: "unauthorized" }, corsHeaders(event)) };
  }
}

export { jsonResponse, corsHeaders, verifyGoogleIdToken, mintSessionToken, verifySessionToken, requireAuth };
