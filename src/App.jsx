import { useState, useRef, useCallback, useEffect } from "react";

// ── Brand tokens ────────────────────────────────────────────────────────────
const B = {
  navy:       "#192957",
  sand:       "#d8c69d",
  teal:       "#40c0c0",
  terra:      "#d34727",
  navyLight:  "#223570",
  sandLight:  "#f0ead8",
  bg:         "#f7f5f0",
  white:      "#ffffff",
  text:       "#1a1a1a",
  muted:      "#6b6b6b",
};

// ── Limestone Coast seasonal weather ─────────────────────────────────────────
// Monthly averages for the Coonawarra / Penola / Limestone Coast region
const LC_WEATHER = [
  { month: "January",   icon: "☀️",  high: 29, low: 14, rain: "Low",    note: "Hot and dry. Light clothing, sun protection and plenty of water essential. Ideal for cellar doors and evenings outdoors." },
  { month: "February",  icon: "☀️",  high: 29, low: 14, rain: "Low",    note: "Warm and dry with long days. Perfect for wildlife at dusk and outdoor dining. Sun hat and sunscreen a must." },
  { month: "March",     icon: "🌤️", high: 26, low: 12, rain: "Low",    note: "Vintage season. Warm days, cooler evenings. Light layers for the afternoon. One of the best times to visit." },
  { month: "April",     icon: "⛅",  high: 21, low: 10, rain: "Moderate", note: "Harvest wrapping up. Crisp mornings and pleasant afternoons. A jacket for evenings. Caves are at their atmospheric best." },
  { month: "May",       icon: "🌦️", high: 17, low: 8,  rain: "Moderate", note: "Autumn settling in. Cool days with occasional showers. Layers recommended. Beautiful light for photography." },
  { month: "June",      icon: "🌧️", high: 14, low: 6,  rain: "High",   note: "Cool and often misty with regular rain. Warm clothing essential. Fires lit at cellar doors — cosy and atmospheric." },
  { month: "July",      icon: "🌧️", high: 13, low: 5,  rain: "High",   note: "The coldest month. Warm layers, waterproof jacket and sturdy shoes. Caves, open fires and hearty meals are the reward." },
  { month: "August",    icon: "🌦️", high: 14, low: 6,  rain: "High",   note: "Still cool with showers, but days are lengthening. Warm clothing needed. Wildlife is active in the early morning cold." },
  { month: "September", icon: "⛅",  high: 17, low: 7,  rain: "Moderate", note: "Spring arriving. Wildflowers emerging across the region. Variable days — layers work well. A lovely time to explore." },
  { month: "October",   icon: "🌤️", high: 20, low: 9,  rain: "Moderate", note: "Warming up with longer days. Light layers for the morning, comfortable afternoons. Ideal touring weather." },
  { month: "November",  icon: "☀️",  high: 24, low: 11, rain: "Low",    note: "Pre-summer warmth. Outdoor experiences are at their best. Sun protection recommended for afternoon activities." },
  { month: "December",  icon: "☀️",  high: 27, low: 13, rain: "Low",    note: "Summer begins. Warm evenings and long days. Great for wildlife at dusk and sunset cellar door visits." },
];

function getWeather(dateStr, dayIndex) {
  if (!dateStr) return null;
  try {
    const base = new Date(dateStr + "T00:00:00");
    base.setDate(base.getDate() + dayIndex);
    return LC_WEATHER[base.getMonth()];
  } catch { return null; }
}


const SEED_PRODUCTS = [
  {
    id: "p1",
    category: "Food & Wine",
    title: "Mayura Wagyu Steakhouse",
    subtitle: "Mayura Station, Millicent",
    location: "Mayura Station, Millicent SA 5280, Australia",
    duration: "3–4 hours",
    description: "A world-class Wagyu beef tasting experience on one of Australia's most awarded Wagyu properties. Guests enjoy a multi-course hosted lunch or dinner featuring full-blood Wagyu scored at 9+ marble score, paired with premium Australian wines in a beautifully restored heritage shearing shed.",
    inclusions: ["Multi-course Wagyu degustation", "Wine pairing", "Hosted by the Scott family", "Property tour"],
    image: "",
    tag: "Signature"
  },
  {
    id: "p2",
    category: "Food & Wine",
    title: "Wynns Coonawarra Estate — Icon Tasting",
    subtitle: "Memorial Drive, Coonawarra",
    location: "Wynns Coonawarra Estate, Memorial Drive, Coonawarra SA 5263, Australia",
    duration: "1.5–2 hours",
    description: "A private hosted tasting of Wynns' most celebrated wines in the iconic ivy-clad cellar door. Guests explore the estate's flagship reds including John Riddoch Cabernet Sauvignon and Michael Shiraz, guided by one of the winery's senior hosts.",
    inclusions: ["Private hosted tasting", "Icon wine lineup", "Cellar door access", "Educational overview of terra rossa terroir"],
    image: "",
    tag: "Signature"
  },
  {
    id: "p3",
    category: "Wildlife",
    title: "Kangaroo Sanctuary",
    subtitle: "Limestone Coast",
    location: "Penola SA 5277, Australia",
    duration: "1–2 hours",
    description: "A private encounter with an Eastern Grey kangaroo mob at dusk or dawn on a working property. Guests are guided to a sheltered viewing point where the mob gathers to graze, offering close and unhurried observation in a completely natural setting.",
    inclusions: ["Guided wildlife experience", "Private property access", "Sunset or sunrise timing"],
    image: "",
    tag: ""
  },
  {
    id: "p4",
    category: "Accommodation",
    title: "Blue Wren Retreat — Warrawindi Escapes",
    subtitle: "Coonawarra",
    location: "Warrawindi Escapes, Coonawarra SA 5263, Australia",
    duration: "Overnight",
    description: "A beautifully appointed private retreat set among native gardens on the Warrawindi property. The Blue Wren Retreat sleeps two in a king bedroom with ensuite, full kitchen, and private outdoor firepit overlooking the vines.",
    inclusions: ["One or more nights accommodation", "Continental breakfast provisions", "Private outdoor firepit", "Vineyard outlook"],
    image: "",
    tag: "Partner"
  },
  {
    id: "p-ottelia",
    category: "Food & Wine",
    title: "Ottelia — Lunch or Dinner",
    subtitle: "Coonawarra",
    location: "Ottelia, Coonawarra SA 5263, Australia",
    duration: "2–3 hours",
    description: "Coonawarra's most celebrated restaurant, set in a converted stone stable and surrounded by vines. Ottelia's menu draws on the best of the Limestone Coast — from local beef and lamb to fresh seafood from the Southern Ocean — paired with the region's finest wines.",
    inclusions: ["Two or three course menu", "Matched wine option available", "Private or semi-private dining"],
    image: "",
    tag: ""
  },
  {
    id: "p-confido",
    category: "Food & Wine",
    title: "Confido Olive Oil — Estate Visit",
    subtitle: "Coonawarra",
    location: "Coonawarra SA 5263, Australia",
    duration: "45–60 minutes",
    description: "A guided tasting and tour at one of South Australia's finest boutique olive oil producers. Guests learn about cold-press production, taste through the current release oils, and have the opportunity to purchase direct from the estate.",
    inclusions: ["Guided estate tour", "Guided oil tasting", "Producer Q&A"],
    image: "",
    tag: ""
  },
  {
    id: "p-caves",
    category: "Heritage & Nature",
    title: "Naracoorte Caves — World Heritage Tour",
    subtitle: "Naracoorte",
    location: "Naracoorte Caves National Park, Naracoorte SA 5271, Australia",
    duration: "2–3 hours",
    description: "A private guided tour of Naracoorte's World Heritage-listed cave system, home to the fossil remains of megafauna dating back 500,000 years. One of just eight natural World Heritage sites in Australia and consistently one of the most remarkable experiences on the Limestone Coast.",
    inclusions: ["Private guided cave tour", "Fossil chamber access", "World Heritage briefing"],
    image: "",
    tag: "Heritage"
  },
  {
    id: "p-yallum",
    category: "Heritage & Nature",
    title: "Yallum Park — Private Heritage Tour",
    subtitle: "Penola",
    location: "Yallum Park, Penola SA 5277, Australia",
    duration: "1.5–2 hours",
    description: "A private tour of Yallum Park, one of South Australia's finest pastoral homesteads and a property steeped in Limestone Coast history. Guests explore the homestead's grand rooms, formal gardens, and working farm with a privately hosted guide.",
    inclusions: ["Private homestead tour", "Garden walk", "Historical briefing", "Morning or afternoon tea"],
    image: "",
    tag: "Heritage"
  },
  {
    id: "p-uncle-ken",
    category: "Heritage & Nature",
    title: "Boandik Country — Indigenous Cultural Experience",
    subtitle: "Limestone Coast",
    location: "Penola SA 5277, Australia",
    duration: "2–3 hours",
    description: "A deeply personal guided experience with Uncle Ken Jones, a Boandik Elder and custodian of Country across the Limestone Coast. Guests walk Country with Uncle Ken, learning about Boandik connection to land, water, and sky through story, song, and lived experience.",
    inclusions: ["Guided walk on Country", "Cultural storytelling", "Hosted by Uncle Ken Jones (Boandik people)"],
    image: "",
    tag: "Signature"
  },
  {
    id: "p-parker",
    category: "Food & Wine",
    title: "Parker Estate — Set Menu Lunch",
    subtitle: "Coonawarra",
    location: "Parker Coonawarra Estate, Coonawarra SA 5263, Australia",
    duration: "2.5–3 hours",
    description: "A leisurely set menu lunch at Parker Estate, one of Coonawarra's most intimate cellar doors. The menu is designed around the estate's current releases — typically a Cabernet Sauvignon and Shiraz program — matched course by course in a private dining setting overlooking the vines.",
    inclusions: ["Set menu lunch", "Matched wine pairing", "Private dining setting", "Winery host"],
    image: "",
    tag: ""
  },
  {
    id: "p-transfer",
    category: "Transfers",
    title: "Hosted Melbourne–Adelaide Transfer via Great Ocean Road",
    subtitle: "Melbourne to Coonawarra",
    location: "Melbourne VIC 3000, Australia",
    duration: "2–3 days",
    description: "A fully hosted private transfer from Melbourne to Adelaide (or Coonawarra) along the Great Ocean Road and through the Grampians. Guests travel in a premium vehicle with Simon or a trusted host, stopping at key highlights along the way. This is not a transfer — it is the beginning of the journey.",
    inclusions: ["Private vehicle and host", "Great Ocean Road highlights", "Grampians overnight (optional)", "Flexible pace and routing"],
    image: "",
    tag: "Transfer"
  },
];

const CATEGORIES = ["All", "Food & Wine", "Wildlife", "Accommodation", "Heritage & Nature", "Transfers", "Other"];

// ── Utility ──────────────────────────────────────────────────────────────────
function genId() {
  return "p-" + Math.random().toString(36).slice(2, 9);
}

function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch { return initial; }
  });
  const save = useCallback((v) => {
    const next = typeof v === "function" ? v(val) : v;
    setVal(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  }, [key, val]);
  return [val, save];
}

// ── Styles ───────────────────────────────────────────────────────────────────
const S = {
  app: {
    fontFamily: "'Source Sans 3', 'Source Sans Pro', system-ui, sans-serif",
    background: B.bg,
    minHeight: "100vh",
    color: B.text,
  },
  // Header
  header: {
    background: B.navy,
    color: B.white,
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  headerLogo: {
    fontFamily: "'Cabin', system-ui, sans-serif",
    fontWeight: 700,
    fontSize: 15,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: B.white,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  logoMark: {
    width: 28, height: 28,
    background: `linear-gradient(135deg, ${B.teal} 0%, ${B.sand} 100%)`,
    borderRadius: 4,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, fontWeight: 900, color: B.navy,
  },
  // Tabs
  tabs: {
    display: "flex", gap: 0,
  },
  tab: (active) => ({
    padding: "0 20px",
    height: 56,
    background: "none",
    border: "none",
    borderBottom: active ? `3px solid ${B.teal}` : "3px solid transparent",
    color: active ? B.teal : "rgba(255,255,255,0.65)",
    fontFamily: "inherit",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    cursor: "pointer",
    transition: "color 0.15s",
  }),
  // Layout
  layout: {
    display: "flex",
    height: "calc(100vh - 56px)",
  },
  // Sidebar
  sidebar: {
    width: 300,
    background: B.white,
    borderRight: `1px solid ${B.sand}`,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  sidebarHead: {
    padding: "16px 16px 12px",
    borderBottom: `1px solid ${B.sandLight}`,
  },
  sidebarTitle: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: B.muted,
    marginBottom: 10,
  },
  searchBox: {
    width: "100%",
    padding: "8px 12px",
    border: `1px solid ${B.sand}`,
    borderRadius: 6,
    fontSize: 13,
    fontFamily: "inherit",
    background: B.bg,
    color: B.text,
    boxSizing: "border-box",
    outline: "none",
  },
  catBar: {
    display: "flex",
    flexWrap: "wrap",
    gap: 4,
    padding: "10px 16px",
    borderBottom: `1px solid ${B.sandLight}`,
  },
  catBtn: (active) => ({
    padding: "3px 9px",
    borderRadius: 20,
    border: `1px solid ${active ? B.teal : B.sand}`,
    background: active ? B.teal : "transparent",
    color: active ? B.white : B.muted,
    fontSize: 11,
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "0.03em",
  }),
  productList: {
    flex: 1,
    overflowY: "auto",
    padding: "8px 12px",
  },
  // Product card (sidebar)
  productCard: (dragging) => ({
    background: B.white,
    border: `1px solid ${B.sand}`,
    borderRadius: 8,
    padding: "10px 12px",
    marginBottom: 6,
    cursor: "grab",
    opacity: dragging ? 0.4 : 1,
    transition: "box-shadow 0.15s, border-color 0.15s",
    userSelect: "none",
  }),
  productCardTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: B.navy,
    marginBottom: 2,
  },
  productCardSub: {
    fontSize: 11,
    color: B.muted,
    marginBottom: 4,
  },
  productCardMeta: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  tagPill: (tag) => ({
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.07em",
    padding: "2px 7px",
    borderRadius: 20,
    background: tag === "Signature" ? B.terra + "22" : tag === "Transfer" ? B.teal + "22" : tag === "Heritage" ? B.navy + "18" : B.sand,
    color: tag === "Signature" ? B.terra : tag === "Transfer" ? B.teal : tag === "Heritage" ? B.navy : B.muted,
    textTransform: "uppercase",
  }),
  dur: {
    fontSize: 10,
    color: B.muted,
  },
  // Main builder area
  main: {
    flex: 1,
    overflowY: "auto",
    padding: "24px 28px",
  },
  // Itinerary meta bar
  metaBar: {
    background: B.white,
    border: `1px solid ${B.sand}`,
    borderRadius: 10,
    padding: "16px 20px",
    marginBottom: 20,
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr auto auto",
    gap: 12,
    alignItems: "end",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: B.muted,
  },
  input: {
    padding: "7px 10px",
    border: `1px solid ${B.sand}`,
    borderRadius: 6,
    fontSize: 13,
    fontFamily: "inherit",
    background: B.bg,
    color: B.text,
    outline: "none",
  },
  // Buttons
  btnPrimary: {
    background: B.navy,
    color: B.white,
    border: "none",
    borderRadius: 6,
    padding: "8px 16px",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
  },
  btnSecondary: {
    background: "transparent",
    color: B.navy,
    border: `1px solid ${B.navy}`,
    borderRadius: 6,
    padding: "7px 14px",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
  },
  btnDanger: {
    background: "transparent",
    color: B.terra,
    border: `1px solid ${B.terra}40`,
    borderRadius: 6,
    padding: "5px 10px",
    fontSize: 11,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  btnGhost: {
    background: "transparent",
    color: B.muted,
    border: `1px solid ${B.sand}`,
    borderRadius: 6,
    padding: "5px 10px",
    fontSize: 11,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  btnAdd: {
    background: B.teal + "18",
    color: B.teal,
    border: `1px dashed ${B.teal}`,
    borderRadius: 6,
    padding: "7px 14px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  // Day block
  dayBlock: {
    background: B.white,
    border: `1px solid ${B.sand}`,
    borderRadius: 10,
    marginBottom: 16,
    overflow: "hidden",
  },
  dayHead: {
    background: B.navy,
    color: B.white,
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dayTitle: {
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  daySubtitle: {
    fontSize: 11,
    color: B.sand,
    fontStyle: "italic",
  },
  dropZone: (over) => ({
    minHeight: 60,
    padding: "10px 14px",
    background: over ? B.teal + "12" : "transparent",
    border: over ? `2px dashed ${B.teal}` : "2px dashed transparent",
    borderRadius: 6,
    margin: "10px 14px",
    transition: "all 0.15s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    color: B.muted,
    fontStyle: "italic",
  }),
  // Block item in day
  blockItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    padding: "10px 14px",
    borderBottom: `1px solid ${B.sandLight}`,
  },
  blockTime: {
    minWidth: 70,
    paddingTop: 2,
  },
  timeInput: {
    width: 70,
    padding: "4px 6px",
    border: `1px solid ${B.sand}`,
    borderRadius: 4,
    fontSize: 11,
    fontFamily: "inherit",
    background: B.bg,
    color: B.navy,
    fontWeight: 600,
    outline: "none",
  },
  blockBody: {
    flex: 1,
  },
  blockTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: B.navy,
    marginBottom: 2,
  },
  blockDesc: {
    fontSize: 12,
    color: B.muted,
    lineHeight: 1.5,
  },
  blockActions: {
    display: "flex",
    gap: 4,
    flexShrink: 0,
    paddingTop: 2,
  },
  // Preview pane
  previewWrap: {
    flex: 1,
    overflowY: "auto",
    background: B.bg,
    padding: 24,
  },
  previewDoc: {
    maxWidth: 740,
    margin: "0 auto",
    background: B.white,
    borderRadius: 10,
    overflow: "hidden",
    boxShadow: "0 4px 24px rgba(25,41,87,0.12)",
  },
  // Product library admin
  libWrap: {
    maxWidth: 900,
    margin: "0 auto",
    padding: 24,
  },
  libGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 14,
    marginTop: 16,
  },
  libCard: {
    background: B.white,
    border: `1px solid ${B.sand}`,
    borderRadius: 10,
    padding: 16,
  },
  libCardTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: B.navy,
    marginBottom: 4,
  },
  libCardMeta: {
    fontSize: 12,
    color: B.muted,
    marginBottom: 8,
  },
  libCardDesc: {
    fontSize: 12,
    color: B.text,
    lineHeight: 1.55,
    marginBottom: 10,
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  // Modal overlay
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(25,41,87,0.55)",
    zIndex: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    background: B.white,
    borderRadius: 12,
    width: "100%",
    maxWidth: 580,
    maxHeight: "90vh",
    overflowY: "auto",
    padding: 28,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: B.navy,
    marginBottom: 20,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
    marginBottom: 14,
  },
  formFull: {
    marginBottom: 14,
  },
  textarea: {
    width: "100%",
    padding: "8px 10px",
    border: `1px solid ${B.sand}`,
    borderRadius: 6,
    fontSize: 13,
    fontFamily: "inherit",
    background: B.bg,
    color: B.text,
    outline: "none",
    resize: "vertical",
    minHeight: 80,
    boxSizing: "border-box",
  },
};

// ── ImageUploader ─────────────────────────────────────────────────────────────
function ImageUploader({ value, onChange }) {
  const [dragOver, setDragOver] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileRef = useRef();

  function readFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target.result);
    reader.readAsDataURL(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) readFile(file);
  }

  function handleFileInput(e) {
    const file = e.target.files[0];
    if (file) readFile(file);
  }

  function applyUrl() {
    if (urlInput.trim()) onChange(urlInput.trim());
    setUrlMode(false);
    setUrlInput("");
  }

  const dropZoneStyle = {
    border: `2px dashed ${dragOver ? B.teal : B.sand}`,
    borderRadius: 8,
    background: dragOver ? B.teal + "0e" : B.bg,
    padding: value ? 0 : "20px 16px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.15s",
    overflow: "hidden",
    position: "relative",
  };

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <label style={S.label}>Product image</label>
        <div style={{ display: "flex", gap: 6 }}>
          {value && (
            <button
              style={{ ...S.btnDanger, fontSize: 10, padding: "2px 8px" }}
              onClick={() => onChange("")}
            >Remove</button>
          )}
          <button
            style={{ ...S.btnGhost, fontSize: 10, padding: "2px 8px" }}
            onClick={() => setUrlMode(v => !v)}
          >{urlMode ? "Cancel URL" : "Paste URL"}</button>
        </div>
      </div>

      {urlMode && (
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          <input
            style={{ ...S.input, flex: 1 }}
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            placeholder="https://example.com/photo.jpg"
            onKeyDown={e => e.key === "Enter" && applyUrl()}
            autoFocus
          />
          <button style={S.btnPrimary} onClick={applyUrl}>Use</button>
        </div>
      )}

      <div
        style={dropZoneStyle}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !value && fileRef.current?.click()}
      >
        {value ? (
          <div style={{ position: "relative" }}>
            <img
              src={value}
              alt="Product"
              style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }}
              onError={() => onChange("")}
            />
            <button
              style={{
                position: "absolute", top: 8, right: 8,
                background: "rgba(25,41,87,0.75)", color: B.white,
                border: "none", borderRadius: 4, padding: "4px 10px",
                fontSize: 11, cursor: "pointer", fontFamily: "inherit",
              }}
              onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}
            >Change photo</button>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.35 }}>⬆</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: B.navy, marginBottom: 4 }}>
              {dragOver ? "Drop to upload" : "Click to upload or drag a photo here"}
            </div>
            <div style={{ fontSize: 11, color: B.muted }}>JPG, PNG, WebP — or paste a URL above</div>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileInput}
      />
    </div>
  );
}

// ── ProductModal ─────────────────────────────────────────────────────────────
function ProductModal({ product, onSave, onClose }) {
  const empty = {
    id: genId(), category: "Food & Wine", title: "", subtitle: "", location: "", duration: "",
    description: "", inclusions: "", tag: "", image: ""
  };
  const init = product
    ? { ...product, inclusions: (product.inclusions || []).join("\n") }
    : empty;
  const [form, setForm] = useState(init);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        <div style={S.modalTitle}>{product ? "Edit product" : "Add product"}</div>

        <div style={S.formGrid}>
          <div style={S.fieldGroup}>
            <label style={S.label}>Title *</label>
            <input style={S.input} value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Wynns Icon Tasting" />
          </div>
          <div style={S.fieldGroup}>
            <label style={S.label}>Subtitle / Location</label>
            <input style={S.input} value={form.subtitle} onChange={e => set("subtitle", e.target.value)} placeholder="e.g. Coonawarra" />
          </div>
          <div style={S.fieldGroup}>
            <label style={S.label}>Category</label>
            <select style={S.input} value={form.category} onChange={e => set("category", e.target.value)}>
              {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={S.fieldGroup}>
            <label style={S.label}>Duration</label>
            <input style={S.input} value={form.duration} onChange={e => set("duration", e.target.value)} placeholder="e.g. 2–3 hours" />
          </div>
          <div style={S.fieldGroup}>
            <label style={S.label}>Tag</label>
            <input style={S.input} value={form.tag} onChange={e => set("tag", e.target.value)} placeholder="e.g. Signature" />
          </div>
        </div>

        <div style={S.formFull}>
          <label style={{ ...S.label, display: "block", marginBottom: 4 }}>Location / Address <span style={{ color: B.muted, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(used for route map)</span></label>
          <input style={S.input} value={form.location || ""} onChange={e => set("location", e.target.value)} placeholder="e.g. Wynns Coonawarra Estate, Memorial Drive, Coonawarra SA 5263, Australia" />
        </div>

        <ImageUploader value={form.image} onChange={v => set("image", v)} />

        <div style={S.formFull}>
          <label style={{ ...S.label, display: "block", marginBottom: 4 }}>Description</label>
          <textarea style={S.textarea} value={form.description} onChange={e => set("description", e.target.value)} rows={4} placeholder="What guests experience..." />
        </div>
        <div style={S.formFull}>
          <label style={{ ...S.label, display: "block", marginBottom: 4 }}>Inclusions (one per line)</label>
          <textarea style={S.textarea} value={form.inclusions} onChange={e => set("inclusions", e.target.value)} rows={4} placeholder={"Multi-course Wagyu degustation\nWine pairing\nHosted by the Scott family"} />
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button style={S.btnGhost} onClick={onClose}>Cancel</button>
          <button style={S.btnPrimary} onClick={() => {
            if (!form.title.trim()) return;
            onSave({
              ...form,
              inclusions: form.inclusions.split("\n").map(s => s.trim()).filter(Boolean)
            });
          }}>
            {product ? "Save changes" : "Add to library"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── ProductLibrary tab ────────────────────────────────────────────────────────
function ProductLibrary({ products, setProducts }) {
  const [modal, setModal] = useState(null); // null | "new" | product
  const [filter, setFilter] = useState("All");

  const visible = filter === "All" ? products : products.filter(p => p.category === filter);

  function handleSave(data) {
    if (modal === "new") {
      setProducts(ps => [...ps, data]);
    } else {
      setProducts(ps => ps.map(p => p.id === data.id ? data : p));
    }
    setModal(null);
  }

  return (
    <div style={S.libWrap}>
      {modal && (
        <ProductModal
          product={modal === "new" ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: B.navy, marginBottom: 2 }}>Product Library</div>
          <div style={{ fontSize: 13, color: B.muted }}>{products.length} products — drag any card into an itinerary day</div>
        </div>
        <button style={S.btnPrimary} onClick={() => setModal("new")}>+ Add product</button>
      </div>

      <div style={S.catBar}>
        {CATEGORIES.map(c => (
          <button key={c} style={S.catBtn(filter === c)} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>

      <div style={S.libGrid}>
        {visible.map(p => (
          <div key={p.id} style={S.libCard}>
            {p.image && (
              <div style={{ height: 120, borderRadius: 6, marginBottom: 10, overflow: "hidden", background: B.sandLight }}>
                <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
              <div style={S.libCardTitle}>{p.title}</div>
              {p.tag && <span style={S.tagPill(p.tag)}>{p.tag}</span>}
            </div>
            <div style={S.libCardMeta}>{p.subtitle} {p.duration && `· ${p.duration}`}</div>
            <div style={S.libCardDesc}>{p.description}</div>
            {p.inclusions?.length > 0 && (
              <div style={{ fontSize: 11, color: B.muted, marginBottom: 10 }}>
                {p.inclusions.slice(0, 3).map((inc, i) => (
                  <div key={i} style={{ marginBottom: 2 }}>· {inc}</div>
                ))}
                {p.inclusions.length > 3 && <div style={{ color: B.teal }}>+{p.inclusions.length - 3} more</div>}
              </div>
            )}
            <div style={{ display: "flex", gap: 6 }}>
              <button style={S.btnGhost} onClick={() => setModal(p)}>Edit</button>
              <button style={S.btnDanger} onClick={() => {
                if (window.confirm(`Remove "${p.title}" from library?`)) {
                  setProducts(ps => ps.filter(x => x.id !== p.id));
                }
              }}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Builder tab ───────────────────────────────────────────────────────────────
function Builder({ products }) {
  const [meta, setMeta] = useLocalStorage("ce_meta", {
    title: "", guests: "", startDate: "", ref: ""
  });
  const [days, setDays] = useLocalStorage("ce_days", [
    { id: genId(), title: "Day 1", subtitle: "", blocks: [] }
  ]);
  const [mapsKey, setMapsKey] = useLocalStorage("ce_maps_key", "");
  const [netlifyToken, setNetlifyToken] = useLocalStorage("ce_netlify_token", "");
  const [netlifySiteId, setNetlifySiteId] = useLocalStorage("ce_netlify_site", "");
  const [shareUrl, setShareUrl] = useState("");
  const [sharing, setSharing] = useState(false);
  const [shareError, setShareError] = useState("");
  const [activeView, setActiveView] = useState("build"); // "build" | "preview"
  const [catFilter, setCatFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [dragId, setDragId] = useState(null);
  const [overDayId, setOverDayId] = useState(null);

  const setMf = (k, v) => setMeta(m => ({ ...m, [k]: v }));

  // filtered sidebar products
  const filteredProducts = products.filter(p => {
    const matchCat = catFilter === "All" || p.category === catFilter;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // Drag from sidebar
  function onDragStart(e, productId) {
    setDragId(productId);
    e.dataTransfer.effectAllowed = "copy";
  }

  function onDragOver(e, dayId) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setOverDayId(dayId);
  }

  function onDrop(e, dayId) {
    e.preventDefault();
    if (!dragId) return;
    const product = products.find(p => p.id === dragId);
    if (!product) return;
    const block = {
      id: genId(),
      productId: product.id,
      time: "",
      customNotes: "",
    };
    setDays(ds => ds.map(d => d.id === dayId ? { ...d, blocks: [...d.blocks, block] } : d));
    setDragId(null);
    setOverDayId(null);
  }

  function onDragEnd() {
    setDragId(null);
    setOverDayId(null);
  }

  function addDay() {
    setDays(ds => [...ds, { id: genId(), title: `Day ${ds.length + 1}`, subtitle: "", blocks: [] }]);
  }

  function removeDay(dayId) {
    if (!window.confirm("Remove this day?")) return;
    setDays(ds => ds.filter(d => d.id !== dayId));
  }

  function updateDay(dayId, key, val) {
    setDays(ds => ds.map(d => d.id === dayId ? { ...d, [key]: val } : d));
  }

  function updateBlock(dayId, blockId, key, val) {
    setDays(ds => ds.map(d =>
      d.id === dayId
        ? { ...d, blocks: d.blocks.map(b => b.id === blockId ? { ...b, [key]: val } : b) }
        : d
    ));
  }

  function removeBlock(dayId, blockId) {
    setDays(ds => ds.map(d =>
      d.id === dayId ? { ...d, blocks: d.blocks.filter(b => b.id !== blockId) } : d
    ));
  }

  function moveBlock(dayId, blockId, dir) {
    setDays(ds => ds.map(d => {
      if (d.id !== dayId) return d;
      const idx = d.blocks.findIndex(b => b.id === blockId);
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= d.blocks.length) return d;
      const blocks = [...d.blocks];
      [blocks[idx], blocks[newIdx]] = [blocks[newIdx], blocks[idx]];
      return { ...d, blocks };
    }));
  }

  const getProduct = (id) => products.find(p => p.id === id);

  // ── Build view ──────────────────────────────────────────────────────────────
  const buildView = (
    <div style={S.layout}>
      {/* Sidebar */}
      <div style={S.sidebar}>
        <div style={S.sidebarHead}>
          <div style={S.sidebarTitle}>Product library</div>
          <input
            style={S.searchBox}
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={S.catBar}>
          {CATEGORIES.map(c => (
            <button key={c} style={S.catBtn(catFilter === c)} onClick={() => setCatFilter(c)}>{c}</button>
          ))}
        </div>
        <div style={S.productList}>
          {filteredProducts.length === 0 && (
            <div style={{ fontSize: 12, color: B.muted, textAlign: "center", padding: "20px 0", fontStyle: "italic" }}>
              No products match
            </div>
          )}
          {filteredProducts.map(p => (
            <div
              key={p.id}
              style={S.productCard(dragId === p.id)}
              draggable
              onDragStart={e => onDragStart(e, p.id)}
              onDragEnd={onDragEnd}
              title="Drag into a day below"
            >
              {p.image && (
                <div style={{ height: 72, borderRadius: 5, marginBottom: 8, overflow: "hidden", background: B.sandLight }}>
                  <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />
                </div>
              )}
              <div style={S.productCardTitle}>{p.title}</div>
              <div style={S.productCardSub}>{p.subtitle}</div>
              <div style={S.productCardMeta}>
                {p.tag && <span style={S.tagPill(p.tag)}>{p.tag}</span>}
                {p.duration && <span style={S.dur}>{p.duration}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Builder main */}
      <div style={S.main}>
        {/* Meta bar */}
        <div style={S.metaBar}>
          <div style={S.fieldGroup}>
            <label style={S.label}>Itinerary title</label>
            <input style={S.input} value={meta.title} onChange={e => setMf("title", e.target.value)} placeholder="Premium Limestone Coast Experience" />
          </div>
          <div style={S.fieldGroup}>
            <label style={S.label}>Guest name(s)</label>
            <input style={S.input} value={meta.guests} onChange={e => setMf("guests", e.target.value)} placeholder="Mr & Mrs Johnson" />
          </div>
          <div style={S.fieldGroup}>
            <label style={S.label}>Start date</label>
            <input style={{ ...S.input }} type="date" value={meta.startDate} onChange={e => setMf("startDate", e.target.value)} />
          </div>
          <div style={S.fieldGroup}>
            <label style={S.label}>Reference</label>
            <input style={{ ...S.input, width: 110 }} value={meta.ref} onChange={e => setMf("ref", e.target.value)} placeholder="CE-2027-001" />
          </div>
          <button style={S.btnSecondary} onClick={() => setActiveView("preview")}>Preview</button>
        </div>

        {/* Days */}
        {days.map((day, di) => (
          <div key={day.id} style={S.dayBlock}>
            <div style={S.dayHead}>
              <div>
                <input
                  value={day.title}
                  onChange={e => updateDay(day.id, "title", e.target.value)}
                  style={{ background: "none", border: "none", color: B.white, fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: "inherit", outline: "none", width: 200 }}
                />
                <div>
                  <input
                    value={day.subtitle}
                    onChange={e => updateDay(day.id, "subtitle", e.target.value)}
                    placeholder="Day subtitle (optional)"
                    style={{ background: "none", border: "none", color: B.sand, fontSize: 11, fontStyle: "italic", fontFamily: "inherit", outline: "none", width: 260 }}
                  />
                </div>
              </div>
              <button style={{ ...S.btnDanger, borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.55)", fontSize: 10 }} onClick={() => removeDay(day.id)}>Remove day</button>
            </div>

            {/* Blocks */}
            {day.blocks.map((block, bi) => {
              const product = getProduct(block.productId);
              if (!product) return null;
              return (
                <div key={block.id} style={S.blockItem}>
                  <div style={S.blockTime}>
                    <input
                      style={S.timeInput}
                      value={block.time}
                      onChange={e => updateBlock(day.id, block.id, "time", e.target.value)}
                      placeholder="Morning"
                    />
                  </div>
                  <div style={S.blockBody}>
                    <div style={S.blockTitle}>{product.title}</div>
                    <div style={S.blockDesc}>{product.subtitle}{product.duration ? ` · ${product.duration}` : ""}</div>
                    <textarea
                      value={block.customNotes}
                      onChange={e => updateBlock(day.id, block.id, "customNotes", e.target.value)}
                      placeholder="Add notes for this guest (optional)..."
                      rows={2}
                      style={{ ...S.textarea, minHeight: 40, marginTop: 6, fontSize: 12 }}
                    />
                  </div>
                  <div style={S.blockActions}>
                    <button style={S.btnGhost} onClick={() => moveBlock(day.id, block.id, -1)} title="Move up" disabled={bi === 0}>↑</button>
                    <button style={S.btnGhost} onClick={() => moveBlock(day.id, block.id, 1)} title="Move down" disabled={bi === day.blocks.length - 1}>↓</button>
                    <button style={S.btnDanger} onClick={() => removeBlock(day.id, block.id)}>✕</button>
                  </div>
                </div>
              );
            })}

            {/* Drop zone */}
            <div
              style={S.dropZone(overDayId === day.id)}
              onDragOver={e => onDragOver(e, day.id)}
              onDrop={e => onDrop(e, day.id)}
              onDragLeave={() => setOverDayId(null)}
            >
              {overDayId === day.id ? "Drop to add" : day.blocks.length === 0 ? "Drag a product here" : "Drag to add another"}
            </div>
          </div>
        ))}

        <button style={S.btnAdd} onClick={addDay}>+ Add day</button>
      </div>
    </div>
  );

  // ── Share to Netlify ──────────────────────────────────────────────────────────
  async function shareToNetlify() {
    if (!netlifyToken || !netlifySiteId) {
      setShareError("Add your Netlify token and site ID in settings first.");
      return;
    }
    setSharing(true);
    setShareError("");
    setShareUrl("");

    try {
      // Grab the print doc HTML
      const docEl = document.getElementById("print-doc");
      if (!docEl) throw new Error("Preview not found — open Preview first.");

      const styles = Array.from(document.styleSheets).map(ss => {
        try { return Array.from(ss.cssRules).map(r => r.cssText).join("\n"); } catch { return ""; }
      }).join("\n");

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${meta.title || "Coonawarra Experiences — Itinerary"}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cabin:wght@700&family=Source+Sans+3:wght@300;400;600;700&display=swap" rel="stylesheet">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Source Sans 3', system-ui, sans-serif; background: #f7f5f0; padding: 24px; }
#itinerary { max-width: 740px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 24px rgba(25,41,87,0.12); }
${styles}
</style>
</head>
<body>
<div id="itinerary">${docEl.innerHTML}</div>
</body>
</html>`;

      const encoder = new TextEncoder();
      const encoded = encoder.encode(html);

      // Deploy to Netlify via Files API
      const res = await fetch(`https://api.netlify.com/api/v1/sites/${netlifySiteId}/deploys`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${netlifyToken}`,
          "Content-Type": "application/zip",
        },
        body: await createZip({ "index.html": encoded }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `Netlify error ${res.status}`);
      }

      const deploy = await res.json();
      // Poll until ready
      let attempts = 0;
      let url = "";
      while (attempts < 20) {
        await new Promise(r => setTimeout(r, 2000));
        const poll = await fetch(`https://api.netlify.com/api/v1/deploys/${deploy.id}`, {
          headers: { "Authorization": `Bearer ${netlifyToken}` }
        });
        const d = await poll.json();
        if (d.state === "ready") { url = d.ssl_url || d.url; break; }
        attempts++;
      }
      if (!url) throw new Error("Deploy timed out — check Netlify dashboard.");
      setShareUrl(url);
    } catch (e) {
      setShareError(e.message || "Deploy failed.");
    }
    setSharing(false);
  }

  // Minimal ZIP builder for single file
  async function createZip(files) {
    // Use JSZip via CDN if available, otherwise fall back to raw upload
    if (window.JSZip) {
      const zip = new window.JSZip();
      Object.entries(files).forEach(([name, content]) => zip.file(name, content));
      return await zip.generateAsync({ type: "arraybuffer" });
    }
    // Fallback: Netlify also accepts raw HTML via the manual deploy API
    // Use the /deploys endpoint with files hash instead
    throw new Error("JSZip not loaded. Please refresh and try again.");
  }

  // ── Preview view ─────────────────────────────────────────────────────────────
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr + "T00:00:00").toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
    } catch { return dateStr; }
  };

  const previewView = (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)" }}>
      {/* Preview toolbar */}
      <div style={{ background: B.white, borderBottom: `1px solid ${B.sand}`, padding: "10px 20px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <button style={S.btnSecondary} onClick={() => setActiveView("build")}>← Back to builder</button>
        <span style={{ fontSize: 12, color: B.muted, flex: 1 }}>
          Preview — Ctrl+P in Chrome to save PDF (background graphics on)
        </span>
        <input
          style={{ ...S.input, width: 230, fontSize: 11, fontFamily: "monospace" }}
          value={mapsKey}
          onChange={e => setMapsKey(e.target.value)}
          placeholder="Google Maps API key"
        />
        <input
          style={{ ...S.input, width: 200, fontSize: 11, fontFamily: "monospace" }}
          value={netlifyToken}
          onChange={e => setNetlifyToken(e.target.value)}
          placeholder="Netlify token"
        />
        <input
          style={{ ...S.input, width: 160, fontSize: 11, fontFamily: "monospace" }}
          value={netlifySiteId}
          onChange={e => setNetlifySiteId(e.target.value)}
          placeholder="Netlify site ID"
        />
        <button
          style={{ ...S.btnPrimary, background: B.teal, opacity: sharing ? 0.7 : 1 }}
          onClick={shareToNetlify}
          disabled={sharing}
        >
          {sharing ? "Deploying..." : "Share link"}
        </button>
        <button style={S.btnPrimary} onClick={() => window.print()}>Print / PDF</button>
      </div>

      {/* Share result / error */}
      {(shareUrl || shareError) && (
        <div style={{ background: shareUrl ? B.teal + "18" : B.terra + "12", borderBottom: `1px solid ${shareUrl ? B.teal : B.terra}40`, padding: "10px 20px", display: "flex", alignItems: "center", gap: 12 }}>
          {shareUrl && (
            <>
              <span style={{ fontSize: 12, fontWeight: 700, color: B.teal }}>Live link:</span>
              <a href={shareUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: B.navy, wordBreak: "break-all" }}>{shareUrl}</a>
              <button style={{ ...S.btnGhost, fontSize: 11, marginLeft: "auto", whiteSpace: "nowrap" }} onClick={() => { navigator.clipboard.writeText(shareUrl); }}>Copy link</button>
            </>
          )}
          {shareError && <span style={{ fontSize: 12, color: B.terra }}>{shareError}</span>}
        </div>
      )}

      {/* Preview doc */}
      <div style={S.previewWrap}>
        <div style={S.previewDoc} id="print-doc">
          {/* Cover */}
          <div style={{ background: B.navy, padding: "48px 40px 36px", color: B.white }}>
            <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: B.sand, marginBottom: 12 }}>Coonawarra Experiences</div>
            <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Cabin', system-ui, sans-serif", color: B.white, marginBottom: 8, lineHeight: 1.2 }}>
              {meta.title || "Your Bespoke Limestone Coast Itinerary"}
            </div>
            <div style={{ width: 40, height: 3, background: B.teal, borderRadius: 2, margin: "16px 0" }} />
            <div style={{ fontSize: 13, color: B.sand, fontStyle: "italic", marginBottom: 4 }}>Hosted journeys of wine country and beyond.</div>
            {(meta.guests || meta.startDate) && (
              <div style={{ marginTop: 20, display: "flex", gap: 24, flexWrap: "wrap" }}>
                {meta.guests && (
                  <div>
                    <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: B.teal, marginBottom: 2 }}>Prepared for</div>
                    <div style={{ fontSize: 14, color: B.white, fontWeight: 600 }}>{meta.guests}</div>
                  </div>
                )}
                {meta.startDate && (
                  <div>
                    <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: B.teal, marginBottom: 2 }}>Travel date</div>
                    <div style={{ fontSize: 14, color: B.white, fontWeight: 600 }}>{formatDate(meta.startDate)}</div>
                  </div>
                )}
                {meta.ref && (
                  <div>
                    <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: B.teal, marginBottom: 2 }}>Reference</div>
                    <div style={{ fontSize: 14, color: B.white, fontWeight: 600 }}>{meta.ref}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Route map page */}
          {(() => {
            // Collect unique ordered locations from all blocks across all days
            const seen = new Set();
            const stops = [];
            days.forEach(day => {
              day.blocks.forEach(block => {
                const p = getProduct(block.productId);
                if (p?.location && !seen.has(p.location)) {
                  seen.add(p.location);
                  stops.push({ title: p.title, location: p.location });
                }
              });
            });

            if (stops.length < 2) return null;

            const origin = encodeURIComponent(stops[0].location);
            const destination = encodeURIComponent(stops[stops.length - 1].location);
            const waypoints = stops.slice(1, -1).map(s => encodeURIComponent(s.location)).join("|");

            const mapSrc = mapsKey
              ? `https://www.google.com/maps/embed/v1/directions?key=${mapsKey}&origin=${origin}&destination=${destination}${waypoints ? `&waypoints=${waypoints}` : ""}&mode=driving&region=au`
              : null;

            return (
              <div style={{ borderBottom: `1px solid ${B.sandLight}` }}>
                {/* Page header */}
                <div style={{ background: B.sandLight, padding: "14px 32px", display: "flex", alignItems: "baseline", gap: 12 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: B.terra }}>Your journey</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: B.navy, fontFamily: "'Cabin', system-ui, sans-serif" }}>Route overview</span>
                </div>

                {/* Map */}
                <div style={{ padding: "20px 32px 0" }}>
                  {mapSrc ? (
                    <iframe
                      title="Route map"
                      width="100%"
                      height="380"
                      style={{ border: "none", borderRadius: 8, display: "block" }}
                      src={mapSrc}
                      allowFullScreen
                    />
                  ) : (
                    <div style={{ height: 380, background: B.sandLight, borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <div style={{ fontSize: 13, color: B.navy, fontWeight: 600 }}>Route map</div>
                      <div style={{ fontSize: 12, color: B.muted, textAlign: "center", maxWidth: 300 }}>
                        Paste your Google Maps API key into the preview toolbar above to enable the route map.
                      </div>
                    </div>
                  )}
                </div>

                {/* Stop list */}
                <div style={{ padding: "16px 32px 24px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: B.muted, marginBottom: 12 }}>Stops in order</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {stops.map((stop, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, paddingBottom: i < stops.length - 1 ? 0 : 0 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
                          <div style={{
                            width: 24, height: 24, borderRadius: "50%",
                            background: i === 0 ? B.teal : i === stops.length - 1 ? B.terra : B.navy,
                            color: B.white, fontSize: 10, fontWeight: 700,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0, zIndex: 1
                          }}>
                            {i + 1}
                          </div>
                          {i < stops.length - 1 && (
                            <div style={{ width: 2, height: 20, background: B.sand, margin: "2px 0" }} />
                          )}
                        </div>
                        <div style={{ paddingTop: 3, paddingBottom: i < stops.length - 1 ? 8 : 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: B.navy }}>{stop.title}</div>
                          <div style={{ fontSize: 11, color: B.muted }}>{stop.location}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Days */}
          {days.map((day, di) => {
            const weather = getWeather(meta.startDate, di);
            return (
            <div key={day.id} style={{ borderBottom: `1px solid ${B.sandLight}` }}>
              {/* Day header */}
              <div style={{ background: B.sandLight, padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: B.terra }}>Day {di + 1}</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: B.navy, fontFamily: "'Cabin', system-ui, sans-serif" }}>{day.title}</span>
                  {day.subtitle && <span style={{ fontSize: 13, color: B.muted, fontStyle: "italic" }}>{day.subtitle}</span>}
                </div>
                {weather && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, background: B.white, borderRadius: 6, padding: "5px 12px", border: `1px solid ${B.sand}` }}>
                    <span style={{ fontSize: 18 }}>{weather.icon}</span>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: B.navy }}>{weather.month} · {weather.low}–{weather.high}°C</div>
                      <div style={{ fontSize: 10, color: B.muted }}>Rainfall: {weather.rain}</div>
                    </div>
                  </div>
                )}
              </div>
              {weather && (
                <div style={{ padding: "10px 32px", background: B.white, borderBottom: `1px solid ${B.sandLight}`, fontSize: 12, color: B.muted, fontStyle: "italic" }}>
                  <span style={{ color: B.navy, fontWeight: 600, fontStyle: "normal" }}>What to expect: </span>{weather.note}
                </div>
              )}

              {/* Blocks */}
              {day.blocks.map((block) => {
                const product = getProduct(block.productId);
                if (!product) return null;
                return (
                  <div key={block.id} style={{ borderBottom: `1px solid ${B.sandLight}` }}>
                    {product.image && (
                      <div style={{ height: 200, overflow: "hidden", background: B.sandLight }}>
                        <img src={product.image} alt={product.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      </div>
                    )}
                    <div style={{ padding: "20px 32px", display: "flex", gap: 20 }}>
                      <div style={{ minWidth: 90, paddingTop: 2 }}>
                        {block.time && (
                          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: B.teal }}>{block.time}</div>
                        )}
                        <div style={{ fontSize: 10, color: B.muted, marginTop: 4 }}>{product.duration}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: B.navy, marginBottom: 2 }}>{product.title}</div>
                        {product.subtitle && <div style={{ fontSize: 12, color: B.muted, marginBottom: 8 }}>{product.subtitle}</div>}
                        <div style={{ fontSize: 13, color: B.text, lineHeight: 1.6, marginBottom: 8 }}>{product.description}</div>
                        {block.customNotes && (
                          <div style={{ fontSize: 12, color: B.terra, fontStyle: "italic", background: B.terra + "0d", borderLeft: `3px solid ${B.terra}`, padding: "6px 10px", borderRadius: "0 4px 4px 0", marginBottom: 8 }}>
                            {block.customNotes}
                          </div>
                        )}
                        {product.inclusions?.length > 0 && (
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: B.muted, marginBottom: 6 }}>Included</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px" }}>
                              {product.inclusions.map((inc, i) => (
                                <div key={i} style={{ fontSize: 12, color: B.text, display: "flex", alignItems: "center", gap: 5 }}>
                                  <span style={{ color: B.teal, fontSize: 10 }}>✓</span> {inc}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {day.blocks.length === 0 && (
                <div style={{ padding: "20px 32px", fontSize: 13, color: B.muted, fontStyle: "italic" }}>No experiences added to this day.</div>
              )}
            </div>
            );
          })}

          {/* Footer */}
          <div style={{ background: B.navy, padding: "24px 32px", color: B.sand, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: B.white, marginBottom: 2 }}>Simon & Kerry Meares</div>
              <div style={{ fontSize: 12 }}>Coonawarra Experiences · Penola, South Australia</div>
            </div>
            <div style={{ textAlign: "right", fontSize: 12 }}>
              <div>info@coonawarraexperiences.com.au</div>
              <div>1800 861 190</div>
              <div>coonawarraexperiences.com.au</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return activeView === "build" ? buildView : previewView;
}

// ── FlightLookup ──────────────────────────────────────────────────────────────
function FlightLookup() {
  const [apiKey, setApiKey] = useLocalStorage("ce_flight_api_key", "");
  const [editingKey, setEditingKey] = useState(!apiKey);
  const [keyInput, setKeyInput] = useState(apiKey);
  const [flightNum, setFlightNum] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [callCount, setCallCount] = useLocalStorage("ce_flight_calls", { month: "", count: 0 });

  const thisMonth = new Date().toISOString().slice(0, 7);
  const usedThisMonth = callCount.month === thisMonth ? callCount.count : 0;

  function saveKey() {
    setApiKey(keyInput.trim());
    setEditingKey(false);
  }

  async function lookupFlight() {
    if (!apiKey) { setEditingKey(true); return; }
    if (!flightNum.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const code = flightNum.trim().toUpperCase().replace(/\s+/g, "");
      // AeroDataBox via RapidAPI — works over HTTPS in the browser
      const today = new Date().toISOString().slice(0, 10);
      const url = `https://aerodatabox.p.rapidapi.com/flights/iata/${code}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "x-rapidapi-host": "aerodatabox.p.rapidapi.com",
          "x-rapidapi-key": apiKey,
        },
      });

      if (res.status === 404) {
        setError(`No flight found for ${code} today. Check the flight number and try again.`);
        setLoading(false);
        return;
      }
      if (res.status === 401 || res.status === 403) {
        setError("API key rejected — check your RapidAPI key and try again.");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError(`API error (${res.status}) — please try again.`);
        setLoading(false);
        return;
      }

      const data = await res.json();
      // AeroDataBox returns an array
      const flight = Array.isArray(data) ? data[0] : data;
      if (!flight) {
        setError(`No data returned for ${code}. The flight may not be active yet today.`);
      } else {
        setResult(flight);
        setCallCount({ month: thisMonth, count: usedThisMonth + 1 });
      }
    } catch (e) {
      setError("Could not reach the flight API. Check your internet connection.");
    }
    setLoading(false);
  }

  function formatTime(iso) {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit", hour12: true });
    } catch { return iso; }
  }

  function formatDate(iso) {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" });
    } catch { return ""; }
  }

  const statusColor = (status) => {
    if (!status) return B.muted;
    const s = status.toLowerCase();
    if (s === "en route" || s === "airborne") return B.teal;
    if (s === "landed" || s === "arrived") return "#2e7d32";
    if (s === "scheduled" || s === "expected") return B.navy;
    if (s.includes("delay") || s === "diverted") return B.terra;
    if (s === "cancelled") return B.terra;
    return B.navy;
  };

  const statusLabel = (status) => {
    if (!status) return "Unknown";
    const map = {
      "scheduled": "Scheduled",
      "expected": "Scheduled",
      "en route": "In the air",
      "airborne": "In the air",
      "landed": "Landed",
      "arrived": "Landed",
      "cancelled": "Cancelled",
      "diverted": "Diverted",
    };
    return map[status.toLowerCase()] || status;
  };

  const f = result;
  // AeroDataBox field mapping
  const dep = f?.departure;
  const arr = f?.arrival;
  const airlineName = f?.airline?.name || "";
  const flightIata = f?.number || flightNum;
  const status = f?.status || "";
  const delayMins = arr?.delay || dep?.delay || 0;

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: B.navy, marginBottom: 4 }}>Flight Lookup</div>
        <div style={{ fontSize: 13, color: B.muted }}>
          Check a guest's inbound flight status on demand. Powered by AeroDataBox via RapidAPI.
        </div>
      </div>

      {/* API Key */}
      <div style={{ background: B.white, border: `1px solid ${B.sand}`, borderRadius: 10, padding: 16, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: editingKey ? 10 : 0 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: B.muted, marginBottom: 2 }}>
              RapidAPI key (AeroDataBox)
            </div>
            {!editingKey && apiKey && (
              <div style={{ fontSize: 13, color: B.navy, fontFamily: "monospace" }}>
                {"•".repeat(8) + apiKey.slice(-6)}
              </div>
            )}
            {!apiKey && !editingKey && (
              <div style={{ fontSize: 13, color: B.terra }}>No key saved — add one to enable lookups</div>
            )}
          </div>
          <button style={S.btnGhost} onClick={() => { setEditingKey(v => !v); setKeyInput(apiKey); }}>
            {editingKey ? "Cancel" : "Change key"}
          </button>
        </div>
        {editingKey && (
          <div style={{ display: "flex", gap: 8 }}>
            <input
              style={{ ...S.input, flex: 1, fontFamily: "monospace", fontSize: 12 }}
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
              placeholder="Paste your RapidAPI key here"
              autoFocus
            />
            <button style={S.btnPrimary} onClick={saveKey}>Save</button>
          </div>
        )}
        {!editingKey && (
          <div style={{ marginTop: 8, fontSize: 11, color: B.muted }}>
            Get a free key at{" "}
            <a href="https://rapidapi.com/aedbx-aedbx/api/aerodatabox" target="_blank" rel="noreferrer" style={{ color: B.teal }}>
              rapidapi.com — AeroDataBox
            </a>
          </div>
        )}
      </div>

      {/* Usage counter */}
      <div style={{ background: B.white, border: `1px solid ${B.sand}`, borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 13, color: B.muted }}>Lookups this month</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 120, height: 6, background: B.sandLight, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: `${Math.min(100, (usedThisMonth / 100) * 100)}%`, height: "100%", background: usedThisMonth > 80 ? B.terra : B.teal, borderRadius: 3, transition: "width 0.3s" }} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: usedThisMonth > 80 ? B.terra : B.navy }}>
            {usedThisMonth} / 100
          </div>
        </div>
      </div>

      {/* Flight number input */}
      <div style={{ background: B.white, border: `1px solid ${B.sand}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: B.muted, marginBottom: 10 }}>
          Flight number
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            style={{ ...S.input, flex: 1, fontSize: 18, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "monospace" }}
            value={flightNum}
            onChange={e => setFlightNum(e.target.value.toUpperCase())}
            placeholder="e.g. QF693"
            onKeyDown={e => e.key === "Enter" && lookupFlight()}
            maxLength={8}
          />
          <button
            style={{ ...S.btnPrimary, padding: "8px 24px", fontSize: 13 }}
            onClick={lookupFlight}
            disabled={loading || !flightNum.trim()}
          >
            {loading ? "Checking..." : "Check flight"}
          </button>
        </div>
        <div style={{ fontSize: 11, color: B.muted, marginTop: 8 }}>
          Enter the IATA flight code — e.g. QF693, JQ717, VA445. Only returns data for flights active today.
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: B.terra + "12", border: `1px solid ${B.terra}40`, borderRadius: 10, padding: "14px 18px", marginBottom: 20, fontSize: 13, color: B.terra }}>
          {error}
        </div>
      )}

      {/* Result card */}
      {f && (
        <div style={{ background: B.white, border: `1px solid ${B.sand}`, borderRadius: 10, overflow: "hidden" }}>
          {/* Status banner */}
          <div style={{ background: statusColor(status), padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)", marginBottom: 2 }}>
                {airlineName}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: B.white, letterSpacing: "0.05em" }}>
                {flightIata}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: B.white }}>{statusLabel(status)}</div>
              {delayMins > 0 && (
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>
                  Delayed {delayMins} min
                </div>
              )}
            </div>
          </div>

          {/* Route */}
          <div style={{ padding: "20px 20px 16px", display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 12 }}>
            {/* Departure */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: B.muted, marginBottom: 4 }}>Departure</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: B.navy, marginBottom: 2 }}>{dep?.airport?.iata || "—"}</div>
              <div style={{ fontSize: 13, color: B.text, marginBottom: 6 }}>{dep?.airport?.name || "—"}</div>
              <div style={{ fontSize: 11, color: B.muted, marginBottom: 6 }}>{formatDate(dep?.scheduledTime?.local || dep?.scheduledTime?.utc)}</div>
              <div style={{ fontSize: 11, color: B.muted }}>Scheduled</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: B.navy }}>{formatTime(dep?.scheduledTime?.local || dep?.scheduledTime?.utc)}</div>
              {dep?.actualTime?.local && (
                <div style={{ fontSize: 12, color: delayMins > 0 ? B.terra : B.teal }}>
                  Actual: {formatTime(dep.actualTime.local)}
                </div>
              )}
              {dep?.terminal && <div style={{ fontSize: 11, color: B.muted, marginTop: 4 }}>Terminal {dep.terminal}{dep.gate ? ` · Gate ${dep.gate}` : ""}</div>}
            </div>

            {/* Arrow */}
            <div style={{ textAlign: "center", color: B.sand, fontSize: 22 }}>→</div>

            {/* Arrival */}
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: B.muted, marginBottom: 4 }}>Arrival</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: B.navy, marginBottom: 2 }}>{arr?.airport?.iata || "—"}</div>
              <div style={{ fontSize: 13, color: B.text, marginBottom: 6 }}>{arr?.airport?.name || "—"}</div>
              <div style={{ fontSize: 11, color: B.muted, marginBottom: 6 }}>{formatDate(arr?.scheduledTime?.local || arr?.scheduledTime?.utc)}</div>
              <div style={{ fontSize: 11, color: B.muted }}>Scheduled</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: B.navy }}>{formatTime(arr?.scheduledTime?.local || arr?.scheduledTime?.utc)}</div>
              {arr?.actualTime?.local && (
                <div style={{ fontSize: 12, color: delayMins > 0 ? B.terra : B.teal }}>
                  Actual: {formatTime(arr.actualTime.local)}
                </div>
              )}
              {arr?.terminal && <div style={{ fontSize: 11, color: B.muted, marginTop: 4 }}>Terminal {arr.terminal}{arr.gate ? ` · Gate ${arr.gate}` : ""}</div>}
            </div>
          </div>

          {/* Aircraft */}
          {f.aircraft && (
            <div style={{ padding: "10px 20px 14px", borderTop: `1px solid ${B.sandLight}`, display: "flex", gap: 20 }}>
              {f.aircraft.model && <div style={{ fontSize: 11, color: B.muted }}>Aircraft: <span style={{ color: B.text }}>{f.aircraft.model}</span></div>}
              {f.aircraft.reg && <div style={{ fontSize: 11, color: B.muted }}>Reg: <span style={{ color: B.text }}>{f.aircraft.reg}</span></div>}
            </div>
          )}

          <div style={{ padding: "10px 20px 14px", borderTop: `1px solid ${B.sandLight}` }}>
            <div style={{ fontSize: 10, color: B.muted }}>Data via AeroDataBox / RapidAPI · Refreshes on next lookup</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── App root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("builder");
  const [products, setProducts] = useLocalStorage("ce_products", SEED_PRODUCTS);

  return (
    <div style={S.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cabin:wght@700&family=Source+Sans+3:wght@300;400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; } 
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${B.sand}; border-radius: 3px; }
        input:focus, textarea:focus, select:focus { border-color: ${B.teal} !important; }
        @media print {
          body > div > div:first-child { display: none !important; }
          #print-doc { box-shadow: none !important; border-radius: 0 !important; }
        }
      `}</style>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js" />

      <div style={S.header}>
        <div style={S.headerLogo}>
          <div style={S.logoMark}>CE</div>
          <div>
            <div>Coonawarra Experiences</div>
            <div style={{ fontSize: 9, fontWeight: 400, opacity: 0.65, letterSpacing: "0.08em" }}>ITINERARY BUILDER</div>
          </div>
        </div>
        <div style={S.tabs}>
          <button style={S.tab(tab === "builder")} onClick={() => setTab("builder")}>Builder</button>
          <button style={S.tab(tab === "library")} onClick={() => setTab("library")}>Product Library</button>
          <button style={S.tab(tab === "flights")} onClick={() => setTab("flights")}>Flight Lookup</button>
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", letterSpacing: "0.04em" }}>
          {products.length} products loaded
        </div>
      </div>

      {tab === "builder" && <Builder products={products} />}
      {tab === "library" && <ProductLibrary products={products} setProducts={setProducts} />}
      {tab === "flights" && (
        <div style={{ overflowY: "auto", height: "calc(100vh - 56px)" }}>
          <FlightLookup />
        </div>
      )}
    </div>
  );
}
