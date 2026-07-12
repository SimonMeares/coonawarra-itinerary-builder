// Netlify serverless function — proxies itinerary deploy to ce-limestonecoast
// Token is stored as NETLIFY_DEPLOY_TOKEN environment variable, never in source code
//
// Each itinerary deploys to its own path (/i/{itineraryId}/index.html) instead of
// always overwriting /index.html. Netlify's deploy manifest is exhaustive — any
// path left out of the "files" object is removed from the live site — so every
// deploy first fetches the current file list and merges the new/changed path in,
// rather than sending a single-file manifest that would wipe out every other
// previously shared itinerary.

const SITE_ID = "3278b6b0-6266-4941-b15e-8dc50f6dd5e3";
const ID_PATTERN = /^c_[a-z0-9]+$/i;

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

  let html, fileHash, itineraryId;
  try {
    const body = JSON.parse(event.body);
    html = body.html;
    fileHash = body.fileHash;
    itineraryId = body.itineraryId;
    if (!html || !fileHash || !itineraryId) throw new Error("Missing html, fileHash or itineraryId");
    if (!ID_PATTERN.test(itineraryId)) throw new Error("Invalid itineraryId");
  } catch (e) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: e.message || "Invalid request body" }) };
  }

  const filePath = `/i/${itineraryId}/index.html`;
  const uploadPath = `i/${itineraryId}/index.html`;

  try {
    // Step 0 — fetch the currently live file list so the merged manifest keeps
    // every other already-deployed itinerary path live
    const filesRes = await fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}/files`, {
      headers: { "Authorization": `Bearer ${token}` },
    });
    if (!filesRes.ok) {
      const err = await filesRes.json().catch(() => ({}));
      return { statusCode: 502, headers, body: JSON.stringify({ error: err?.message || `Netlify API error ${filesRes.status}` }) };
    }
    const existingFiles = await filesRes.json();
    const manifest = {};
    if (Array.isArray(existingFiles)) {
      for (const f of existingFiles) {
        if (f?.path) manifest[f.path] = f.sha;
      }
    }
    manifest[filePath] = fileHash;

    // Step 1 — create deploy with the merged file manifest
    const deployRes = await fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}/deploys`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        files: manifest,
        async: false,
      }),
    });

    if (!deployRes.ok) {
      const err = await deployRes.json().catch(() => ({}));
      return { statusCode: 502, headers, body: JSON.stringify({ error: err?.message || `Netlify API error ${deployRes.status}` }) };
    }

    const deploy = await deployRes.json();
    const deployId = deploy.id;

    // Step 2 — only upload our file if Netlify doesn't already have this exact
    // content in storage (i.e. it's listed as "required"). Every other path in
    // the manifest keeps its existing already-stored content untouched.
    const required = Array.isArray(deploy.required) ? deploy.required : null;
    if (required === null || required.includes(fileHash)) {
      const uploadRes = await fetch(`https://api.netlify.com/api/v1/deploys/${deployId}/files/${uploadPath}`, {
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
    }

    // Step 3 — poll until ready (max 30s)
    for (let i = 0; i < 15; i++) {
      await new Promise(r => setTimeout(r, 2000));
      const statusRes = await fetch(`https://api.netlify.com/api/v1/deploys/${deployId}`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const status = await statusRes.json();
      if (status.state === "ready") {
        return { statusCode: 200, headers, body: JSON.stringify({ ok: true, path: filePath }) };
      }
      if (status.state === "error") {
        return { statusCode: 502, headers, body: JSON.stringify({ error: "Deploy failed on Netlify" }) };
      }
    }

    // Timed out polling but deploy probably succeeded
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, path: filePath }) };

  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message || "Unexpected error" }) };
  }
};

