// netlify/functions/data.js
// Universal persistent storage for the itinerary builder.
// Handles: itineraries, custom-products, templates, partner-logos
// Usage: GET /.netlify/functions/data?key=itineraries
//        POST /.netlify/functions/data?key=itineraries  (body: JSON)

import { getStore } from "@netlify/blobs";

const ALLOWED = ["itineraries", "custom-products", "templates", "partner-logos"];

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: HEADERS, body: "" };
  }

  const key = event.queryStringParameters?.key;
  if (!key || !ALLOWED.includes(key)) {
    return {
      statusCode: 400,
      headers: HEADERS,
      body: JSON.stringify({ error: "Invalid key. Must be one of: " + ALLOWED.join(", ") }),
    };
  }

  try {
    const store = getStore({
      name: "builder-data",
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_DEPLOY_TOKEN,
    });

    if (event.httpMethod === "GET") {
      const data = await store.get(key, { type: "json" });
      return {
        statusCode: 200,
        headers: HEADERS,
        body: JSON.stringify(data ?? null),
      };
    }

    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "null");
      if (body === null) {
        return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ error: "Empty body" }) };
      }
      await store.setJSON(key, body);
      return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 405, headers: HEADERS, body: JSON.stringify({ error: "Method not allowed" }) };
  } catch (e) {
    console.error("[data] error:", e);
    return {
      statusCode: 500,
      headers: HEADERS,
      body: JSON.stringify({ error: e.message }),
    };
  }
};
