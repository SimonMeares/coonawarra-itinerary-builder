// src/Login.jsx
//
// Google Identity Services "Sign In With Google" gate. Restricted
// server-side to a single whitelisted account (see
// netlify/functions/auth-login.js) - this component just renders the
// button and exchanges the resulting ID token for this app's own session
// token.
//
// Client ID is not a secret - it's meant to be public. This is the same
// OAuth client already used by this app's own Gmail draft integration
// (GMAIL_CLIENT_ID in App.jsx), reused here for a plain login gate rather
// than provisioning a new Google Cloud project. Same pattern as the CRM
// dashboard's Login.jsx, kept as a separate independent session.
import { useEffect, useRef, useState } from "react";
import { setSession } from "./auth";

const GOOGLE_CLIENT_ID = "427243151278-h7m87oo8fqogkoljga3el1empqkn0c06.apps.googleusercontent.com";
const GIS_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

const NAVY = "#192957";
const SAND_LIGHT = "#f0ead8";
const TERRA = "#d34727";
const GREY600 = "#5c5a54";
const HEADING_FONT = "'Cabin','Arial Black',sans-serif";
const BODY_FONT = "'Source Sans 3','Source Sans Pro','Open Sans',sans-serif";

function loadGisScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }
    const existing = document.querySelector(`script[src="${GIS_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", reject);
      return;
    }
    const script = document.createElement("script");
    script.src = GIS_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default function Login({ onSignedIn }) {
  const buttonRef = useRef(null);
  const [error, setError] = useState(null);
  const [exchanging, setExchanging] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function handleCredential(response) {
      setExchanging(true);
      setError(null);
      try {
        const res = await fetch("/.netlify/functions/auth-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: response.credential }),
        });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(
            body.error === "unauthorized"
              ? "That Google account isn't authorised for this app."
              : body.error || "Sign-in failed."
          );
        }
        setSession(body.token, body.expiresAt);
        onSignedIn();
      } catch (err) {
        setError(err.message || "Sign-in failed.");
      } finally {
        setExchanging(false);
      }
    }

    loadGisScript()
      .then(() => {
        if (cancelled) return;
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredential,
        });
        if (buttonRef.current) {
          window.google.accounts.id.renderButton(buttonRef.current, {
            theme: "outline",
            size: "large",
            text: "signin_with",
          });
        }
      })
      .catch(() => {
        if (!cancelled) setError("Could not load Google Sign-In. Check your connection and reload.");
      });

    return () => {
      cancelled = true;
    };
  }, [onSignedIn]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: SAND_LIGHT, fontFamily: BODY_FONT }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: "40px 36px", maxWidth: 380, width: "90%", textAlign: "center", boxShadow: "0 4px 24px rgba(25,41,87,0.12)" }}>
        <h1 style={{ fontFamily: HEADING_FONT, color: NAVY, fontSize: 22, margin: "0 0 4px" }}>Itinerary Builder</h1>
        <div style={{ color: GREY600, fontSize: 13, marginBottom: 20 }}>Coonawarra Experiences</div>
        <p style={{ color: GREY600, fontSize: 13, marginBottom: 20 }}>Sign in with the Coonawarra Experiences Google account.</p>
        <div ref={buttonRef} style={{ display: "flex", justifyContent: "center" }} />
        {exchanging && <div style={{ color: GREY600, fontSize: 12, marginTop: 12 }}>Signing in…</div>}
        {error && <div style={{ color: TERRA, fontSize: 12, marginTop: 12 }}>{error}</div>}
      </div>
    </div>
  );
}
