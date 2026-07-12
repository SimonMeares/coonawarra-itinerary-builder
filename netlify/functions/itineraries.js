// netlify/functions/itineraries.js
// Stores per-itinerary CRM metadata (id, status, statusHistory, etc.) via Netlify Blobs,
// keyed by itinerary id, so it's queryable from outside the browser. For trade itineraries
// (agentName present), also syncs CRM events into the CE Follow-Up Tasks Notion database.
//
// GET  ?id=c_xxx                — returns the stored record
// POST { id, ...fields }        — saves/updates the full record (merged with what's stored)
// POST { id, action: "view" }   — idempotent: appends a single "viewed" statusHistory
//                                  entry the first time a shared link is opened

import { getStore } from "@netlify/blobs";
import { Client } from "@notionhq/client";

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

// CE Follow-Up Tasks and CE Trade CRM data source IDs (Notion's multi-source database model).
const FOLLOWUP_TASKS_DATA_SOURCE_ID = "f9336682-821d-471e-8a42-b1aae7592783";
const TRADE_CRM_DATA_SOURCE_ID = "e97769c1-f2d3-41fb-9100-813d4d50fb15";

function notionClient() {
  if (!process.env.NOTION_API_KEY) return null;
  return new Client({ auth: process.env.NOTION_API_KEY });
}

function addBusinessDays(from, days) {
  const d = new Date(from);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return d.toISOString().slice(0, 10);
}

// Only links the Contact relation on an unambiguous single match — never guesses.
async function findTradeContact(notion, company) {
  if (!company) return null;
  try {
    const res = await notion.dataSources.query({
      data_source_id: TRADE_CRM_DATA_SOURCE_ID,
      filter: { property: "Company", rich_text: { equals: company } },
      page_size: 2,
    });
    return res.results.length === 1 ? res.results[0].id : null;
  } catch (e) {
    console.error("[itineraries] Notion contact lookup failed:", e);
    return null;
  }
}

async function createFollowUpTask(notion, { task, category, contactPageId, note, dueDate }) {
  try {
    const properties = {
      Task: { title: [{ text: { content: task } }] },
      Category: { select: { name: category } },
      Status: { select: { name: "Open" } },
      Note: { rich_text: [{ text: { content: note } }] },
      "Due Date": { date: { start: dueDate } },
    };
    if (contactPageId) {
      properties.Contact = { relation: [{ id: contactPageId }] };
    }
    await notion.pages.create({
      parent: { type: "data_source_id", data_source_id: FOLLOWUP_TASKS_DATA_SOURCE_ID },
      properties,
    });
  } catch (e) {
    console.error("[itineraries] Notion task creation failed:", e);
  }
}

// Trade itineraries only — guest-direct itineraries (no agentName) are skipped entirely.
// Never throws: a Notion outage or bad token must not block the Blobs write.
async function syncFollowUpTask(itinerary, { category, taskLabel }) {
  if (!itinerary.agentName) return;
  const notion = notionClient();
  if (!notion) return;
  try {
    const contactPageId = await findTradeContact(notion, itinerary.agentName);
    const note = [
      itinerary.agentRef ? `Agent ref: ${itinerary.agentRef}` : null,
      itinerary.ceRef ? `CE ref: ${itinerary.ceRef}` : null,
      itinerary.liveUrl || null,
    ].filter(Boolean).join(" · ");
    await createFollowUpTask(notion, {
      task: `${itinerary.agentName} — ${taskLabel}: ${itinerary.title || "Itinerary"}`,
      category,
      contactPageId,
      note,
      dueDate: addBusinessDays(new Date(), 5),
    });
  } catch (e) {
    console.error("[itineraries] Notion sync failed:", e);
  }
}

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
          await syncFollowUpTask(updated, { category: "Quote Pending", taskLabel: "itinerary viewed" });
        }
        return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ ok: true }) };
      }

      const existing = await store.get(id, { type: "json" });
      const statusChanged = existing && existing.status !== body.status;
      const isTrackedTransition = body.status === "review" || body.status === "published";
      if (statusChanged && isTrackedTransition) {
        await syncFollowUpTask(body, {
          category: "General Check-in",
          taskLabel: body.status === "published" ? "itinerary published" : "itinerary in review",
        });
      }

      // Merge rather than overwrite — callers (e.g. a status-only update) may not know
      // every field already stored, such as liveUrl from a previous deploy.
      await store.setJSON(id, { ...(existing || {}), ...body });
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
