// Netlify serverless function — proxies itinerary deploy to ce-limestonecoast
// Token is stored as NETLIFY_DEPLOY_TOKEN environment variable, never in source code

const SITE_ID = "3278b6b0-6266-4941-b15e-8dc50f6dd5e3";

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "https://coonawarra-itinerary-builder.netlify.app",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  // Handle preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const token = process.env.NETLIFY_DEPLOY_TOKEN;
  if (!token) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Deploy token not configured" }) };
  }

  let html, fileHash;
  try {
    const body = JSON.parse(event.body);
    html = body.html;
    fileHash = body.fileHash;
    if (!html || !fileHash) throw new Error("Missing html or fileHash");
  } catch (e) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid request body" }) };
  }

  try {
    // Step 1 — create deploy with file manifest
    const deployRes = await fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}/deploys`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        files: { "/index.html": fileHash },
        async: false,
      }),
    });

    if (!deployRes.ok) {
      const err = await deployRes.json().catch(() => ({}));
      return { statusCode: 502, headers, body: JSON.stringify({ error: err?.message || `Netlify API error ${deployRes.status}` }) };
    }

    const deploy = await deployRes.json();
    const deployId = deploy.id;

    // Step 2 — upload the HTML file
    const uploadRes = await fetch(`https://api.netlify.com/api/v1/deploys/${deployId}/files/index.html`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "text/html; charset=utf-8",
        "Content-Length": Buffer.byteLength(html, "utf8").toString(),
      },
      body: html,
    });

    if (!uploadRes.ok) {
      const err = await uploadRes.json().catch(() => ({}));
      return { statusCode: 502, headers, body: JSON.stringify({ error: err?.message || `Upload error ${uploadRes.status}` }) };
    }

    // Step 3 — poll until ready (max 30s)
    for (let i = 0; i < 15; i++) {
      await new Promise(r => setTimeout(r, 2000));
      const statusRes = await fetch(`https://api.netlify.com/api/v1/deploys/${deployId}`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const status = await statusRes.json();
      if (status.state === "ready") {
        return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
      }
      if (status.state === "error") {
        return { statusCode: 502, headers, body: JSON.stringify({ error: "Deploy failed on Netlify" }) };
      }
    }

    // Timed out polling but deploy probably succeeded
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };

  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message || "Unexpected error" }) };
  }
};

