// src/auth.js
//
// Client-side session storage for the itinerary builder's login gate. The
// actual session token is opaque here - verification only ever happens
// server-side (netlify/functions/_lib/auth.js). This just decides whether
// to show the app or the login screen, and attaches the token to outgoing
// requests that need it.
//
// Storage key is independent from the CRM dashboard's ("ce-crm-session-v1")
// - these are two separate sites with two separate sessions, on purpose.

const SESSION_KEY = "ce-itin-session-v1";

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession(token, expiresAt) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ token, expiresAt }));
  } catch {
    // Storage full or unavailable - session just won't persist across reloads.
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // Nothing to do - worst case a stale token stays until it expires server-side.
  }
}

// Local expiry check only, to decide what to render before the first API
// call. The real check is server-side on every request - a locally-"valid"
// but tampered or revoked (SESSION_SECRET rotated) token still gets a 401
// from the functions themselves.
export function isSessionValid() {
  const session = getSession();
  return !!session?.token && !!session?.expiresAt && Date.now() < session.expiresAt;
}

export function authHeader() {
  const session = getSession();
  return session?.token ? { Authorization: `Bearer ${session.token}` } : {};
}
