// netlify/functions/itineraries.js
// Stores per-itinerary CRM metadata (id, status, statusHistory, etc.) via Netlify Blobs,
// keyed by itinerary id, so it's queryable from outside the browser.
//
// GET  ?id=c_xxx                — returns the stored record
// POST { id, ...fields }        — saves/updates the full record
// POST { id, action: "view" }   — idempotent: appends a single "viewed" statusHistory
//                                  entry the first time a shared link is opened

import { getStore } from "@netlify/blobs";

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: HEADERS, body: "" };
  }

  try {
    const store = getStore({
      name: "itineraries",
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_DEPLOY_TOKEN,
    });

    if (event.httpMethod === "GET") {
      const id = event.queryStringParameters?.id;
      if (!id) {
        return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ error: "Missing id" }) };
      }
      const data = await store.get(id, { type: "json" });
      if (!data) {
        return { statusCode: 404, headers: HEADERS, body: JSON.stringify({ error: "Not found" }) };
      }
      return { statusCode: 200, headers: HEADERS, body: JSON.stringify(data) };
    }

    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");
      const id = body.id;
      if (!id) {
        return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ error: "Missing id" }) };
      }

      if (body.action === "view") {
        const existing = await store.get(id, { type: "json" });
        if (!existing) {
          return { statusCode: 404, headers: HEADERS, body: JSON.stringify({ error: "Not found" }) };
        }
        const alreadyViewed = (existing.statusHistory || []).some((h) => h.status === "viewed");
        if (!alreadyViewed) {
          const updated = {
            ...existing,
            statusHistory: [
              ...(existing.statusHistory || []),
              { status: "viewed", date: new Date().toISOString(), source: "crm_share_link" },
            ],
          };
          await store.setJSON(id, updated);
        }
        return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ ok: true }) };
      }

      await store.setJSON(id, body);
      return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ ok: true }) };
    }

    return {
      statusCode: 405,
      headers: HEADERS,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  } catch (e) {
    console.error("[itineraries] error:", e);
    return {
      statusCode: 500,
      headers: HEADERS,
      body: JSON.stringify({ error: e.message }),
    };
  }
};
