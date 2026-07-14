// netlify/functions/itineraries.js
// Stores per-itinerary CRM metadata (id, status, statusHistory, etc.) via Netlify Blobs,
// keyed by itinerary id, so it's queryable from outside the browser. For trade itineraries
// (agentName present), also syncs CRM events into the CE Follow-Up Tasks Notion database.
//
// GET  ?id=c_xxx                — returns the stored record. Requires a session - only
//                                  the builder app reads this today.
// POST { id, ...fields }        — saves/updates the full record (merged with what's
//                                  stored). Requires a session - only the builder app
//                                  writes full records.
// POST { id, action: "view" }   — idempotent: appends a single "viewed" statusHistory
//                                  entry the first time a shared link is opened. Stays
//                                  UNAUTHENTICATED on purpose - this is called from the
//                                  publicly shared itinerary HTML page itself (see
//                                  generateOfflineHTML() in src/App.jsx), fired by
//                                  whichever guest or trade contact opens their link, who
//                                  was never meant to log in at all. It's narrow by
//                                  design: it can only append a timestamp to an id that
//                                  already exists, never create a record or set arbitrary
//                                  fields, and now validates the id shape below.
//
// Previously GET and the full-record POST had no auth check at all - anyone with an
// itinerary id (inherently "known" since it's in a shareable link) could read the full
// CRM record, or overwrite it with arbitrary fields, including spoofing a status change
// that writes a real Follow-Up Task into the live Notion CRM.

import { getStore } from "@netlify/blobs";
import { Client } from "@notionhq/client";
import { requireAuth, corsHeaders } from "./_lib/auth.js";

const ID_PATTERN = /^c_[a-z0-9]+$/i;

// CE Follow-Up Tasks, CE Trade CRM and CE Companies data source IDs (Notion's multi-source database model).
const FOLLOWUP_TASKS_DATA_SOURCE_ID = "f9336682-821d-471e-8a42-b1aae7592783";
const TRADE_CRM_DATA_SOURCE_ID = "e97769c1-f2d3-41fb-9100-813d4d50fb15";
const COMPANIES_DATA_SOURCE_ID = "24050576-1a17-4f72-abca-efbb56fd9c63";

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

// Resolves agentName to a CE Trade CRM contact via CE Companies - the real
// canonical parent layer - rather than matching CE Trade CRM's free-text
// "Company" field directly (the original stopgap, before CE Companies
// existed). Two steps, each with its own unambiguous-match-only discipline:
//
//   1. Find the CE Companies record whose Company Name exactly matches
//      agentName (case/whitespace-normalized). Zero or multiple matches ->
//      unlinked. Notion's title filter is case-sensitive, so this
//      pre-filters broadly with "contains" and compares normalized values
//      client-side, same technique the old version used.
//   2. Follow that company's Contacts relation. One linked contact -> use
//      it. Zero -> unlinked (company exists but has no contact yet). More
//      than one -> only link if exactly one of them is marked Primary
//      Contact - a real ambiguous case (e.g. a company with several trade
//      contacts and no primary set) stays unlinked rather than guessing.
// Returns { contactId, debug } rather than just an id-or-null - debug
// explains *why* nothing linked, surfaced up into the API response (see
// syncFollowUpTask/handler) so that's diagnosable without server logs,
// same reasoning as syncResult below.
async function findTradeContact(notion, agentName) {
  if (!agentName) return { contactId: null, debug: "no agentName" };
  const normalized = agentName.trim().toLowerCase();
  if (!normalized) return { contactId: null, debug: "blank agentName" };
  try {
    const companyRes = await notion.dataSources.query({
      data_source_id: COMPANIES_DATA_SOURCE_ID,
      filter: { property: "Company Name", title: { contains: agentName.trim() } },
      page_size: 10,
    });
    const companyMatches = companyRes.results.filter((page) => {
      const value = (page.properties?.["Company Name"]?.title || []).map((t) => t.plain_text).join("");
      return value.trim().toLowerCase() === normalized;
    });
    if (companyMatches.length !== 1) {
      return { contactId: null, debug: `${companyMatches.length} company matches for "${agentName}"` };
    }

    const contactIds = (companyMatches[0].properties?.Contacts?.relation || []).map((r) => r.id);
    if (contactIds.length === 0) return { contactId: null, debug: "company matched, no linked contacts" };
    if (contactIds.length === 1) return { contactId: contactIds[0], debug: "single linked contact" };

    const primaryRes = await notion.dataSources.query({
      data_source_id: TRADE_CRM_DATA_SOURCE_ID,
      filter: {
        and: [
          { property: "Company Record", relation: { contains: companyMatches[0].id } },
          { property: "Primary Contact", checkbox: { equals: true } },
        ],
      },
      page_size: 2,
    });
    return primaryRes.results.length === 1
      ? { contactId: primaryRes.results[0].id, debug: "primary contact among multiple" }
      : { contactId: null, debug: `${contactIds.length} contacts, ${primaryRes.results.length} marked primary` };
  } catch (e) {
    console.error("[itineraries] Notion company/contact lookup failed:", e);
    return { contactId: null, debug: `error: ${e.message}` };
  }
}

// Returns { ok: true, taskId } or { ok: false, error }. The caller decides
// whether to surface this - never let a Notion failure block the itinerary
// itself from saving, but don't just swallow it into a server log either
// (this whole flow used to do exactly that, which made a real Notion
// permission gap indistinguishable from "nothing to sync" from the outside).
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
    const page = await notion.pages.create({
      parent: { type: "data_source_id", data_source_id: FOLLOWUP_TASKS_DATA_SOURCE_ID },
      properties,
    });
    return { ok: true, taskId: page.id };
  } catch (e) {
    console.error("[itineraries] Notion task creation failed:", e);
    return { ok: false, error: e.message };
  }
}

// Trade itineraries only — guest-direct itineraries (no agentName) are skipped entirely.
// crmSync===false is an explicit per-itinerary opt-out (defaults to on/undefined).
// Never throws: a Notion outage or bad token must not block the Blobs write.
// Returns a small result object describing what happened, so the caller can
// surface it in the response body rather than only a server log neither of
// us can read after the fact.
async function syncFollowUpTask(itinerary, { category, taskLabel }) {
  if (!itinerary.agentName) return { ok: false, error: "no agentName - guest itinerary, skipped" };
  if (itinerary.crmSync === false) return { ok: false, error: "crmSync explicitly disabled for this itinerary" };
  const notion = notionClient();
  if (!notion) return { ok: false, error: "NOTION_API_KEY not set" };
  try {
    const { contactId: contactPageId, debug: contactDebug } = await findTradeContact(notion, itinerary.agentName);
    const note = [
      itinerary.agentRef ? `Agent ref: ${itinerary.agentRef}` : null,
      itinerary.ceRef ? `CE ref: ${itinerary.ceRef}` : null,
      itinerary.liveUrl || null,
    ].filter(Boolean).join(" · ");
    const result = await createFollowUpTask(notion, {
      task: `${itinerary.agentName} — ${taskLabel}: ${itinerary.title || "Itinerary"}`,
      category,
      contactPageId,
      note,
      dueDate: addBusinessDays(new Date(), 5),
    });
    return { ...result, contactLinked: !!contactPageId, contactDebug };
  } catch (e) {
    console.error("[itineraries] Notion sync failed:", e);
    return { ok: false, error: e.message };
  }
}

export const handler = async (event) => {
  const HEADERS = { "Content-Type": "application/json", ...corsHeaders(event) };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: HEADERS, body: "" };
  }

  // The view-tracking POST below is the one deliberately public path - every
  // other request needs a session. Checked here (before touching the body)
  // for GET; the POST case is decided per-action further down, since we
  // need to see body.action first.
  if (event.httpMethod === "GET") {
    const auth = requireAuth(event);
    if (!auth.ok) return auth.response;
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
        // Deliberately unauthenticated - see the file-level comment. Kept as
        // narrow as possible: the id must look like a real itinerary id, and
        // this can only append a "viewed" entry to a record that already
        // exists - it cannot create a record or touch any other field.
        if (!ID_PATTERN.test(id)) {
          return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ error: "Invalid id" }) };
        }
        const existing = await store.get(id, { type: "json" });
        if (!existing) {
          return { statusCode: 404, headers: HEADERS, body: JSON.stringify({ error: "Not found" }) };
        }
        const alreadyViewed = (existing.statusHistory || []).some((h) => h.status === "viewed");
        let syncResult = alreadyViewed ? { ok: false, error: "already viewed - not re-synced" } : undefined;
        if (!alreadyViewed) {
          const updated = {
            ...existing,
            statusHistory: [
              ...(existing.statusHistory || []),
              { status: "viewed", date: new Date().toISOString(), source: "crm_share_link" },
            ],
          };
          await store.setJSON(id, updated);
          syncResult = await syncFollowUpTask(updated, { category: "Quote Pending", taskLabel: "itinerary viewed" });
        }
        // syncResult is included so a Notion sync failure is visible in the
        // response itself, not just a server log - see syncFollowUpTask.
        return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ ok: true, syncResult }) };
      }

      // Every other POST (saving/updating the full record) requires a
      // session - only the builder app does this.
      const auth = requireAuth(event);
      if (!auth.ok) return auth.response;

      const existing = await store.get(id, { type: "json" });

      // The editor auto-saves frequently and fires a network request on
      // each one - nothing guarantees those requests arrive in the order
      // they were sent. Without this guard, a late-arriving request from an
      // *earlier* save (carrying whatever was on the form at that moment,
      // e.g. a field the guest hadn't filled in yet) can land after a more
      // recent one and silently overwrite good data with stale/blank
      // values - this is exactly how agentName has been going missing.
      // updatedAt is refreshed on every local edit (see mutate() in
      // App.jsx) and sent with every sync, so it's a reliable ordering key:
      // if this request is older than what's already stored, a newer save
      // has already landed - drop this one rather than clobber it.
      if (existing?.updatedAt && body.updatedAt && new Date(body.updatedAt) < new Date(existing.updatedAt)) {
        return {
          statusCode: 200,
          headers: HEADERS,
          body: JSON.stringify({ ok: true, skipped: "stale write - a more recent save is already stored" }),
        };
      }

      const statusChanged = existing && existing.status !== body.status;
      const isTrackedTransition = body.status === "review" || body.status === "published";
      let syncResult;
      if (statusChanged && isTrackedTransition) {
        syncResult = await syncFollowUpTask(body, {
          category: "General Check-in",
          taskLabel: body.status === "published" ? "itinerary published" : "itinerary in review",
        });
      }

      // Merge rather than overwrite — callers (e.g. a status-only update) may not know
      // every field already stored, such as liveUrl from a previous deploy.
      await store.setJSON(id, { ...(existing || {}), ...body });
      return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ ok: true, syncResult }) };
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
