// scripts/test-company-matching.mjs
//
// One-off local test for the new findTradeContact() matching logic in
// itineraries.js - run against real Notion data to confirm a known clean
// single-match case still links, and a known ambiguous case stays unlinked.
// Not part of the deployed app; NOTION_API_KEY is passed in via env var at
// run time, never hardcoded or persisted here.
//
//   NOTION_API_KEY=... node scripts/test-company-matching.mjs

import { Client } from "@notionhq/client";

const TRADE_CRM_DATA_SOURCE_ID = "e97769c1-f2d3-41fb-9100-813d4d50fb15";
const COMPANIES_DATA_SOURCE_ID = "24050576-1a17-4f72-abca-efbb56fd9c63";

async function findTradeContact(notion, agentName) {
  if (!agentName) return null;
  const normalized = agentName.trim().toLowerCase();
  if (!normalized) return null;
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
    if (companyMatches.length !== 1) return { outcome: "unlinked", reason: `${companyMatches.length} company matches` };

    const contactIds = (companyMatches[0].properties?.Contacts?.relation || []).map((r) => r.id);
    if (contactIds.length === 0) return { outcome: "unlinked", reason: "company has no linked contacts" };
    if (contactIds.length === 1) return { outcome: "linked", contactId: contactIds[0] };

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
      ? { outcome: "linked", contactId: primaryRes.results[0].id }
      : { outcome: "unlinked", reason: `${contactIds.length} contacts, ${primaryRes.results.length} marked primary` };
  } catch (e) {
    return { outcome: "error", reason: e.message };
  }
}

async function main() {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });

  const cases = [
    { label: "Clean single-match", agentName: "58 Stars Travel" },
    { label: "Ambiguous (multi-contact, no clear primary)", agentName: "Internova Travel  Group" },
    { label: "No match at all", agentName: "Definitely Not A Real Company Xyz" },
  ];

  for (const c of cases) {
    const result = await findTradeContact(notion, c.agentName);
    console.log(`${c.label} ("${c.agentName}"):`, JSON.stringify(result));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
