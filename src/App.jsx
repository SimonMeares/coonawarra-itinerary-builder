import { useState, useRef } from "react";

// ─── Brand tokens ────────────────────────────────────────────────────────────
const C = {
  navy:       "#192957",
  sand:       "#d8c69d",
  teal:       "#40c0c0",
  terra:      "#d34727",
  navyLight:  "#243a73",
  sandLight:  "#f0ead8",
  sandDark:   "#b8a678",
  white:      "#ffffff",
  offWhite:   "#faf9f6",
  grey100:    "#f4f3f0",
  grey200:    "#e8e6e0",
  grey400:    "#9e9b92",
  grey600:    "#5c5a54",
  grey800:    "#2e2d29",
  text:       "#1a1917",
};

const F = {
  heading: "'Cabin', 'Arial Black', sans-serif",
  serif:   "'PT Serif', Georgia, serif",
  body:    "'Source Sans 3', 'Source Sans Pro', 'Open Sans', sans-serif",
};

// ─── Product data ─────────────────────────────────────────────────────────────
const SEASON = {
  label: "Season 2027 / 2028",
  valid: "1 April 2027 – 31 March 2028",
};

const PRODUCTS = [
  // DAY TOURS
  {
    id: "p-uncle-ken",
    rezdy: "UNCLEKEN",
    category: "Day Tours",
    name: "On Country with Uncle Ken",
    subtitle: "Private cultural experience · Port MacDonnell",
    type: "private",
    duration: "3.5 hrs + coastal lunch",
    schedule: null,
    departures: "On request",
    location: "Port MacDonnell",
    minGuests: 2,
    maxGuests: null,
    partner: "Bush Adventures",
    pricing: {
      structure: "per_adult",
      tiers: [{ label: "Per adult", retail: 1295 }],
      note: "On request",
    },
    tags: ["Indigenous", "Cultural", "Wildlife", "Coastal"],
    description:
      "A private cultural experience with Uncle Ken Jones, NAIDOC Elder and proud Boandik man, on his saltwater Country. Stories, songs and a lifetime of knowledge, shared first-hand by a man who has spent more than fifty years as a wildlife officer and conservationist on this coastline. Afterwards, a secluded beach luncheon — deck chairs in the sand, fresh Southern Rock Lobster with crusty bread and a chilled Coonawarra Riesling.",
    inclusions: [
      "Private guided walk on Boandik Country with Uncle Ken Jones",
      "Stories, songs and cultural knowledge of the land and sea",
      "Coastal luncheon at a secluded beach",
      "Fresh Southern Rock Lobster with crusty bread and lemon",
      "Chilled Coonawarra Riesling",
      "Premium transport, driven by your hosts",
      "Pick-up and drop-off, Penola / Coonawarra region",
    ],
  },
  {
    id: "p-caves-cabernet",
    rezdy: "PGXR9D",
    category: "Day Tours",
    name: "Caves, Cabernet & Kangaroos",
    subtitle: "Full day private tour · Min 2 / Max 4",
    type: "private",
    duration: "8 hrs",
    schedule: "9:00 – 17:00",
    departures: "Daily",
    location: "Naracoorte · Coonawarra · Penola",
    minGuests: 2,
    maxGuests: 4,
    pricing: {
      structure: "per_adult",
      tiers: [{ label: "Per adult", retail: 715 }],
      note: null,
    },
    tags: ["Caves", "Wine", "Wildlife", "Olive Oil"],
    description:
      "A full day that takes in the best of the Limestone Coast — ancient caves, celebrated wine country, a boutique olive grove and a private kangaroo sanctuary not open to the public. From the UNESCO World Heritage–listed Naracoorte Caves to a shared table lunch at one of our favourite venues, every stop is guided in person by your hosts.",
    inclusions: [
      "UNESCO World Heritage–listed Naracoorte Caves exploration",
      "Locally sourced produce luncheon at one of the region's best venues",
      "Icon wine tasting at Wynns Coonawarra Estate",
      "Boutique olive oil tasting at a local grove",
      "Private kangaroo sanctuary visit, not open to the public",
      "Premium transport, driven by your hosts",
      "Pick-up and drop-off, Penola / Coonawarra region",
      "All tasting and entry fees included",
    ],
  },
  {
    id: "p-heritage-treasures",
    rezdy: "PLVMQJ",
    category: "Day Tours",
    name: "Heritage & Hidden Treasures",
    subtitle: "Naracoorte Caves & Yallum Park · Min 2 / Max 4",
    type: "private",
    duration: "8 hrs",
    schedule: "9:00 – 17:00",
    departures: "Daily",
    location: "Naracoorte · Penola",
    minGuests: 2,
    maxGuests: 4,
    pricing: {
      structure: "tiered_per_person_by_group",
      tiers: [
        { label: "2 guests", pax: 2, retail: 795 },
        { label: "3 guests", pax: 3, retail: 695 },
        { label: "4 guests", pax: 4, retail: 595 },
      ],
      note: "Per person, priced by group size",
    },
    tags: ["Caves", "Heritage", "History"],
    description:
      "A private day built around two of the region's most compelling stories — the deep prehistory of the Naracoorte Caves and the social history of Yallum Park Mansion, one of Australia's best-preserved period homes. A dedicated 3.5-hour private multi-cave tour, followed by a set-menu lunch and a guided tour through rooms that once defined colonial life on the Limestone Coast.",
    inclusions: [
      "Private 3.5-hour multi-cave tour, UNESCO World Heritage–listed Naracoorte Caves",
      "Set-menu seasonal luncheon at one of the region's best venues",
      "Private guided tour of Yallum Park Mansion",
      "Premium transport and return transfers, driven by your hosts",
      "All entry and tasting fees included",
    ],
  },
  {
    id: "p-immerse-day",
    rezdy: "PFLB9E",
    category: "Day Tours",
    name: "Immerse Yourself in Coonawarra",
    subtitle: "Full day private wine tour · Min 2 / Max 6",
    type: "private",
    duration: "6.5 hrs",
    schedule: "10:30 – 17:00",
    departures: "Daily",
    location: "Coonawarra · Penola",
    minGuests: 2,
    maxGuests: 6,
    pricing: {
      structure: "per_adult",
      tiers: [{ label: "Per adult", retail: 395 }],
      note: null,
    },
    tags: ["Wine", "Cellar Door", "Dining"],
    description:
      "A privately hosted full day among Coonawarra's finest cellar doors, guided throughout by Simon and Kerry. Personalised tastings with the region's favourite winemakers, a set-menu lunch at one of the region's best venues, and the kind of behind-the-scenes access that only comes from knowing these people well.",
    inclusions: [
      "Wine tastings at the best cellar doors in Coonawarra",
      "Personalised experiences with the region's favourite winemakers",
      "Set-menu seasonal luncheon at one of the region's best venues",
      "Premium transport, driven by your hosts",
      "Pick-up and drop-off, Penola / Coonawarra accommodation",
      "All tasting fees included",
    ],
  },
  {
    id: "p-unearthed",
    rezdy: "PTGHJM",
    category: "Day Tours",
    name: "Coonawarra Unearthed",
    subtitle: "Full day small-group wine tour · Min 2 / Max 10",
    type: "small_group",
    duration: "6 hrs",
    schedule: "11:00 – 17:00",
    departures: "Daily",
    location: "Coonawarra · Penola",
    minGuests: 2,
    maxGuests: 10,
    pricing: {
      structure: "per_adult",
      tiers: [{ label: "Per adult", retail: 215 }],
      note: null,
    },
    tags: ["Wine", "Cellar Door", "Small Group"],
    description:
      "Our flagship small-group wine day — the best way to discover Coonawarra's cellar doors in good company. A full day of tastings at the region's top producers, a sumptuous produce platter and a glass of wine at an iconic winery, all driven by your hosts.",
    inclusions: [
      "Wine tastings at the best cellar doors in Coonawarra",
      "Sumptuous produce platter with a glass of wine at an iconic winery",
      "Premium transport, driven by your hosts",
      "Pick-up and drop-off, Penola / Coonawarra accommodation",
      "All tasting fees included",
    ],
  },
  {
    id: "p-highlights",
    rezdy: "PBBRC2",
    category: "Day Tours",
    name: "Coonawarra Highlights",
    subtitle: "Half day small-group wine tour · Min 2 / Max 10",
    type: "small_group",
    duration: "4.5 hrs",
    schedule: "12:30 – 17:00",
    departures: "Daily",
    location: "Coonawarra · Penola",
    minGuests: 2,
    maxGuests: 10,
    pricing: {
      structure: "per_adult",
      tiers: [{ label: "Per adult", retail: 185 }],
      note: null,
    },
    tags: ["Wine", "Cellar Door", "Half Day", "Small Group"],
    description:
      "A relaxed afternoon introduction to Coonawarra's cellar doors — ideal for guests arriving late morning or those who want a gentler taste of the region. Tastings at the best cellar doors, a produce platter and a glass of wine at an iconic winery.",
    inclusions: [
      "Wine tastings at the best cellar doors in Coonawarra",
      "Sumptuous produce platter with a glass of wine at an iconic winery",
      "Premium transport, driven by your hosts",
      "Pick-up and drop-off, Penola / Coonawarra accommodation",
      "All tasting fees included",
    ],
  },
  // STAY & TOUR PACKAGES
  {
    id: "p-warrawindi-escape",
    rezdy: "PTG4V2",
    category: "Stay & Tour Packages",
    name: "A Warrawindi Escape",
    subtitle: "Luxury off-grid retreat & private touring · 2 Nights · Penola",
    type: "private",
    duration: "2 Nights · 1 Day",
    departures: "On request",
    location: "Penola · Limestone Coast",
    accommodation: "Blue Wren Retreat, Warrawindi Escapes",
    minGuests: 2,
    maxGuests: 2,
    pricing: {
      structure: "per_couple",
      tiers: [{ label: "Per couple", retail: 3975 }],
      note: "On request",
    },
    tags: ["Stay & Tour", "Off-Grid", "Farm", "Wildlife"],
    description:
      "Two nights at the architecturally designed Blue Wren Retreat on a 3,000-acre private sustainable farm, paired with a fully hosted day across the Limestone Coast. Cedar hot tub, open fireplace, sweeping bushland views and complete seclusion.",
    inclusions: [
      "Two nights at the Blue Wren Retreat, architecturally designed off-grid luxury",
      "Cedar hot tub, open fireplace and sweeping bushland views",
      "Premium Coonawarra wine and chocolate on arrival",
      "Generous breakfast provisions throughout your stay",
      "Freshly prepared roast dinner delivered to your retreat one evening",
      "Privately hosted full-day tour, UNESCO Naracoorte Caves and premium Coonawarra tastings",
      "Regional produce luncheon",
      "Boutique olive grove tasting",
      "Private kangaroo sanctuary encounter",
    ],
  },
  {
    id: "p-wagyu-wine-stay",
    rezdy: "PYVHSJ",
    category: "Stay & Tour Packages",
    name: "Wagyu, Wine & Stay",
    subtitle: "Mayura Steakhouse dining · Penola apartment · Hosted Coonawarra tour",
    type: "private",
    duration: "2 Nights · 2 Days",
    departures: "Wed–Sun",
    location: "Penola · Coonawarra",
    accommodation: "Coonawarra Experiences Apartment, Penola",
    minGuests: 2,
    maxGuests: 2,
    pricing: {
      structure: "per_couple",
      tiers: [{ label: "Per couple", retail: 1990 }],
      note: "Adults only · Min/Max 2 · Dining Thu, Fri & Sat",
    },
    tags: ["Stay & Tour", "Wagyu", "Dining", "Wine"],
    description:
      "Two nights in the heart of Penola, a five-course Wagyu degustation at the Mayura chef's table with matched museum-release wines, and a fully hosted day through Coonawarra's best cellar doors.",
    inclusions: [
      "Two nights at the Coonawarra Experiences Apartment, Penola",
      "Queen bedroom, living area and bathroom with underfloor heating",
      "Continental breakfast provisions, wine and chocolate on arrival",
      "Mayura Wagyu Steakhouse chef's table — five-course Wagyu degustation with matched museum-release wines",
      "Fully hosted wine tour, exclusive tastings at 4–5 premium cellar doors",
      "Hearty produce platter and exclusive Wynns Coonawarra Estate visit",
    ],
  },
  {
    id: "p-grand-style",
    rezdy: "PVKWQL",
    category: "Stay & Tour Packages",
    name: "A Stay in Grand Style",
    subtitle: "Delgattie Estate · Period manor & private touring · 2 Nights · Mount Gambier",
    type: "private",
    duration: "2 Nights · 1 Day",
    departures: "On request",
    location: "Mount Gambier · Coonawarra",
    accommodation: "Delgattie Estate, Mount Gambier",
    minGuests: 2,
    maxGuests: null,
    pricing: {
      structure: "per_couple",
      tiers: [{ label: "Per couple", retail: 1850 }],
      note: "On request · Three state rooms available",
    },
    tags: ["Stay & Tour", "Heritage", "History", "Wine"],
    description:
      "Two nights at Delgattie Estate, a beautifully restored 1902 manor in the heart of Mount Gambier, paired with a full private day among Coonawarra's most celebrated cellar doors.",
    inclusions: [
      "Two nights at Delgattie Estate, your choice of three state rooms",
      "Delgattie sparkling wine on arrival",
      "Breakfast at the Commodore Restaurant on site",
      "Private full-day Coonawarra tour, personalised tastings at the region's top cellar doors",
      "Icon wines and behind-the-scenes access at Wynns Coonawarra Estate",
      "Seasonal set-menu luncheon",
      "Private kangaroo sanctuary visit",
    ],
  },
  {
    id: "p-arthurs",
    rezdy: "ARTHURS",
    category: "Stay & Tour Packages",
    name: "Arthur's on Commercial",
    subtitle: "Luxury Mount Gambier stay & private Coonawarra touring · 2–8 guests",
    type: "private",
    duration: "2 Nights · 1 Day",
    departures: "On request",
    location: "Mount Gambier · Coonawarra",
    accommodation: "Arthur's on Commercial, Mount Gambier",
    minGuests: 2,
    maxGuests: 8,
    pricing: {
      structure: "tiered_per_couple_by_group",
      tiers: [
        { label: "2 guests", pax: 2, retail: 2650 },
        { label: "4 guests", pax: 4, retail: 1790 },
        { label: "6 guests", pax: 6, retail: 1545 },
        { label: "8 guests", pax: 8, retail: 1395 },
      ],
      note: "Per couple, priced by group size",
    },
    tags: ["Stay & Tour", "Group", "Wine"],
    description:
      "Mount Gambier's newest luxury residence — four suites across two living spaces, with cafes, markets and theatre at the door — paired with a full private day touring Coonawarra, scaled for groups of two to eight.",
    inclusions: [
      "Two nights at Arthur's on Commercial, four suites and two living spaces",
      "Cafes, markets and theatre within walking distance",
      "Full private day touring Coonawarra, personalised tastings at the region's top cellar doors",
      "Private transfers to and from Mount Gambier throughout the day",
      "Set-menu luncheon at one of the region's best venues",
      "Privately hosted icon wine tasting at Wynns Coonawarra Estate",
    ],
  },
  {
    id: "p-immerse-package",
    rezdy: "PEB4NQ",
    category: "Stay & Tour Packages",
    name: "Immerse Yourself in Coonawarra",
    subtitle: "Stay & tour · 2 Nights · Penola",
    type: "private",
    duration: "2 Nights · 1 Day",
    departures: "Daily · On request",
    location: "Penola · Coonawarra",
    accommodation: "Coonawarra Experiences Apartment, Penola",
    minGuests: 2,
    maxGuests: null,
    pricing: {
      structure: "per_couple",
      tiers: [{ label: "Per couple", retail: 945 }],
      note: null,
    },
    tags: ["Stay & Tour", "Wine", "Cellar Door"],
    description:
      "Two nights in the heart of Penola paired with a fully hosted day of the region's finest cellar doors — our most accessible stay-and-tour package.",
    inclusions: [
      "Two nights at the Coonawarra Experiences Apartment, Penola",
      "Queen bedroom, living area and bathroom with underfloor heating",
      "Continental breakfast provisions, wine and chocolate on arrival",
      "Fully hosted wine tour, exclusive tastings at 4–5 premium cellar doors",
      "Hearty produce platter through the day",
      "Exclusive visit to Wynns Coonawarra Estate, private cellar walking tour",
    ],
  },
  // TRANSFERS & JOURNEYS
  {
    id: "p-great-ocean-road",
    rezdy: null,
    category: "Transfers & Journeys",
    name: "The Great Ocean Road",
    subtitle: "Fully hosted Melbourne to Coonawarra · 2 Days · 1 Night en route",
    type: "private",
    duration: "2 Days · 1 Night en route",
    departures: "On request",
    location: "Melbourne → Coonawarra",
    vehicle: "Toyota LandCruiser 300 Series",
    minGuests: 2,
    maxGuests: null,
    pricing: {
      structure: "on_request",
      tiers: [],
      note: "Price on request · Fully bespoke",
    },
    tags: ["Transfer", "Great Ocean Road", "Victoria", "Hosted Journey"],
    description:
      "An unhurried, fully hosted journey from your Melbourne doorstep to the Limestone Coast — two days along Australia's most spectacular coastline in our Toyota LandCruiser 300 Series, arriving in Coonawarra ready to begin your wine-country experience. Door-to-door, nothing to arrange in between.",
    inclusions: [
      "Door-to-door collection from Melbourne accommodation in the LandCruiser 300",
      "Two days of fully hosted private touring along the Great Ocean Road",
      "Torquay and Bells Beach, the Otways, wild koalas at Kennett River",
      "Cape Otway Lightstation and Maits Rest rainforest walk",
      "The Twelve Apostles, Gibson Steps and Loch Ard Gorge",
      "Historic Port Fairy and Portland, then into South Australia",
      "Overnight accommodation en route, tailored to your guests",
      "Seamless arrival into Coonawarra",
    ],
  },
  // EXPERIENCE COMPONENTS
  {
    id: "p-mayura",
    rezdy: null,
    category: "Experience Components",
    name: "Mayura Wagyu Steakhouse",
    subtitle: "Chef's table degustation · Penola",
    type: "component",
    duration: null,
    departures: "Thu–Sat (private on request)",
    location: "Penola",
    minGuests: null,
    maxGuests: null,
    pricing: { structure: "component", tiers: [], note: "Priced as part of a package or on application" },
    tags: ["Wagyu", "Dining", "Chef's Table", "Degustation"],
    description:
      "An exclusive chef's table degustation at Mayura Station's celebrated steakhouse — full-blood Wagyu across multiple cuts and courses, matched with regional wines. The steakhouse can be opened exclusively for your guests on request.",
    inclusions: [
      "Private chef's table degustation, full-blood Wagyu",
      "Matched regional wines",
      "Exclusive venue hire available on request",
    ],
  },
  {
    id: "p-wynns",
    rezdy: null,
    category: "Experience Components",
    name: "Wynns Coonawarra Estate — Icon Tasting",
    subtitle: "VIP private tasting · Historic 1896 Gables winery",
    type: "component",
    duration: null,
    departures: null,
    location: "Coonawarra",
    minGuests: null,
    maxGuests: null,
    pricing: { structure: "component", tiers: [], note: "Included in most day tours and packages" },
    tags: ["Wine", "Cellar Door", "Icon", "Coonawarra"],
    description:
      "A VIP private tasting inside the historic 1896 Gables winery — icon and museum wines, barrel samples and a vineyard walk. The kind of access that comes from a long-standing relationship with one of Coonawarra's most celebrated estates.",
    inclusions: [
      "Private tasting of icon and museum-release wines",
      "Barrel samples and behind-the-scenes access",
      "Guided vineyard walk",
    ],
  },
  {
    id: "p-kangaroo-sanctuary",
    rezdy: null,
    category: "Experience Components",
    name: "Private Kangaroo Sanctuary",
    subtitle: "Not open to the public",
    type: "component",
    duration: null,
    departures: null,
    location: "Limestone Coast",
    minGuests: null,
    maxGuests: null,
    pricing: { structure: "component", tiers: [], note: "Included in select tours and packages" },
    tags: ["Wildlife", "Kangaroos", "Private", "Nature"],
    description:
      "A private kangaroo sanctuary not open to the public — an intimate encounter with rescued and resident kangaroos in a relaxed, unhurried setting.",
    inclusions: [
      "Private access to the kangaroo sanctuary",
      "Hosted encounter with resident kangaroos",
      "Exclusive to Coonawarra Experiences guests",
    ],
  },
  {
    id: "p-blue-wren",
    rezdy: null,
    category: "Experience Components",
    name: "Blue Wren Retreat — Warrawindi Escapes",
    subtitle: "Off-grid luxury · 3,000-acre sustainable farm · Penola",
    type: "component",
    duration: null,
    departures: "On request",
    location: "Penola",
    minGuests: null,
    maxGuests: null,
    pricing: { structure: "component", tiers: [], note: "Included in A Warrawindi Escape package or on application" },
    tags: ["Accommodation", "Off-Grid", "Farm", "Retreat"],
    description:
      "Architecturally designed off-grid luxury on a 3,000-acre working sustainable farm. Cedar hot tub, open fireplace and sweeping bushland views. Farm-style hospitality from the Warrawindi family.",
    inclusions: [
      "Architecturally designed off-grid retreat",
      "Cedar hot tub and open fireplace",
      "Sweeping bushland views across the property",
      "Welcome wine and provisions on arrival",
    ],
  },
  {
    id: "p-ottelia",
    rezdy: null,
    category: "Experience Components",
    name: "Ottelia",
    subtitle: "Seasonal dining · Coonawarra",
    type: "component",
    duration: null,
    departures: null,
    location: "Coonawarra",
    minGuests: null,
    maxGuests: null,
    pricing: { structure: "component", tiers: [], note: "Included in select tours and packages" },
    tags: ["Dining", "Seasonal", "Wine"],
    description:
      "One of Coonawarra's most celebrated dining experiences — a seasonal menu built around the region's finest produce, set within the Leconfield / Richard Hamilton cellar door.",
    inclusions: [
      "Seasonal set-menu or à la carte dining",
      "Matched Coonawarra wine list",
    ],
  },
  {
    id: "p-confido",
    rezdy: null,
    category: "Experience Components",
    name: "Confido Olive Oil",
    subtitle: "Boutique olive grove tasting · Coonawarra",
    type: "component",
    duration: null,
    departures: null,
    location: "Coonawarra",
    minGuests: null,
    maxGuests: null,
    pricing: { structure: "component", tiers: [], note: "Included in select tours and packages" },
    tags: ["Olive Oil", "Produce", "Artisan"],
    description:
      "A boutique olive oil experience with the makers at Confido — freshly pressed extra virgin olive oil, tasted straight from the grove, with the story of how a small Coonawarra property became one of Australia's most recognised olive oil producers.",
    inclusions: [
      "Hosted olive oil tasting with the producers",
      "Story of the Confido grove and production process",
      "Freshly pressed extra virgin olive oil",
    ],
  },
];

const CATEGORIES = ["All", "Day Tours", "Stay & Tour Packages", "Transfers & Journeys", "Experience Components"];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatPrice(pricing) {
  if (pricing.structure === "on_request") return "Price on request";
  if (pricing.structure === "component") return "See package";
  if (pricing.structure === "per_adult") {
    return `$${pricing.tiers[0].retail.toLocaleString()} per adult`;
  }
  if (pricing.structure === "per_couple") {
    return `$${pricing.tiers[0].retail.toLocaleString()} per couple`;
  }
  if (pricing.structure === "tiered_per_person_by_group") {
    const low = pricing.tiers[pricing.tiers.length - 1].retail;
    const high = pricing.tiers[0].retail;
    return `$${low}–$${high} per person`;
  }
  if (pricing.structure === "tiered_per_couple_by_group") {
    const low = pricing.tiers[pricing.tiers.length - 1].retail;
    const high = pricing.tiers[0].retail;
    return `$${low}–$${high} per couple`;
  }
  return "";
}

function typeBadge(type) {
  const map = {
    private: { label: "Private", color: C.navy },
    small_group: { label: "Small Group", color: C.teal },
    component: { label: "Component", color: C.grey400 },
  };
  return map[type] || { label: type, color: C.grey400 };
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const S = {
  app: {
    minHeight: "100vh",
    background: C.offWhite,
    fontFamily: F.body,
    color: C.text,
  },
  // Header
  header: {
    background: C.navy,
    padding: "0",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 12px rgba(25,41,87,0.18)",
  },
  headerInner: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: "14px 28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${C.teal} 0%, ${C.terra} 100%)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoText: {
    fontFamily: F.heading,
    fontSize: 15,
    fontWeight: 700,
    color: C.white,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    lineHeight: 1.1,
  },
  logoSub: {
    fontFamily: F.body,
    fontSize: 10,
    color: C.sand,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginTop: 1,
  },
  headerNav: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  navTab: (active) => ({
    fontFamily: F.body,
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    color: active ? C.white : "rgba(255,255,255,0.6)",
    background: active ? "rgba(255,255,255,0.12)" : "transparent",
    border: "none",
    borderRadius: 6,
    padding: "7px 14px",
    cursor: "pointer",
    letterSpacing: "0.02em",
    transition: "all 0.15s",
  }),
  // Internal toggle
  toggleWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "7px 14px",
    background: "rgba(255,255,255,0.07)",
    borderRadius: 6,
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.12)",
  },
  toggleTrack: (on) => ({
    width: 32,
    height: 18,
    borderRadius: 9,
    background: on ? C.teal : "rgba(255,255,255,0.2)",
    position: "relative",
    transition: "background 0.2s",
    flexShrink: 0,
  }),
  toggleThumb: (on) => ({
    position: "absolute",
    top: 2,
    left: on ? 14 : 2,
    width: 14,
    height: 14,
    borderRadius: "50%",
    background: C.white,
    transition: "left 0.2s",
  }),
  toggleLabel: {
    fontFamily: F.body,
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    letterSpacing: "0.04em",
    userSelect: "none",
  },
  // Season banner
  seasonBanner: {
    background: C.sand,
    borderBottom: `1px solid ${C.sandDark}`,
    padding: "7px 28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  seasonText: {
    fontFamily: F.body,
    fontSize: 12,
    color: C.navy,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontWeight: 600,
  },
  seasonValid: {
    fontFamily: F.body,
    fontSize: 12,
    color: C.grey600,
    letterSpacing: "0.04em",
  },
  // Layout
  layout: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: "24px 28px 60px",
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    gap: 28,
    alignItems: "start",
  },
  // Sidebar
  sidebar: {
    position: "sticky",
    top: 80,
  },
  sidebarSection: {
    background: C.white,
    border: `1px solid ${C.grey200}`,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 16,
  },
  sidebarTitle: {
    fontFamily: F.heading,
    fontSize: 11,
    fontWeight: 700,
    color: C.grey400,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    padding: "12px 16px 8px",
    borderBottom: `1px solid ${C.grey100}`,
  },
  catBtn: (active) => ({
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "9px 16px",
    fontFamily: F.body,
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    color: active ? C.navy : C.grey600,
    background: active ? C.sandLight : "transparent",
    border: "none",
    borderLeft: active ? `3px solid ${C.terra}` : "3px solid transparent",
    cursor: "pointer",
    transition: "all 0.12s",
  }),
  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "9px 12px",
    fontFamily: F.body,
    fontSize: 13,
    color: C.text,
    background: C.white,
    border: `1px solid ${C.grey200}`,
    borderRadius: 8,
    outline: "none",
    marginBottom: 16,
  },
  // Product grid
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: 20,
  },
  // Product card
  card: (selected) => ({
    background: C.white,
    border: `2px solid ${selected ? C.teal : C.grey200}`,
    borderRadius: 10,
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.15s",
    boxShadow: selected ? `0 0 0 3px ${C.teal}22` : "0 1px 4px rgba(0,0,0,0.06)",
    position: "relative",
  }),
  cardHeader: {
    background: C.navy,
    padding: "14px 16px 12px",
  },
  cardCategory: {
    fontFamily: F.body,
    fontSize: 10,
    color: C.sand,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  cardName: {
    fontFamily: F.heading,
    fontSize: 15,
    fontWeight: 700,
    color: C.white,
    lineHeight: 1.25,
    letterSpacing: "0.01em",
  },
  cardSubtitle: {
    fontFamily: F.body,
    fontSize: 11,
    color: "rgba(216,198,157,0.8)",
    marginTop: 3,
    lineHeight: 1.3,
  },
  cardBody: {
    padding: "12px 16px",
  },
  cardMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  metaPill: (color) => ({
    fontFamily: F.body,
    fontSize: 10,
    fontWeight: 600,
    color: color || C.navy,
    background: color ? `${color}18` : C.sandLight,
    border: `1px solid ${color ? `${color}30` : C.sandDark}`,
    borderRadius: 20,
    padding: "2px 8px",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  }),
  cardPrice: {
    fontFamily: F.heading,
    fontSize: 16,
    fontWeight: 700,
    color: C.terra,
    marginBottom: 6,
  },
  cardPriceNote: {
    fontFamily: F.body,
    fontSize: 11,
    color: C.grey400,
    marginTop: -4,
    marginBottom: 8,
  },
  cardDesc: {
    fontFamily: F.body,
    fontSize: 12,
    color: C.grey600,
    lineHeight: 1.55,
    marginBottom: 10,
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  // Tiered pricing
  tierTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: 10,
    fontSize: 12,
  },
  tierRow: {
    borderBottom: `1px solid ${C.grey100}`,
  },
  tierLabel: {
    padding: "4px 0",
    color: C.grey600,
    fontFamily: F.body,
  },
  tierPrice: {
    padding: "4px 0",
    color: C.terra,
    fontFamily: F.heading,
    fontWeight: 700,
    textAlign: "right",
  },
  // Inclusions
  incList: {
    listStyle: "none",
    padding: 0,
    margin: "8px 0 0",
  },
  incItem: {
    fontFamily: F.body,
    fontSize: 11,
    color: C.grey600,
    padding: "3px 0 3px 14px",
    position: "relative",
    lineHeight: 1.4,
  },
  incDot: {
    position: "absolute",
    left: 0,
    top: 7,
    width: 5,
    height: 1,
    background: C.sand,
  },
  // Internal badge
  rezdyBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    fontFamily: F.body,
    fontSize: 10,
    fontWeight: 600,
    color: C.grey400,
    background: C.grey100,
    border: `1px solid ${C.grey200}`,
    borderRadius: 4,
    padding: "2px 7px",
    letterSpacing: "0.06em",
    marginTop: 8,
  },
  rezdyDot: {
    width: 5,
    height: 5,
    borderRadius: "50%",
    background: C.grey400,
  },
  // Season badge on card
  seasonBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    fontFamily: F.body,
    fontSize: 10,
    color: C.teal,
    background: `${C.teal}12`,
    border: `1px solid ${C.teal}30`,
    borderRadius: 4,
    padding: "2px 7px",
    letterSpacing: "0.04em",
    marginTop: 6,
  },
  // Selected indicator
  selectedCheck: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: "50%",
    background: C.teal,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: C.white,
    fontSize: 12,
    fontWeight: 700,
  },
  // Stats bar
  statsBar: {
    background: C.white,
    border: `1px solid ${C.grey200}`,
    borderRadius: 10,
    padding: "10px 16px",
    marginBottom: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  statItem: {
    textAlign: "center",
  },
  statNum: {
    fontFamily: F.heading,
    fontSize: 20,
    fontWeight: 700,
    color: C.navy,
    lineHeight: 1,
  },
  statLabel: {
    fontFamily: F.body,
    fontSize: 10,
    color: C.grey400,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    background: C.grey200,
  },
  clearBtn: {
    fontFamily: F.body,
    fontSize: 12,
    color: C.terra,
    background: "transparent",
    border: `1px solid ${C.terra}40`,
    borderRadius: 6,
    padding: "5px 12px",
    cursor: "pointer",
  },
  // Empty state
  emptyState: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "60px 20px",
    color: C.grey400,
    fontFamily: F.body,
    fontSize: 14,
  },
  // Print button
  printBtn: {
    fontFamily: F.heading,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: C.white,
    background: C.terra,
    border: "none",
    borderRadius: 6,
    padding: "8px 16px",
    cursor: "pointer",
  },
};

// ─── Price display component ─────────────────────────────────────────────────
function PriceDisplay({ pricing }) {
  const { structure, tiers, note } = pricing;
  if (structure === "on_request") {
    return (
      <div>
        <div style={S.cardPrice}>Price on request</div>
        {note && <div style={S.cardPriceNote}>{note}</div>}
      </div>
    );
  }
  if (structure === "component") {
    return (
      <div>
        <div style={{ ...S.cardPrice, color: C.grey400, fontSize: 13 }}>Component pricing</div>
        {note && <div style={S.cardPriceNote}>{note}</div>}
      </div>
    );
  }
  if (structure === "tiered_per_person_by_group" || structure === "tiered_per_couple_by_group") {
    const unit = structure === "tiered_per_couple_by_group" ? "per couple" : "per person";
    return (
      <div>
        <table style={S.tierTable}>
          <tbody>
            {tiers.map((t) => (
              <tr key={t.label} style={S.tierRow}>
                <td style={S.tierLabel}>{t.label}</td>
                <td style={S.tierPrice}>${t.retail.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={S.cardPriceNote}>{note || unit}</div>
      </div>
    );
  }
  return (
    <div>
      <div style={S.cardPrice}>
        ${tiers[0]?.retail?.toLocaleString()}
        <span style={{ fontFamily: F.body, fontSize: 12, fontWeight: 400, color: C.grey400, marginLeft: 4 }}>
          {structure === "per_couple" ? "per couple" : "per adult"}
        </span>
      </div>
      {note && <div style={S.cardPriceNote}>{note}</div>}
    </div>
  );
}

// ─── Product card ────────────────────────────────────────────────────────────
function ProductCard({ product, selected, onToggle, showInternal }) {
  const badge = typeBadge(product.type);
  return (
    <div style={S.card(selected)} onClick={() => onToggle(product.id)}>
      {selected && <div style={S.selectedCheck}>✓</div>}
      <div style={S.cardHeader}>
        <div style={S.cardCategory}>{product.category}</div>
        <div style={S.cardName}>{product.name}</div>
        {product.subtitle && <div style={S.cardSubtitle}>{product.subtitle}</div>}
      </div>
      <div style={S.cardBody}>
        {/* Meta pills */}
        <div style={S.cardMeta}>
          <span style={S.metaPill(badge.color)}>{badge.label}</span>
          {product.duration && <span style={S.metaPill()}>{product.duration}</span>}
          {product.departures && <span style={S.metaPill()}>{product.departures}</span>}
          {product.partner && (
            <span style={S.metaPill(C.teal)}>via {product.partner}</span>
          )}
        </div>
        {/* Tags */}
        {product.tags && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
            {product.tags.map((t) => (
              <span key={t} style={{ ...S.metaPill(C.grey400), fontSize: 9, background: C.grey100 }}>{t}</span>
            ))}
          </div>
        )}
        {/* Price */}
        <PriceDisplay pricing={product.pricing} />
        {/* Description */}
        <div style={S.cardDesc}>{product.description}</div>
        {/* Inclusions */}
        {product.inclusions?.length > 0 && (
          <ul style={S.incList}>
            {product.inclusions.map((inc, i) => (
              <li key={i} style={S.incItem}>
                <span style={S.incDot} />
                {inc}
              </li>
            ))}
          </ul>
        )}
        {/* Season validity */}
        <div style={S.seasonBadge}>
          <span>◆</span>
          <span>{SEASON.valid}</span>
        </div>
        {/* Internal: Rezdy code */}
        {showInternal && product.rezdy && (
          <div style={S.rezdyBadge}>
            <span style={S.rezdyDot} />
            <span>Rezdy: {product.rezdy}</span>
          </div>
        )}
        {showInternal && !product.rezdy && (
          <div style={{ ...S.rezdyBadge, color: C.grey200, borderColor: C.grey100 }}>
            <span>No Rezdy code</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main app ────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("library");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [showInternal, setShowInternal] = useState(false);
  const printRef = useRef(null);

  // Filter products
  const filtered = PRODUCTS.filter((p) => {
    const catMatch = selectedCategory === "All" || p.category === selectedCategory;
    const searchMatch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
      (showInternal && p.rezdy?.toLowerCase().includes(search.toLowerCase()));
    return catMatch && searchMatch;
  });

  const selectedProducts = PRODUCTS.filter((p) => selectedIds.includes(p.id));

  function toggleProduct(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handlePrint() {
    window.print();
  }

  // Category counts
  const catCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = cat === "All"
      ? PRODUCTS.length
      : PRODUCTS.filter((p) => p.category === cat).length;
    return acc;
  }, {});

  return (
    <div style={S.app}>
      {/* Print styles injected */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cabin:wght@400;600;700&family=PT+Serif:ital@0;1&family=Source+Sans+3:wght@300;400;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }

        @media print {
          body { background: white; }
          .no-print { display: none !important; }
          .print-card {
            break-inside: avoid;
            page-break-inside: avoid;
            border: 1px solid #e8e6e0 !important;
            box-shadow: none !important;
            margin-bottom: 16px;
          }
          .print-header {
            background: #192957 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          @page {
            margin: 16mm;
            size: A4;
          }
        }
      `}</style>

      {/* Header */}
      <header style={S.header} className="no-print">
        <div style={S.headerInner}>
          <div style={S.headerLeft}>
            <div style={S.logoMark}>
              <span style={{ color: C.white, fontSize: 16, fontWeight: 700 }}>CE</span>
            </div>
            <div>
              <div style={S.logoText}>Coonawarra Experiences</div>
              <div style={S.logoSub}>Itinerary Builder · {SEASON.label}</div>
            </div>
          </div>
          <div style={S.headerNav}>
            {[
              { key: "library", label: "Product Library" },
              { key: "selected", label: `Selected (${selectedIds.length})` },
            ].map(({ key, label }) => (
              <button key={key} style={S.navTab(tab === key)} onClick={() => setTab(key)}>
                {label}
              </button>
            ))}
            {/* Internal toggle */}
            <div
              style={S.toggleWrap}
              onClick={() => setShowInternal((v) => !v)}
              role="button"
              title="Show internal fields (Rezdy codes)"
            >
              <div style={S.toggleTrack(showInternal)}>
                <div style={S.toggleThumb(showInternal)} />
              </div>
              <span style={S.toggleLabel}>Internal</span>
            </div>
            <button style={S.printBtn} onClick={handlePrint}>
              Print / PDF
            </button>
          </div>
        </div>
      </header>

      {/* Season banner */}
      <div style={S.seasonBanner} className="no-print">
        <span style={S.seasonText}>{SEASON.label}</span>
        <span style={S.seasonValid}>Valid {SEASON.valid} · AUD incl. 10% GST · All rates retail pricing</span>
      </div>

      {/* Main layout */}
      <div style={S.layout}>
        {/* Sidebar */}
        <aside style={S.sidebar} className="no-print">
          {/* Search */}
          <input
            style={S.searchInput}
            placeholder="Search products, tags, descriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Categories */}
          <div style={S.sidebarSection}>
            <div style={S.sidebarTitle}>Categories</div>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                style={S.catBtn(selectedCategory === cat)}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
                <span style={{ float: "right", color: C.grey400, fontWeight: 400 }}>
                  {catCounts[cat]}
                </span>
              </button>
            ))}
          </div>

          {/* Stats */}
          {selectedIds.length > 0 && (
            <div style={S.sidebarSection}>
              <div style={S.sidebarTitle}>Selection</div>
              <div style={{ padding: "12px 16px" }}>
                <div style={{ fontFamily: F.body, fontSize: 13, color: C.navy, marginBottom: 6 }}>
                  <strong>{selectedIds.length}</strong> product{selectedIds.length !== 1 ? "s" : ""} selected
                </div>
                {selectedProducts.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      fontFamily: F.body,
                      fontSize: 12,
                      color: C.grey600,
                      padding: "3px 0",
                      borderBottom: `1px solid ${C.grey100}`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ flex: 1, paddingRight: 8 }}>{p.name}</span>
                    <button
                      onClick={() => toggleProduct(p.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: C.terra,
                        cursor: "pointer",
                        fontSize: 14,
                        fontWeight: 700,
                        padding: "0 2px",
                        flexShrink: 0,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  style={{ ...S.clearBtn, marginTop: 10, display: "block", width: "100%" }}
                  onClick={() => setSelectedIds([])}
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* Main content */}
        <main>
          {tab === "library" && (
            <>
              {/* Stats bar */}
              <div style={S.statsBar} className="no-print">
                <div style={S.statItem}>
                  <div style={S.statNum}>{filtered.length}</div>
                  <div style={S.statLabel}>Showing</div>
                </div>
                <div style={S.statDivider} />
                <div style={S.statItem}>
                  <div style={S.statNum}>{PRODUCTS.length}</div>
                  <div style={S.statLabel}>Total products</div>
                </div>
                <div style={S.statDivider} />
                <div style={S.statItem}>
                  <div style={S.statNum}>{selectedIds.length}</div>
                  <div style={S.statLabel}>Selected</div>
                </div>
                <div style={S.statDivider} />
                <div style={{ fontFamily: F.body, fontSize: 12, color: C.grey400 }}>
                  {showInternal ? (
                    <span style={{ color: C.teal, fontWeight: 600 }}>Internal view on</span>
                  ) : (
                    "Client-facing view"
                  )}
                </div>
              </div>

              {/* Product grid */}
              <div style={S.grid}>
                {filtered.length === 0 ? (
                  <div style={S.emptyState}>
                    No products match your search.
                  </div>
                ) : (
                  filtered.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      selected={selectedIds.includes(product.id)}
                      onToggle={toggleProduct}
                      showInternal={showInternal}
                    />
                  ))
                )}
              </div>
            </>
          )}

          {tab === "selected" && (
            <>
              {selectedIds.length === 0 ? (
                <div style={{ ...S.emptyState, background: C.white, border: `1px solid ${C.grey200}`, borderRadius: 10, padding: 60 }}>
                  <div style={{ fontFamily: F.heading, fontSize: 18, color: C.navy, marginBottom: 8 }}>
                    No products selected
                  </div>
                  <div style={{ color: C.grey400, fontSize: 13 }}>
                    Go to the Product Library and click any card to add it to your selection.
                  </div>
                  <button
                    style={{ ...S.navTab(true), marginTop: 16, background: C.navy, color: C.white, borderRadius: 6, padding: "8px 20px" }}
                    onClick={() => setTab("library")}
                  >
                    Browse library
                  </button>
                </div>
              ) : (
                <div style={S.grid}>
                  {selectedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      selected={true}
                      onToggle={toggleProduct}
                      showInternal={showInternal}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Print output */}
      <div ref={printRef} style={{ display: "none" }}>
        {/* Hidden — window.print() handles this via @media print */}
      </div>
    </div>
  );
}
