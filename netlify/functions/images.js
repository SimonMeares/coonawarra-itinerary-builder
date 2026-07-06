// netlify/functions/images.js
// Stores and retrieves the product image URL map via Netlify Blobs.
// The app calls GET on load and POST on every image change.

const { getStore } = require("@netlify/blobs");

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: HEADERS, body: "" };
  }

  try {
    const store = getStore({ name: "product-images", consistency: "strong" });

    if (event.httpMethod === "GET") {
      const data = await store.get("image-map", { type: "json" });
      return {
        statusCode: 200,
        headers: HEADERS,
        body: JSON.stringify(data || {}),
      };
    }

    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");
      await store.setJSON("image-map", body);
      return {
        statusCode: 200,
        headers: HEADERS,
        body: JSON.stringify({ ok: true }),
      };
    }

    return {
      statusCode: 405,
      headers: HEADERS,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  } catch (e) {
    console.error("[images] error:", e);
    return {
      statusCode: 500,
      headers: HEADERS,
      body: JSON.stringify({ error: e.message }),
    };
  }
};
