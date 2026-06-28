import { useState, useRef, useCallback } from "react";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const C = {
  navy:      "#192957",
  navyLight: "#243a73",
  sand:      "#d8c69d",
  sandLight: "#f0ead8",
  sandDark:  "#b8a678",
  teal:      "#40c0c0",
  tealLight: "#e0f7f7",
  terra:     "#d34727",
  white:     "#ffffff",
  offWhite:  "#faf9f6",
  grey100:   "#f4f3f0",
  grey200:   "#e8e6e0",
  grey400:   "#9e9b92",
  grey600:   "#5c5a54",
  grey800:   "#2e2d29",
  text:      "#1a1917",
};
const F = {
  heading: "'Cabin','Arial Black',sans-serif",
  serif:   "'PT Serif',Georgia,serif",
  body:    "'Source Sans 3','Source Sans Pro','Open Sans',sans-serif",
};

// ─── Weather data ─────────────────────────────────────────────────────────────
const WEATHER = {
  1:  { month:"January",   temp:"20–34°C", rain:"Low",    icon:"☀️",  note:"Peak summer. Hot days, long light evenings. Book shade and water." },
  2:  { month:"February",  temp:"20–33°C", rain:"Low",    icon:"☀️",  note:"Still hot. Vintage begins in Coonawarra. Cellar doors buzzing." },
  3:  { month:"March",     temp:"16–28°C", rain:"Low",    icon:"🌤️", note:"Vintage season. Warm days, cooler evenings. Ideal touring weather." },
  4:  { month:"April",     temp:"12–22°C", rain:"Medium", icon:"🌤️", note:"Autumn colours in the vineyard. Pleasant days, cool nights." },
  5:  { month:"May",       temp:"9–18°C",  rain:"Medium", icon:"🌥️", note:"Shoulder season. Quieter, good value. Layers recommended." },
  6:  { month:"June",      temp:"6–14°C",  rain:"High",   icon:"🌧️", note:"Winter. Fires in the cellar doors. Hot lunches at their best." },
  7:  { month:"July",      temp:"5–13°C",  rain:"High",   icon:"🌧️", note:"Coldest month. Warm layers, waterproof jacket and sturdy shoes." },
  8:  { month:"August",    temp:"6–14°C",  rain:"High",   icon:"🌧️", note:"Winter wrapping up. Kangaroos very active at dusk." },
  9:  { month:"September", temp:"8–17°C",  rain:"Medium", icon:"🌤️", note:"Spring. Vines budding. Wildflowers along the coast." },
  10: { month:"October",   temp:"11–21°C", rain:"Low",    icon:"🌤️", note:"Perfect touring weather. Peak season begins." },
  11: { month:"November",  temp:"13–25°C", rain:"Low",    icon:"☀️",  note:"Warm and sunny. Book ahead — popular season." },
  12: { month:"December",  temp:"16–28°C", rain:"Low",    icon:"☀️",  note:"Summer holidays. Festive atmosphere in the cellar doors." },
};

// ─── Products ─────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id:"p-uncle-ken", rezdy:"UNCLEKEN", category:"Day Tours", name:"On Country with Uncle Ken", subtitle:"Private cultural experience · Port MacDonnell", type:"private", duration:"3.5 hrs + coastal lunch", schedule:null, departures:"On request", location:"Port MacDonnell", partner:"Bush Adventures", minGuests:2, maxGuests:null, pricing:{ structure:"per_adult", tiers:[{label:"Per adult",retail:1295}], note:"On request" }, tags:["Indigenous","Cultural","Wildlife","Coastal"], description:"A private cultural experience with Uncle Ken Jones, NAIDOC Elder and proud Boandik man, on his saltwater Country. Stories, songs and a lifetime of knowledge, shared first-hand by a man who has spent more than fifty years as a wildlife officer and conservationist on this coastline. Afterwards, a secluded beach luncheon — deck chairs in the sand, fresh Southern Rock Lobster with crusty bread and a chilled Coonawarra Riesling.", inclusions:["Private guided walk on Boandik Country with Uncle Ken Jones","Stories, songs and cultural knowledge of the land and sea","Coastal luncheon at a secluded beach","Fresh Southern Rock Lobster with crusty bread and lemon","Chilled Coonawarra Riesling","Premium transport, driven by your hosts","Pick-up and drop-off, Penola / Coonawarra region"] },
  { id:"p-caves-cabernet", rezdy:"PGXR9D", category:"Day Tours", name:"Caves, Cabernet & Kangaroos", subtitle:"Full day private tour · Min 2 / Max 4", type:"private", duration:"8 hrs", schedule:"9:00 – 17:00", departures:"Daily", location:"Naracoorte · Coonawarra · Penola", minGuests:2, maxGuests:4, pricing:{ structure:"per_adult", tiers:[{label:"Per adult",retail:715}], note:null }, tags:["Caves","Wine","Wildlife","Olive Oil"], description:"A full day taking in the best of the Limestone Coast — ancient caves, celebrated wine country, a boutique olive grove and a private kangaroo sanctuary not open to the public.", inclusions:["UNESCO World Heritage–listed Naracoorte Caves exploration","Locally sourced produce luncheon at one of the region's best venues","Icon wine tasting at Wynns Coonawarra Estate","Boutique olive oil tasting at a local grove","Private kangaroo sanctuary visit, not open to the public","Premium transport, driven by your hosts","Pick-up and drop-off, Penola / Coonawarra region","All tasting and entry fees included"] },
  { id:"p-heritage-treasures", rezdy:"PLVMQJ", category:"Day Tours", name:"Heritage & Hidden Treasures", subtitle:"Naracoorte Caves & Yallum Park · Min 2 / Max 4", type:"private", duration:"8 hrs", schedule:"9:00 – 17:00", departures:"Daily", location:"Naracoorte · Penola", minGuests:2, maxGuests:4, pricing:{ structure:"tiered_per_person_by_group", tiers:[{label:"2 guests",pax:2,retail:795},{label:"3 guests",pax:3,retail:695},{label:"4 guests",pax:4,retail:595}], note:"Per person, priced by group size" }, tags:["Caves","Heritage","History"], description:"A private day built around two of the region's most compelling stories — the deep prehistory of the Naracoorte Caves and the social history of Yallum Park Mansion, one of Australia's best-preserved period homes.", inclusions:["Private 3.5-hour multi-cave tour, UNESCO World Heritage–listed Naracoorte Caves","Set-menu seasonal luncheon at one of the region's best venues","Private guided tour of Yallum Park Mansion","Premium transport and return transfers, driven by your hosts","All entry and tasting fees included"] },
  { id:"p-immerse-day", rezdy:"PFLB9E", category:"Day Tours", name:"Immerse Yourself in Coonawarra", subtitle:"Full day private wine tour · Min 2 / Max 6", type:"private", duration:"6.5 hrs", schedule:"10:30 – 17:00", departures:"Daily", location:"Coonawarra · Penola", minGuests:2, maxGuests:6, pricing:{ structure:"per_adult", tiers:[{label:"Per adult",retail:395}], note:null }, tags:["Wine","Cellar Door","Dining"], description:"A privately hosted full day among Coonawarra's finest cellar doors, guided throughout by Simon and Kerry. Personalised tastings with the region's favourite winemakers and a set-menu lunch.", inclusions:["Wine tastings at the best cellar doors in Coonawarra","Personalised experiences with the region's favourite winemakers","Set-menu seasonal luncheon at one of the region's best venues","Premium transport, driven by your hosts","Pick-up and drop-off, Penola / Coonawarra accommodation","All tasting fees included"] },
  { id:"p-unearthed", rezdy:"PTGHJM", category:"Day Tours", name:"Coonawarra Unearthed", subtitle:"Full day small-group wine tour · Min 2 / Max 10", type:"small_group", duration:"6 hrs", schedule:"11:00 – 17:00", departures:"Daily", location:"Coonawarra · Penola", minGuests:2, maxGuests:10, pricing:{ structure:"per_adult", tiers:[{label:"Per adult",retail:215}], note:null }, tags:["Wine","Cellar Door","Small Group"], description:"Our flagship small-group wine day — the best way to discover Coonawarra's cellar doors in good company, with a sumptuous produce platter at an iconic winery.", inclusions:["Wine tastings at the best cellar doors in Coonawarra","Sumptuous produce platter with a glass of wine at an iconic winery","Premium transport, driven by your hosts","Pick-up and drop-off, Penola / Coonawarra accommodation","All tasting fees included"] },
  { id:"p-highlights", rezdy:"PBBRC2", category:"Day Tours", name:"Coonawarra Highlights", subtitle:"Half day small-group wine tour · Min 2 / Max 10", type:"small_group", duration:"4.5 hrs", schedule:"12:30 – 17:00", departures:"Daily", location:"Coonawarra · Penola", minGuests:2, maxGuests:10, pricing:{ structure:"per_adult", tiers:[{label:"Per adult",retail:185}], note:null }, tags:["Wine","Cellar Door","Half Day"], description:"A relaxed afternoon introduction to Coonawarra's cellar doors — ideal for guests arriving late morning or those who want a gentler taste of the region.", inclusions:["Wine tastings at the best cellar doors in Coonawarra","Sumptuous produce platter with a glass of wine at an iconic winery","Premium transport, driven by your hosts","Pick-up and drop-off, Penola / Coonawarra accommodation","All tasting fees included"] },
  { id:"p-warrawindi-escape", rezdy:"PTG4V2", category:"Stay & Tour Packages", name:"A Warrawindi Escape", subtitle:"Luxury off-grid retreat & private touring · 2 Nights · Penola", type:"private", duration:"2 Nights · 1 Day", departures:"On request", location:"Penola · Limestone Coast", accommodation:"Blue Wren Retreat, Warrawindi Escapes", minGuests:2, maxGuests:2, pricing:{ structure:"per_couple", tiers:[{label:"Per couple",retail:3975}], note:"On request" }, tags:["Stay & Tour","Off-Grid","Farm","Wildlife"], description:"Two nights at the architecturally designed Blue Wren Retreat on a 3,000-acre private sustainable farm, paired with a fully hosted day across the Limestone Coast.", inclusions:["Two nights at the Blue Wren Retreat, architecturally designed off-grid luxury","Cedar hot tub, open fireplace and sweeping bushland views","Premium Coonawarra wine and chocolate on arrival","Generous breakfast provisions throughout your stay","Freshly prepared roast dinner delivered to your retreat one evening","Privately hosted full-day tour, UNESCO Naracoorte Caves and premium Coonawarra tastings","Regional produce luncheon","Boutique olive grove tasting","Private kangaroo sanctuary encounter"] },
  { id:"p-wagyu-wine-stay", rezdy:"PYVHSJ", category:"Stay & Tour Packages", name:"Wagyu, Wine & Stay", subtitle:"Mayura Steakhouse · Penola apartment · Hosted Coonawarra tour", type:"private", duration:"2 Nights · 2 Days", departures:"Wed–Sun", location:"Penola · Coonawarra", accommodation:"Coonawarra Experiences Apartment, Penola", minGuests:2, maxGuests:2, pricing:{ structure:"per_couple", tiers:[{label:"Per couple",retail:1990}], note:"Adults only · Min/Max 2 · Dining Thu, Fri & Sat" }, tags:["Stay & Tour","Wagyu","Dining","Wine"], description:"Two nights in the heart of Penola, a five-course Wagyu degustation at the Mayura chef's table with matched museum-release wines, and a fully hosted day through Coonawarra's best cellar doors.", inclusions:["Two nights at the Coonawarra Experiences Apartment, Penola","Queen bedroom, living area and bathroom with underfloor heating","Continental breakfast provisions, wine and chocolate on arrival","Mayura Wagyu Steakhouse chef's table — five-course Wagyu degustation with matched museum-release wines","Fully hosted wine tour, exclusive tastings at 4–5 premium cellar doors","Hearty produce platter and exclusive Wynns Coonawarra Estate visit"] },
  { id:"p-grand-style", rezdy:"PVKWQL", category:"Stay & Tour Packages", name:"A Stay in Grand Style", subtitle:"Delgattie Estate · Period manor · 2 Nights · Mount Gambier", type:"private", duration:"2 Nights · 1 Day", departures:"On request", location:"Mount Gambier · Coonawarra", accommodation:"Delgattie Estate, Mount Gambier", minGuests:2, maxGuests:null, pricing:{ structure:"per_couple", tiers:[{label:"Per couple",retail:1850}], note:"On request · Three state rooms available" }, tags:["Stay & Tour","Heritage","History","Wine"], description:"Two nights at Delgattie Estate, a beautifully restored 1902 manor in the heart of Mount Gambier, paired with a full private day among Coonawarra's most celebrated cellar doors.", inclusions:["Two nights at Delgattie Estate, your choice of three state rooms","Delgattie sparkling wine on arrival","Breakfast at the Commodore Restaurant on site","Private full-day Coonawarra tour, personalised tastings at the region's top cellar doors","Icon wines and behind-the-scenes access at Wynns Coonawarra Estate","Seasonal set-menu luncheon","Private kangaroo sanctuary visit"] },
  { id:"p-arthurs", rezdy:"ARTHURS", category:"Stay & Tour Packages", name:"Arthur's on Commercial", subtitle:"Luxury Mount Gambier stay & private Coonawarra touring · 2–8 guests", type:"private", duration:"2 Nights · 1 Day", departures:"On request", location:"Mount Gambier · Coonawarra", accommodation:"Arthur's on Commercial, Mount Gambier", minGuests:2, maxGuests:8, pricing:{ structure:"tiered_per_couple_by_group", tiers:[{label:"2 guests",pax:2,retail:2650},{label:"4 guests",pax:4,retail:1790},{label:"6 guests",pax:6,retail:1545},{label:"8 guests",pax:8,retail:1395}], note:"Per couple, priced by group size" }, tags:["Stay & Tour","Group","Wine"], description:"Mount Gambier's newest luxury residence — four suites across two living spaces, paired with a full private day touring Coonawarra, scaled for groups of two to eight.", inclusions:["Two nights at Arthur's on Commercial, four suites and two living spaces","Full private day touring Coonawarra, personalised tastings at the region's top cellar doors","Private transfers to and from Mount Gambier throughout the day","Set-menu luncheon at one of the region's best venues","Privately hosted icon wine tasting at Wynns Coonawarra Estate"] },
  { id:"p-immerse-package", rezdy:"PEB4NQ", category:"Stay & Tour Packages", name:"Immerse Yourself in Coonawarra (Package)", subtitle:"Stay & tour · 2 Nights · Penola", type:"private", duration:"2 Nights · 1 Day", departures:"Daily · On request", location:"Penola · Coonawarra", accommodation:"Coonawarra Experiences Apartment, Penola", minGuests:2, maxGuests:null, pricing:{ structure:"per_couple", tiers:[{label:"Per couple",retail:945}], note:null }, tags:["Stay & Tour","Wine","Cellar Door"], description:"Two nights in the heart of Penola paired with a fully hosted day of the region's finest cellar doors — our most accessible stay-and-tour package.", inclusions:["Two nights at the Coonawarra Experiences Apartment, Penola","Queen bedroom, living area and bathroom with underfloor heating","Continental breakfast provisions, wine and chocolate on arrival","Fully hosted wine tour, exclusive tastings at 4–5 premium cellar doors","Hearty produce platter through the day","Exclusive visit to Wynns Coonawarra Estate, private cellar walking tour"] },
  { id:"p-great-ocean-road", rezdy:null, category:"Transfers & Journeys", name:"The Great Ocean Road", subtitle:"Fully hosted Melbourne to Coonawarra · 2 Days · 1 Night en route", type:"private", duration:"2 Days · 1 Night en route", departures:"On request", location:"Melbourne → Coonawarra", vehicle:"Toyota LandCruiser 300 Series", minGuests:2, maxGuests:null, pricing:{ structure:"on_request", tiers:[], note:"Price on request · Fully bespoke" }, tags:["Transfer","Great Ocean Road","Victoria","Hosted Journey"], description:"An unhurried, fully hosted journey from your Melbourne doorstep to the Limestone Coast — two days along Australia's most spectacular coastline in our Toyota LandCruiser 300 Series.", inclusions:["Door-to-door collection from Melbourne accommodation in the LandCruiser 300","Two days of fully hosted private touring along the Great Ocean Road","The Twelve Apostles, Gibson Steps and Loch Ard Gorge","Cape Otway Lightstation and Maits Rest rainforest walk","Wild koalas at Kennett River and historic Port Fairy","Overnight accommodation en route, tailored to your guests","Seamless arrival into Coonawarra"] },
  { id:"p-mayura", rezdy:null, category:"Experience Components", name:"Mayura Wagyu Steakhouse", subtitle:"Chef's table degustation · Penola", type:"component", duration:null, departures:"Thu–Sat (private on request)", location:"Penola", minGuests:null, maxGuests:null, pricing:{ structure:"component", tiers:[], note:"Priced as part of a package or on application" }, tags:["Wagyu","Dining","Chef's Table","Degustation"], description:"An exclusive chef's table degustation at Mayura Station's celebrated steakhouse — full-blood Wagyu across multiple cuts and courses, matched with regional wines.", inclusions:["Private chef's table degustation, full-blood Wagyu","Matched regional wines","Exclusive venue hire available on request"] },
  { id:"p-wynns", rezdy:null, category:"Experience Components", name:"Wynns Coonawarra Estate — Icon Tasting", subtitle:"VIP private tasting · Historic 1896 Gables winery", type:"component", duration:null, departures:null, location:"Coonawarra", minGuests:null, maxGuests:null, pricing:{ structure:"component", tiers:[], note:"Included in most day tours and packages" }, tags:["Wine","Cellar Door","Icon","Coonawarra"], description:"A VIP private tasting inside the historic 1896 Gables winery — icon and museum wines, barrel samples and a vineyard walk.", inclusions:["Private tasting of icon and museum-release wines","Barrel samples and behind-the-scenes access","Guided vineyard walk"] },
  { id:"p-kangaroo-sanctuary", rezdy:null, category:"Experience Components", name:"Private Kangaroo Sanctuary", subtitle:"Not open to the public", type:"component", duration:null, departures:null, location:"Limestone Coast", minGuests:null, maxGuests:null, pricing:{ structure:"component", tiers:[], note:"Included in select tours and packages" }, tags:["Wildlife","Kangaroos","Private","Nature"], description:"A private kangaroo sanctuary not open to the public — an intimate encounter with rescued and resident kangaroos in a relaxed, unhurried setting.", inclusions:["Private access to the kangaroo sanctuary","Hosted encounter with resident kangaroos","Exclusive to Coonawarra Experiences guests"] },
  { id:"p-blue-wren", rezdy:null, category:"Experience Components", name:"Blue Wren Retreat — Warrawindi Escapes", subtitle:"Off-grid luxury · 3,000-acre sustainable farm · Penola", type:"component", duration:null, departures:"On request", location:"Penola", minGuests:null, maxGuests:null, pricing:{ structure:"component", tiers:[], note:"Included in A Warrawindi Escape package or on application" }, tags:["Accommodation","Off-Grid","Farm","Retreat"], description:"Architecturally designed off-grid luxury on a 3,000-acre working sustainable farm. Cedar hot tub, open fireplace and sweeping bushland views.", inclusions:["Architecturally designed off-grid retreat","Cedar hot tub and open fireplace","Sweeping bushland views across the property","Welcome wine and provisions on arrival"] },
  { id:"p-ottelia", rezdy:null, category:"Experience Components", name:"Ottelia", subtitle:"Seasonal dining · Coonawarra", type:"component", duration:null, departures:null, location:"Coonawarra", minGuests:null, maxGuests:null, pricing:{ structure:"component", tiers:[], note:"Included in select tours and packages" }, tags:["Dining","Seasonal","Wine"], description:"One of Coonawarra's most celebrated dining experiences — a seasonal menu built around the region's finest produce, set within the Leconfield / Richard Hamilton cellar door.", inclusions:["Seasonal set-menu or à la carte dining","Matched Coonawarra wine list"] },
  { id:"p-confido", rezdy:null, category:"Experience Components", name:"Confido Olive Oil", subtitle:"Boutique olive grove tasting · Coonawarra", type:"component", duration:null, departures:null, location:"Coonawarra", minGuests:null, maxGuests:null, pricing:{ structure:"component", tiers:[], note:"Included in select tours and packages" }, tags:["Olive Oil","Produce","Artisan"], description:"A boutique olive oil experience with the makers at Confido — freshly pressed extra virgin olive oil, tasted straight from the grove.", inclusions:["Hosted olive oil tasting with the producers","Story of the Confido grove and production process","Freshly pressed extra virgin olive oil"] },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function uid() { return Math.random().toString(36).slice(2,9); }
function getProductById(id) { return PRODUCTS.find(p => p.id === id); }

function formatPrice(pricing) {
  const { structure, tiers } = pricing;
  if (structure === "on_request") return "Price on request";
  if (structure === "component") return "See package";
  if (structure === "per_adult") return `$${tiers[0].retail.toLocaleString()} per adult`;
  if (structure === "per_couple") return `$${tiers[0].retail.toLocaleString()} per couple`;
  if (structure === "tiered_per_person_by_group") { const lo=tiers[tiers.length-1].retail,hi=tiers[0].retail; return `$${lo}–$${hi} per person`; }
  if (structure === "tiered_per_couple_by_group") { const lo=tiers[tiers.length-1].retail,hi=tiers[0].retail; return `$${lo}–$${hi} per couple`; }
  return "";
}

function typeBadgeColor(type) {
  return type==="private" ? C.navy : type==="small_group" ? C.teal : C.grey400;
}

function newItinerary() {
  return { id:uid(), title:"New Itinerary", clientName:"", clientEmail:"", guestCount:2, startDate:"", origin:"Melbourne", status:"draft", notes:"", days:[{id:uid(),title:"Day 1",date:"",items:[],dayNotes:""}], createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() };
}

function saveToStorage(list) { try { localStorage.setItem("ce_itineraries_v6", JSON.stringify(list)); } catch(e){} }
function loadFromStorage() { try { const r=localStorage.getItem("ce_itineraries_v6"); return r?JSON.parse(r):[]; } catch(e){ return []; } }

// ─── Global CSS ───────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cabin:wght@400;600;700&family=PT+Serif:ital@0;1&family=Source+Sans+3:wght@300;400;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{margin:0;background:#faf9f6;font-family:'Source Sans 3','Open Sans',sans-serif;}
input,textarea,select{font-family:inherit;}
button{cursor:pointer;font-family:inherit;}
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-track{background:#f4f3f0;}
::-webkit-scrollbar-thumb{background:#d8c69d;border-radius:3px;}
@media print{
  .no-print{display:none!important;}
  body{background:white;}
  .print-break{page-break-before:always;}
  @page{margin:12mm;size:A4;}
}
`;

// ─── Badge ────────────────────────────────────────────────────────────────────
function Badge({ color, bg, children, xs }) {
  return (
    <span style={{ display:"inline-block", fontFamily:F.body, fontSize:xs?9:10, fontWeight:600,
      color:color||C.navy, background:bg||(color?`${color}18`:C.sandLight),
      border:`1px solid ${color?color+"30":C.sandDark}`, borderRadius:20,
      padding:xs?"1px 5px":"2px 8px", letterSpacing:"0.04em", textTransform:"uppercase" }}>
      {children}
    </span>
  );
}

// ─── Tiered price table ───────────────────────────────────────────────────────
function TierTable({ pricing }) {
  if (!["tiered_per_person_by_group","tiered_per_couple_by_group"].includes(pricing.structure)) return null;
  return (
    <table style={{width:"100%",borderCollapse:"collapse",marginTop:4}}>
      <tbody>{pricing.tiers.map(t=>(
        <tr key={t.label}>
          <td style={{fontFamily:F.body,fontSize:11,color:C.grey600,padding:"2px 0"}}>{t.label}</td>
          <td style={{fontFamily:F.heading,fontSize:12,color:C.terra,textAlign:"right",padding:"2px 0",fontWeight:700}}>${t.retail.toLocaleString()}</td>
        </tr>
      ))}</tbody>
    </table>
  );
}

// ─── Library card ─────────────────────────────────────────────────────────────
function LibraryCard({ product:p, onAdd, showInternal }) {
  const [open, setOpen] = useState(false);
  const isTiered = ["tiered_per_person_by_group","tiered_per_couple_by_group"].includes(p.pricing.structure);
  return (
    <div style={{ background:C.white, border:`1px solid ${C.grey200}`, borderRadius:8, overflow:"hidden", marginBottom:8 }}>
      <div style={{ background:C.navy, padding:"8px 12px" }}>
        <div style={{ fontFamily:F.body, fontSize:9, color:C.sand, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:2 }}>{p.category}</div>
        <div style={{ fontFamily:F.heading, fontSize:13, fontWeight:700, color:C.white, lineHeight:1.2 }}>{p.name}</div>
      </div>
      <div style={{ padding:"8px 12px" }}>
        <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:6 }}>
          <Badge color={typeBadgeColor(p.type)} xs>{p.type==="small_group"?"Small Group":p.type==="component"?"Component":"Private"}</Badge>
          {p.duration && <Badge xs>{p.duration}</Badge>}
          {p.departures && <Badge xs>{p.departures}</Badge>}
        </div>
        {isTiered ? <TierTable pricing={p.pricing}/> : (
          <div style={{ fontFamily:F.heading, fontSize:13, fontWeight:700, color:C.terra, marginBottom:4 }}>{formatPrice(p.pricing)}</div>
        )}
        {p.pricing.note && <div style={{ fontFamily:F.body, fontSize:10, color:C.grey400, marginBottom:4 }}>{p.pricing.note}</div>}
        {open && (
          <>
            <p style={{ fontFamily:F.body, fontSize:11, color:C.grey600, lineHeight:1.5, margin:"6px 0" }}>{p.description}</p>
            {p.inclusions?.length>0 && (
              <ul style={{ listStyle:"none", padding:0 }}>
                {p.inclusions.map((inc,i)=>(
                  <li key={i} style={{ fontFamily:F.body, fontSize:10, color:C.grey600, padding:"2px 0 2px 10px", position:"relative" }}>
                    <span style={{ position:"absolute",left:0,top:6,width:6,height:1,background:C.sand }}/>
                    {inc}
                  </li>
                ))}
              </ul>
            )}
            {showInternal && p.rezdy && (
              <div style={{ marginTop:6, fontFamily:F.body, fontSize:9, color:C.grey400, background:C.grey100, borderRadius:3, padding:"1px 5px", display:"inline-block" }}>Rezdy: {p.rezdy}</div>
            )}
          </>
        )}
        <div style={{ display:"flex", gap:6, marginTop:8 }}>
          <button onClick={()=>setOpen(o=>!o)} style={{ flex:1, fontFamily:F.body, fontSize:11, color:C.navy, background:"transparent", border:`1px solid ${C.grey200}`, borderRadius:5, padding:"4px 0" }}>{open?"Less":"Details"}</button>
          <button onClick={()=>onAdd(p)} style={{ flex:1, fontFamily:F.body, fontSize:11, fontWeight:600, color:C.white, background:C.terra, border:"none", borderRadius:5, padding:"4px 0" }}>+ Add</button>
        </div>
      </div>
    </div>
  );
}

// ─── Day item ─────────────────────────────────────────────────────────────────
function DayItem({ item, onRemove, onMoveUp, onMoveDown, onNoteChange, isFirst, isLast }) {
  const p = getProductById(item.productId);
  const [editNote, setEditNote] = useState(false);
  const [noteVal, setNoteVal] = useState(item.notes||"");
  if (!p) return null;
  return (
    <div style={{ background:C.white, border:`1px solid ${C.grey200}`, borderRadius:6, padding:"8px 10px", marginBottom:6, display:"flex", gap:8 }}>
      <div style={{ width:3, borderRadius:2, background:typeBadgeColor(p.type), flexShrink:0, alignSelf:"stretch" }}/>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontFamily:F.heading, fontSize:12, fontWeight:700, color:C.navy }}>{p.name}</div>
        {p.location && <div style={{ fontFamily:F.body, fontSize:10, color:C.grey400, marginTop:1 }}>{p.location}</div>}
        {p.duration && <div style={{ fontFamily:F.body, fontSize:10, color:C.teal }}>{p.duration}</div>}
        <div style={{ marginTop:4 }}>
          <span style={{ fontFamily:F.heading, fontSize:11, fontWeight:700, color:C.terra }}>{formatPrice(p.pricing)}</span>
        </div>
        {item.notes && !editNote && (
          <div style={{ fontFamily:F.body, fontSize:10, color:C.grey600, marginTop:4, fontStyle:"italic", borderLeft:`2px solid ${C.sand}`, paddingLeft:6 }}>{item.notes}</div>
        )}
        {editNote ? (
          <div style={{ marginTop:6 }}>
            <textarea value={noteVal} onChange={e=>setNoteVal(e.target.value)} rows={2}
              style={{ width:"100%", fontFamily:F.body, fontSize:11, border:`1px solid ${C.grey200}`, borderRadius:4, padding:"4px 6px", resize:"vertical", outline:"none" }}/>
            <div style={{ display:"flex", gap:4, marginTop:3 }}>
              <button onClick={()=>{ onNoteChange(item.id,noteVal); setEditNote(false); }} style={{ fontFamily:F.body,fontSize:10,fontWeight:600,color:C.white,background:C.teal,border:"none",borderRadius:4,padding:"2px 8px" }}>Save</button>
              <button onClick={()=>setEditNote(false)} style={{ fontFamily:F.body,fontSize:10,color:C.grey400,background:"transparent",border:`1px solid ${C.grey200}`,borderRadius:4,padding:"2px 8px" }}>Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={()=>setEditNote(true)} style={{ fontFamily:F.body,fontSize:10,color:C.grey400,background:"transparent",border:"none",padding:"3px 0",textDecoration:"underline" }}>
            {item.notes?"Edit note":"+ Add note"}
          </button>
        )}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:2, flexShrink:0 }}>
        {!isFirst && <button onClick={onMoveUp} style={{ width:20,height:20,fontFamily:F.body,fontSize:11,fontWeight:700,color:C.navy,background:"transparent",border:`1px solid ${C.grey200}`,borderRadius:3,padding:0,lineHeight:1 }}>↑</button>}
        {!isLast  && <button onClick={onMoveDown} style={{ width:20,height:20,fontFamily:F.body,fontSize:11,fontWeight:700,color:C.navy,background:"transparent",border:`1px solid ${C.grey200}`,borderRadius:3,padding:0,lineHeight:1 }}>↓</button>}
        <button onClick={onRemove} style={{ width:20,height:20,fontFamily:F.body,fontSize:13,fontWeight:700,color:C.terra,background:"transparent",border:`1px solid ${C.terra}40`,borderRadius:3,padding:0,lineHeight:1 }}>×</button>
      </div>
    </div>
  );
}

// ─── Day card ─────────────────────────────────────────────────────────────────
function DayCard({ day, dayIndex, totalDays, onUpdate, onAddItem, onRemoveItem, onMoveItem, onNoteChange, onRemove }) {
  const w = day.date ? WEATHER[new Date(day.date).getMonth()+1] : null;
  return (
    <div style={{ background:C.white, border:`1px solid ${C.grey200}`, borderRadius:10, overflow:"hidden", marginBottom:14 }}>
      {/* Header */}
      <div style={{ background:C.sandLight, borderBottom:`1px solid ${C.grey200}`, padding:"8px 12px", display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ fontFamily:F.body,fontSize:10,fontWeight:700,color:C.terra,letterSpacing:"0.1em",textTransform:"uppercase",flexShrink:0 }}>DAY {dayIndex+1}</span>
        <input value={day.title} onChange={e=>onUpdate({...day,title:e.target.value})}
          style={{ flex:1,fontFamily:F.heading,fontSize:14,fontWeight:700,color:C.navy,background:"transparent",border:"none",outline:"none" }}
          placeholder={`Day ${dayIndex+1}`}/>
        <input type="date" value={day.date} onChange={e=>onUpdate({...day,date:e.target.value})}
          style={{ fontFamily:F.body,fontSize:11,color:C.grey600,background:"transparent",border:"none",outline:"none",width:130 }}/>
        {w && (
          <div style={{ display:"flex",alignItems:"center",gap:4,background:C.white,border:`1px solid ${C.grey200}`,borderRadius:5,padding:"2px 7px",flexShrink:0 }}>
            <span style={{ fontSize:13 }}>{w.icon}</span>
            <div>
              <div style={{ fontFamily:F.body,fontSize:9,fontWeight:600,color:C.navy }}>{w.temp}</div>
              <div style={{ fontFamily:F.body,fontSize:9,color:C.grey400 }}>Rain: {w.rain}</div>
            </div>
          </div>
        )}
        {totalDays > 1 && (
          <button onClick={onRemove} style={{ fontFamily:F.body,fontSize:10,color:C.terra,background:"transparent",border:`1px solid ${C.terra}40`,borderRadius:4,padding:"2px 8px" }}>Remove</button>
        )}
      </div>
      {w && <div style={{ background:`${C.teal}08`,borderBottom:`1px solid ${C.grey100}`,padding:"5px 12px",fontFamily:F.serif,fontSize:11,color:C.grey600,fontStyle:"italic" }}>{w.note}</div>}
      <div style={{ padding:12 }}>
        {day.items.length===0 && (
          <div style={{ textAlign:"center",padding:"16px 0",color:C.grey400,fontFamily:F.body,fontSize:12,border:`1px dashed ${C.grey200}`,borderRadius:6,marginBottom:8 }}>Add experiences from the library</div>
        )}
        {day.items.map((item,idx)=>(
          <DayItem key={item.id} item={item} isFirst={idx===0} isLast={idx===day.items.length-1}
            onRemove={()=>onRemoveItem(day.id,item.id)}
            onMoveUp={()=>onMoveItem(day.id,idx,-1)}
            onMoveDown={()=>onMoveItem(day.id,idx,1)}
            onNoteChange={(itemId,note)=>onNoteChange(day.id,itemId,note)}
          />
        ))}
        <textarea value={day.dayNotes} onChange={e=>onUpdate({...day,dayNotes:e.target.value})}
          placeholder="Day notes (optional overview for this day)..."
          style={{ width:"100%",fontFamily:F.body,fontSize:11,color:C.text,border:`1px solid ${C.grey200}`,borderRadius:6,padding:"6px 10px",resize:"vertical",minHeight:36,outline:"none",marginTop:4 }}/>
      </div>
    </div>
  );
}

// ─── Preview ──────────────────────────────────────────────────────────────────
function Preview({ itinerary, showInternal }) {
  return (
    <div style={{ fontFamily:F.body, color:C.text, maxWidth:860, margin:"0 auto" }}>
      {/* Cover */}
      <div style={{ background:C.navy, borderRadius:10, padding:"28px 32px", marginBottom:20, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute",top:0,right:0,width:100,height:100,background:C.teal,opacity:0.12,borderRadius:"0 0 0 100%" }}/>
        <div style={{ fontFamily:F.body,fontSize:9,color:C.sand,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:6 }}>Coonawarra Experiences</div>
        <div style={{ fontFamily:F.heading,fontSize:26,fontWeight:700,color:C.white,lineHeight:1.15,marginBottom:4 }}>{itinerary.title||"Private Itinerary"}</div>
        {itinerary.clientName && <div style={{ fontFamily:F.serif,fontSize:13,fontStyle:"italic",color:C.sand,marginBottom:10 }}>Prepared for {itinerary.clientName}</div>}
        <div style={{ display:"flex",gap:16,flexWrap:"wrap",marginTop:14 }}>
          {itinerary.startDate && <div style={{ fontFamily:F.body,fontSize:11,color:"rgba(255,255,255,0.65)" }}><span style={{ color:C.sand,fontWeight:600 }}>Departure</span> · {new Date(itinerary.startDate).toLocaleDateString("en-AU",{day:"numeric",month:"long",year:"numeric"})}</div>}
          {itinerary.guestCount && <div style={{ fontFamily:F.body,fontSize:11,color:"rgba(255,255,255,0.65)" }}><span style={{ color:C.sand,fontWeight:600 }}>Guests</span> · {itinerary.guestCount}</div>}
          <div style={{ fontFamily:F.body,fontSize:11,color:"rgba(255,255,255,0.65)" }}><span style={{ color:C.sand,fontWeight:600 }}>Duration</span> · {itinerary.days.length} {itinerary.days.length===1?"day":"days"}</div>
          {itinerary.origin && <div style={{ fontFamily:F.body,fontSize:11,color:"rgba(255,255,255,0.65)" }}><span style={{ color:C.sand,fontWeight:600 }}>Origin</span> · {itinerary.origin}</div>}
        </div>
        <div style={{ marginTop:16,paddingTop:12,borderTop:`1px solid rgba(255,255,255,0.12)`,fontFamily:F.body,fontSize:9,color:"rgba(255,255,255,0.4)" }}>
          Valid 1 April 2027 – 31 March 2028 · AUD incl. 10% GST
        </div>
      </div>

      {/* Days */}
      {itinerary.days.map((day,di)=>{
        const w = day.date ? WEATHER[new Date(day.date).getMonth()+1] : null;
        return (
          <div key={day.id} className="print-break" style={{ marginBottom:20 }}>
            <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10,paddingBottom:8,borderBottom:`2px solid ${C.sand}` }}>
              <span style={{ fontFamily:F.body,fontSize:9,fontWeight:700,color:C.terra,letterSpacing:"0.1em",textTransform:"uppercase" }}>DAY {di+1}</span>
              <span style={{ fontFamily:F.heading,fontSize:18,fontWeight:700,color:C.navy,flex:1 }}>{day.title}</span>
              {day.date && <span style={{ fontFamily:F.body,fontSize:11,color:C.grey400 }}>{new Date(day.date).toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"long"})}</span>}
              {w && (
                <div style={{ display:"flex",alignItems:"center",gap:4,background:C.grey100,borderRadius:5,padding:"3px 8px" }}>
                  <span style={{ fontSize:13 }}>{w.icon}</span>
                  <div><div style={{ fontFamily:F.body,fontSize:10,fontWeight:600,color:C.navy }}>{w.month} · {w.temp}</div><div style={{ fontFamily:F.body,fontSize:9,color:C.grey400 }}>Rainfall: {w.rain}</div></div>
                </div>
              )}
            </div>
            {w && <div style={{ fontFamily:F.serif,fontSize:12,fontStyle:"italic",color:C.grey600,marginBottom:12,paddingLeft:10,borderLeft:`2px solid ${C.sand}` }}>{w.note}</div>}
            {day.dayNotes && <div style={{ fontFamily:F.body,fontSize:12,color:C.grey600,marginBottom:14,padding:"10px 12px",background:C.sandLight,borderRadius:6 }}>{day.dayNotes}</div>}
            {day.items.map(item=>{
              const p=getProductById(item.productId);
              if(!p) return null;
              const isTiered=["tiered_per_person_by_group","tiered_per_couple_by_group"].includes(p.pricing.structure);
              return (
                <div key={item.id} style={{ background:C.white,border:`1px solid ${C.grey200}`,borderRadius:8,overflow:"hidden",marginBottom:10,borderLeft:`4px solid ${typeBadgeColor(p.type)}` }}>
                  <div style={{ padding:"12px 14px" }}>
                    <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:6 }}>
                      <div>
                        <div style={{ fontFamily:F.heading,fontSize:14,fontWeight:700,color:C.navy }}>{p.name}</div>
                        {p.location && <div style={{ fontFamily:F.body,fontSize:11,color:C.grey400,marginTop:1 }}>{p.location}</div>}
                      </div>
                      <div style={{ textAlign:"right",flexShrink:0 }}>
                        <div style={{ fontFamily:F.heading,fontSize:13,fontWeight:700,color:C.terra }}>{formatPrice(p.pricing)}</div>
                        {isTiered && <div style={{ fontFamily:F.body,fontSize:10,color:C.grey400 }}>{p.pricing.note}</div>}
                      </div>
                    </div>
                    <div style={{ display:"flex",gap:5,flexWrap:"wrap",marginBottom:8 }}>
                      <Badge color={typeBadgeColor(p.type)} xs>{p.type==="small_group"?"Small Group":p.type==="component"?"Component":"Private"}</Badge>
                      {p.duration && <Badge xs>{p.duration}</Badge>}
                      {p.departures && <Badge xs>{p.departures}</Badge>}
                    </div>
                    <p style={{ fontFamily:F.body,fontSize:12,color:C.grey600,lineHeight:1.5,marginBottom:8 }}>{p.description}</p>
                    {item.notes && <div style={{ fontFamily:F.body,fontSize:11,fontStyle:"italic",color:C.navy,background:C.sandLight,borderRadius:5,padding:"6px 10px",marginBottom:8 }}>Note: {item.notes}</div>}
                    {isTiered && (
                      <table style={{ borderCollapse:"collapse",marginBottom:8 }}>
                        <tbody>{p.pricing.tiers.map(t=>(
                          <tr key={t.label}>
                            <td style={{ fontFamily:F.body,fontSize:11,color:C.grey600,padding:"1px 12px 1px 0" }}>{t.label}</td>
                            <td style={{ fontFamily:F.heading,fontSize:12,color:C.terra,fontWeight:700 }}>${t.retail.toLocaleString()}</td>
                          </tr>
                        ))}</tbody>
                      </table>
                    )}
                    {p.inclusions?.length>0 && (
                      <div>
                        <div style={{ fontFamily:F.body,fontSize:9,fontWeight:700,color:C.grey400,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4 }}>Included</div>
                        <ul style={{ listStyle:"none",padding:0,columns:2,gap:12 }}>
                          {p.inclusions.map((inc,i)=>(
                            <li key={i} style={{ fontFamily:F.body,fontSize:11,color:C.grey600,paddingLeft:10,position:"relative",marginBottom:2,breakInside:"avoid" }}>
                              <span style={{ position:"absolute",left:0,top:5,width:5,height:1,background:C.teal }}/>
                              {inc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {showInternal && p.rezdy && <div style={{ marginTop:6,fontFamily:F.body,fontSize:9,color:C.grey400,background:C.grey100,borderRadius:3,padding:"1px 5px",display:"inline-block" }}>Rezdy: {p.rezdy}</div>}
                  </div>
                </div>
              );
            })}
            {day.items.length===0 && <div style={{ textAlign:"center",padding:16,color:C.grey400,fontFamily:F.body,fontSize:12,border:`1px dashed ${C.grey200}`,borderRadius:6 }}>No experiences added to this day</div>}
          </div>
        );
      })}

      {/* Footer */}
      <div style={{ background:C.navy,borderRadius:10,padding:"18px 24px" }}>
        <div style={{ fontFamily:F.serif,fontSize:13,fontStyle:"italic",color:C.sand,marginBottom:10 }}>"Hosted journeys of wine country and beyond."</div>
        <div style={{ display:"flex",gap:20,flexWrap:"wrap" }}>
          {[["Phone","1800 861 190"],["Email","info@coonawarraexperiences.com.au"],["Web","coonawarraexperiences.com.au"]].map(([k,v])=>(
            <div key={k} style={{ fontFamily:F.body,fontSize:11,color:"rgba(255,255,255,0.6)" }}><span style={{ color:C.sand,fontWeight:600 }}>{k}</span> {v}</div>
          ))}
        </div>
        {itinerary.notes && <div style={{ marginTop:10,paddingTop:10,borderTop:`1px solid rgba(255,255,255,0.12)`,fontFamily:F.body,fontSize:11,color:"rgba(255,255,255,0.5)" }}>{itinerary.notes}</div>}
      </div>
    </div>
  );
}

// ─── Status helpers ───────────────────────────────────────────────────────────
const STATUS_COLOR = { draft:C.grey400, review:C.teal, published:C.terra };
const STATUS_LABEL = { draft:"Draft", review:"In Review", published:"Published" };

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab]           = useState("builder");
  const [bView, setBView]       = useState("edit");
  const [showInternal, setSI]   = useState(false);
  const [itineraries, setIts]   = useState(()=>loadFromStorage());
  const [activeId, setActiveId] = useState(null);
  const [libCat, setLibCat]     = useState("All");
  const [libSearch, setLibSrch] = useState("");

  const active = itineraries.find(i=>i.id===activeId)||null;

  function mutate(fn) {
    setIts(prev=>{
      const next = prev.map(i=>i.id===activeId?{...fn(i),updatedAt:new Date().toISOString()}:i);
      saveToStorage(next);
      return next;
    });
  }

  function createNew() {
    const it=newItinerary();
    const next=[it,...itineraries];
    setIts(next); saveToStorage(next);
    setActiveId(it.id); setTab("builder"); setBView("edit");
  }

  function deleteIt(id) {
    if(!confirm("Delete this itinerary?")) return;
    const next=itineraries.filter(i=>i.id!==id);
    setIts(next); saveToStorage(next);
    if(activeId===id) setActiveId(null);
  }

  function dupIt(it) {
    const c={...JSON.parse(JSON.stringify(it)),id:uid(),title:it.title+" (copy)",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
    const next=[c,...itineraries]; setIts(next); saveToStorage(next);
    setActiveId(c.id); setTab("builder"); setBView("edit");
  }

  function addDay() { mutate(it=>({...it,days:[...it.days,{id:uid(),title:`Day ${it.days.length+1}`,date:"",items:[],dayNotes:""}]})); }
  function removeDay(dayId) { mutate(it=>({...it,days:it.days.filter(d=>d.id!==dayId)})); }
  function updateDay(d) { mutate(it=>({...it,days:it.days.map(x=>x.id===d.id?d:x)})); }
  function addItem(dayId,product) {
    const item={id:uid(),productId:product.id,notes:""};
    mutate(it=>({...it,days:it.days.map(d=>d.id===dayId?{...d,items:[...d.items,item]}:d)}));
  }
  function removeItem(dayId,itemId) { mutate(it=>({...it,days:it.days.map(d=>d.id===dayId?{...d,items:d.items.filter(i=>i.id!==itemId)}:d)})); }
  function moveItem(dayId,idx,dir) {
    mutate(it=>({...it,days:it.days.map(d=>{
      if(d.id!==dayId) return d;
      const items=[...d.items]; const ni=idx+dir;
      if(ni<0||ni>=items.length) return d;
      [items[idx],items[ni]]=[items[ni],items[idx]];
      return {...d,items};
    })}));
  }
  function updateNote(dayId,itemId,note) {
    mutate(it=>({...it,days:it.days.map(d=>d.id===dayId?{...d,items:d.items.map(i=>i.id===itemId?{...i,notes:note}:i)}:d)}));
  }

  const filtered = PRODUCTS.filter(p=>{
    const catOk = libCat==="All" || p.category===libCat;
    const s=libSearch.toLowerCase();
    const srchOk = !s || p.name.toLowerCase().includes(s) || p.tags?.some(t=>t.toLowerCase().includes(s)) || (showInternal&&p.rezdy?.toLowerCase().includes(s));
    return catOk && srchOk;
  });

  const CATS = ["All","Day Tours","Stay & Tour Packages","Transfers & Journeys","Experience Components"];
  const CAT_SHORT = {"All":"All","Day Tours":"Day Tours","Stay & Tour Packages":"Packages","Transfers & Journeys":"Transfers","Experience Components":"Components"};

  return (
    <div style={{ minHeight:"100vh", background:C.offWhite }}>
      <style>{CSS}</style>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="no-print" style={{ background:C.navy, position:"sticky", top:0, zIndex:200, boxShadow:"0 2px 12px rgba(25,41,87,0.2)" }}>
        <div style={{ maxWidth:1600, margin:"0 auto", padding:"10px 18px", display:"flex", alignItems:"center", gap:10 }}>
          {/* Logo */}
          <div style={{ display:"flex",alignItems:"center",gap:8,marginRight:8,flexShrink:0 }}>
            <div style={{ width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${C.teal},${C.terra})`,display:"flex",alignItems:"center",justifyContent:"center" }}>
              <span style={{ color:C.white,fontSize:12,fontWeight:700,fontFamily:F.heading }}>CE</span>
            </div>
            <div>
              <div style={{ fontFamily:F.heading,fontSize:12,fontWeight:700,color:C.white,letterSpacing:"0.04em",textTransform:"uppercase" }}>Coonawarra Experiences</div>
              <div style={{ fontFamily:F.body,fontSize:9,color:C.sand,letterSpacing:"0.08em",textTransform:"uppercase" }}>Itinerary Builder · 2027/2028</div>
            </div>
          </div>

          {/* Main tabs */}
          <div style={{ display:"flex",gap:3 }}>
            {[{k:"builder",l:active?`Builder — ${active.title}`:"Builder"},{k:"saved",l:`Saved (${itineraries.length})`}].map(({k,l})=>(
              <button key={k} onClick={()=>setTab(k)} style={{ fontFamily:F.body,fontSize:12,fontWeight:tab===k?600:400,color:tab===k?C.white:"rgba(255,255,255,0.5)",background:tab===k?"rgba(255,255,255,0.12)":"transparent",border:"none",borderRadius:5,padding:"5px 12px" }}>{l}</button>
            ))}
          </div>

          {/* Builder sub-tabs */}
          {tab==="builder" && active && (
            <div style={{ display:"flex",gap:3,marginLeft:4 }}>
              {[{k:"edit",l:"Edit"},{k:"preview",l:"Preview"}].map(({k,l})=>(
                <button key={k} onClick={()=>setBView(k)} style={{ fontFamily:F.body,fontSize:11,fontWeight:bView===k?600:400,color:bView===k?C.navy:"rgba(255,255,255,0.55)",background:bView===k?C.sand:"transparent",border:"none",borderRadius:5,padding:"4px 10px" }}>{l}</button>
              ))}
            </div>
          )}

          <div style={{ flex:1 }}/>

          {/* Internal toggle */}
          <div onClick={()=>setSI(v=>!v)} style={{ display:"flex",alignItems:"center",gap:5,padding:"4px 10px",background:"rgba(255,255,255,0.06)",borderRadius:5,border:`1px solid rgba(255,255,255,0.1)`,cursor:"pointer" }}>
            <div style={{ width:26,height:14,borderRadius:7,background:showInternal?C.teal:"rgba(255,255,255,0.18)",position:"relative",transition:"background 0.2s",flexShrink:0 }}>
              <div style={{ position:"absolute",top:2,left:showInternal?12:2,width:10,height:10,borderRadius:"50%",background:C.white,transition:"left 0.2s" }}/>
            </div>
            <span style={{ fontFamily:F.body,fontSize:11,color:"rgba(255,255,255,0.65)",userSelect:"none" }}>Internal</span>
          </div>

          <button onClick={createNew} style={{ fontFamily:F.heading,fontSize:10,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:C.white,background:C.terra,border:"none",borderRadius:5,padding:"6px 12px" }}>+ New</button>

          {tab==="builder" && active && bView==="preview" && (
            <button onClick={()=>window.print()} style={{ fontFamily:F.heading,fontSize:10,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:C.navy,background:C.sand,border:"none",borderRadius:5,padding:"6px 12px" }}>Print / PDF</button>
          )}
        </div>
        {/* Season bar */}
        <div style={{ background:C.sand,padding:"4px 18px",display:"flex",gap:16,alignItems:"center" }}>
          <span style={{ fontFamily:F.body,fontSize:10,fontWeight:700,color:C.navy,letterSpacing:"0.06em",textTransform:"uppercase" }}>Season 2027 / 2028</span>
          <span style={{ fontFamily:F.body,fontSize:10,color:C.grey600 }}>Valid 1 April 2027 – 31 March 2028 · AUD incl. 10% GST</span>
          {showInternal && <span style={{ fontFamily:F.body,fontSize:10,fontWeight:600,color:C.teal }}>Internal view on</span>}
        </div>
      </header>

      {/* ── Saved tab ─────────────────────────────────────────────────────── */}
      {tab==="saved" && (
        <div className="no-print" style={{ maxWidth:860,margin:"28px auto",padding:"0 18px" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18 }}>
            <div style={{ fontFamily:F.heading,fontSize:18,fontWeight:700,color:C.navy }}>Saved Itineraries</div>
            <button onClick={createNew} style={{ fontFamily:F.heading,fontSize:10,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:C.white,background:C.terra,border:"none",borderRadius:5,padding:"7px 14px" }}>+ New</button>
          </div>
          {itineraries.length===0 ? (
            <div style={{ textAlign:"center",padding:"50px 20px",background:C.white,borderRadius:10,border:`1px solid ${C.grey200}` }}>
              <div style={{ fontFamily:F.heading,fontSize:15,color:C.navy,marginBottom:6 }}>No itineraries yet</div>
              <div style={{ fontFamily:F.body,fontSize:12,color:C.grey400,marginBottom:14 }}>Create your first itinerary to get started.</div>
              <button onClick={createNew} style={{ fontFamily:F.heading,fontSize:10,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:C.white,background:C.terra,border:"none",borderRadius:5,padding:"7px 16px" }}>+ New Itinerary</button>
            </div>
          ) : itineraries.map(it=>(
            <div key={it.id} style={{ background:C.white,border:`2px solid ${activeId===it.id?C.teal:C.grey200}`,borderRadius:10,padding:"12px 16px",marginBottom:8,display:"flex",alignItems:"center",gap:12 }}>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:3 }}>
                  <span style={{ fontFamily:F.heading,fontSize:14,fontWeight:700,color:C.navy }}>{it.title}</span>
                  <span style={{ fontFamily:F.body,fontSize:9,fontWeight:700,color:STATUS_COLOR[it.status],background:`${STATUS_COLOR[it.status]}18`,border:`1px solid ${STATUS_COLOR[it.status]}30`,borderRadius:10,padding:"1px 6px",letterSpacing:"0.04em",textTransform:"uppercase" }}>{STATUS_LABEL[it.status]}</span>
                </div>
                <div style={{ fontFamily:F.body,fontSize:11,color:C.grey400,display:"flex",gap:10,flexWrap:"wrap" }}>
                  {it.clientName && <span>{it.clientName}</span>}
                  <span>{it.days.length} {it.days.length===1?"day":"days"}</span>
                  {it.startDate && <span>{new Date(it.startDate).toLocaleDateString("en-AU",{day:"numeric",month:"short",year:"numeric"})}</span>}
                  <span>Updated {new Date(it.updatedAt).toLocaleDateString("en-AU")}</span>
                </div>
              </div>
              <div style={{ display:"flex",gap:5,flexShrink:0 }}>
                <button onClick={()=>{setActiveId(it.id);setTab("builder");setBView("edit");}} style={{ fontFamily:F.body,fontSize:11,fontWeight:600,color:C.white,background:C.navy,border:"none",borderRadius:5,padding:"5px 12px" }}>Open</button>
                <button onClick={()=>dupIt(it)} style={{ fontFamily:F.body,fontSize:11,color:C.navy,background:"transparent",border:`1px solid ${C.grey200}`,borderRadius:5,padding:"5px 10px" }}>Copy</button>
                <button onClick={()=>deleteIt(it.id)} style={{ fontFamily:F.body,fontSize:11,color:C.terra,background:"transparent",border:`1px solid ${C.terra}40`,borderRadius:5,padding:"5px 10px" }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Builder tab ────────────────────────────────────────────────────── */}
      {tab==="builder" && (
        !active ? (
          <div style={{ textAlign:"center",padding:"70px 20px" }}>
            <div style={{ fontFamily:F.heading,fontSize:18,color:C.navy,marginBottom:6 }}>No itinerary open</div>
            <div style={{ fontFamily:F.body,fontSize:13,color:C.grey400,marginBottom:18 }}>Create a new itinerary or open a saved one.</div>
            <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
              <button onClick={createNew} style={{ fontFamily:F.heading,fontSize:11,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:C.white,background:C.terra,border:"none",borderRadius:6,padding:"9px 22px" }}>+ New Itinerary</button>
              <button onClick={()=>setTab("saved")} style={{ fontFamily:F.heading,fontSize:11,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:C.navy,background:C.white,border:`1px solid ${C.grey200}`,borderRadius:6,padding:"9px 22px" }}>Open Saved</button>
            </div>
          </div>
        ) : bView==="preview" ? (
          <div style={{ padding:"20px 18px" }}>
            <Preview itinerary={active} showInternal={showInternal}/>
          </div>
        ) : (
          /* Edit view */
          <div className="no-print" style={{ display:"grid", gridTemplateColumns:"290px 1fr", height:"calc(100vh - 84px)", overflow:"hidden" }}>

            {/* Left: Library */}
            <div style={{ background:C.white, borderRight:`1px solid ${C.grey200}`, display:"flex", flexDirection:"column", overflow:"hidden" }}>
              <div style={{ padding:"10px 12px", borderBottom:`1px solid ${C.grey200}`, background:C.grey100 }}>
                <div style={{ fontFamily:F.heading,fontSize:10,fontWeight:700,color:C.grey400,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:7 }}>Product Library</div>
                <input value={libSearch} onChange={e=>setLibSrch(e.target.value)} placeholder="Search products..."
                  style={{ width:"100%",fontFamily:F.body,fontSize:12,border:`1px solid ${C.grey200}`,borderRadius:5,padding:"5px 9px",outline:"none",background:C.white,marginBottom:7 }}/>
                <div style={{ display:"flex",flexWrap:"wrap",gap:3 }}>
                  {CATS.map(cat=>(
                    <button key={cat} onClick={()=>setLibCat(cat)} style={{ fontFamily:F.body,fontSize:9,fontWeight:libCat===cat?700:400,color:libCat===cat?C.white:C.grey600,background:libCat===cat?C.navy:"transparent",border:libCat===cat?"none":`1px solid ${C.grey200}`,borderRadius:10,padding:"2px 7px" }}>{CAT_SHORT[cat]}</button>
                  ))}
                </div>
              </div>
              <div style={{ flex:1,overflowY:"auto",padding:8 }}>
                {filtered.length===0
                  ? <div style={{ textAlign:"center",padding:24,color:C.grey400,fontFamily:F.body,fontSize:12 }}>No products match</div>
                  : filtered.map(p=>(
                    <LibraryCard key={p.id} product={p} showInternal={showInternal}
                      onAdd={product=>{ if(active.days.length>0) addItem(active.days[active.days.length-1].id,product); }}
                    />
                  ))
                }
              </div>
            </div>

            {/* Right: Builder */}
            <div style={{ display:"flex",flexDirection:"column",overflow:"hidden" }}>
              {/* Meta bar */}
              <div style={{ background:C.white,borderBottom:`1px solid ${C.grey200}`,padding:"8px 14px" }}>
                <div style={{ display:"flex",gap:8,flexWrap:"wrap",alignItems:"center" }}>
                  <input value={active.title} onChange={e=>mutate(it=>({...it,title:e.target.value}))}
                    style={{ fontFamily:F.heading,fontSize:15,fontWeight:700,color:C.navy,border:"none",outline:"none",background:"transparent",flex:"1 1 180px",minWidth:0 }} placeholder="Itinerary title"/>
                  <input value={active.clientName} onChange={e=>mutate(it=>({...it,clientName:e.target.value}))} placeholder="Client name"
                    style={{ fontFamily:F.body,fontSize:12,color:C.text,border:`1px solid ${C.grey200}`,borderRadius:5,padding:"4px 8px",outline:"none",width:150 }}/>
                  <input value={active.clientEmail} onChange={e=>mutate(it=>({...it,clientEmail:e.target.value}))} placeholder="Client email"
                    style={{ fontFamily:F.body,fontSize:12,color:C.text,border:`1px solid ${C.grey200}`,borderRadius:5,padding:"4px 8px",outline:"none",width:180 }}/>
                  <input type="number" value={active.guestCount} onChange={e=>mutate(it=>({...it,guestCount:parseInt(e.target.value)||2}))} min={1} max={20} title="Guest count"
                    style={{ fontFamily:F.body,fontSize:12,color:C.text,border:`1px solid ${C.grey200}`,borderRadius:5,padding:"4px 8px",outline:"none",width:60 }}/>
                  <input type="date" value={active.startDate} onChange={e=>mutate(it=>({...it,startDate:e.target.value}))}
                    style={{ fontFamily:F.body,fontSize:12,color:C.text,border:`1px solid ${C.grey200}`,borderRadius:5,padding:"4px 8px",outline:"none" }}/>
                  <input value={active.origin} onChange={e=>mutate(it=>({...it,origin:e.target.value}))} placeholder="Origin city"
                    style={{ fontFamily:F.body,fontSize:12,color:C.text,border:`1px solid ${C.grey200}`,borderRadius:5,padding:"4px 8px",outline:"none",width:120 }}/>
                  <select value={active.status} onChange={e=>mutate(it=>({...it,status:e.target.value}))}
                    style={{ fontFamily:F.body,fontSize:12,color:STATUS_COLOR[active.status],fontWeight:600,border:`1px solid ${C.grey200}`,borderRadius:5,padding:"4px 7px",outline:"none",background:C.white }}>
                    <option value="draft">Draft</option>
                    <option value="review">In Review</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              {/* Days scroll area */}
              <div style={{ flex:1,overflowY:"auto",padding:"14px 14px 28px" }}>
                {active.days.map((day,di)=>(
                  <DayCard key={day.id} day={day} dayIndex={di} totalDays={active.days.length}
                    onUpdate={updateDay}
                    onAddItem={addItem}
                    onRemoveItem={removeItem}
                    onMoveItem={moveItem}
                    onNoteChange={updateNote}
                    onRemove={()=>removeDay(day.id)}
                  />
                ))}
                <button onClick={addDay} style={{ width:"100%",fontFamily:F.body,fontSize:13,fontWeight:600,color:C.navy,background:C.white,border:`2px dashed ${C.grey200}`,borderRadius:10,padding:"13px",transition:"border-color 0.15s" }}>
                  + Add Day
                </button>
                <div style={{ marginTop:14 }}>
                  <div style={{ fontFamily:F.body,fontSize:10,fontWeight:700,color:C.grey400,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:5 }}>Notes (appear in itinerary footer)</div>
                  <textarea value={active.notes} onChange={e=>mutate(it=>({...it,notes:e.target.value}))} placeholder="Add any notes or terms to appear in the itinerary footer..."
                    style={{ width:"100%",fontFamily:F.body,fontSize:12,color:C.text,border:`1px solid ${C.grey200}`,borderRadius:6,padding:"8px 12px",resize:"vertical",minHeight:56,outline:"none" }}/>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
