import { useState, useRef } from "react";

const C = {
  navy:"#192957",sand:"#d8c69d",sandLight:"#f0ead8",sandDark:"#b8a678",
  teal:"#40c0c0",terra:"#d34727",white:"#ffffff",offWhite:"#faf9f6",
  grey100:"#f4f3f0",grey200:"#e8e6e0",grey400:"#9e9b92",grey600:"#5c5a54",text:"#1a1917",
};
const F = {
  heading:"'Cabin','Arial Black',sans-serif",
  serif:"'PT Serif',Georgia,serif",
  body:"'Source Sans 3','Source Sans Pro','Open Sans',sans-serif",
};

const WEATHER = {
  1:{month:"January",temp:"20–34°C",rain:"Low",icon:"☀️",note:"Peak summer. Hot days, long light evenings. Book shade and water."},
  2:{month:"February",temp:"20–33°C",rain:"Low",icon:"☀️",note:"Still hot. Vintage begins in Coonawarra. Cellar doors buzzing."},
  3:{month:"March",temp:"16–28°C",rain:"Low",icon:"🌤️",note:"Vintage season. Warm days, cooler evenings. Ideal touring weather."},
  4:{month:"April",temp:"12–22°C",rain:"Medium",icon:"🌤️",note:"Autumn colours in the vineyard. Pleasant days, cool nights."},
  5:{month:"May",temp:"9–18°C",rain:"Medium",icon:"🌥️",note:"Shoulder season. Quieter, good value. Layers recommended."},
  6:{month:"June",temp:"6–14°C",rain:"High",icon:"🌧️",note:"Winter. Fires in the cellar doors. Hot lunches at their best."},
  7:{month:"July",temp:"5–13°C",rain:"High",icon:"🌧️",note:"Coldest month. Warm layers, waterproof jacket and sturdy shoes."},
  8:{month:"August",temp:"6–14°C",rain:"High",icon:"🌧️",note:"Winter wrapping up. Kangaroos very active at dusk."},
  9:{month:"September",temp:"8–17°C",rain:"Medium",icon:"🌤️",note:"Spring. Vines budding. Wildflowers along the coast."},
  10:{month:"October",temp:"11–21°C",rain:"Low",icon:"🌤️",note:"Perfect touring weather. Peak season begins."},
  11:{month:"November",temp:"13–25°C",rain:"Low",icon:"☀️",note:"Warm and sunny. Book ahead — popular season."},
  12:{month:"December",temp:"16–28°C",rain:"Low",icon:"☀️",note:"Summer holidays. Festive atmosphere in the cellar doors."},
};

const DEFAULT_TERMS = `Rates & Availability
All prices are in Australian Dollars (AUD) and include 10% GST. Rates are valid for the 2027/2028 season (1 April 2027 – 31 March 2028) and are subject to availability at the time of booking. Prices may be subject to a public holiday surcharge.

Booking & Payment
A 10% deposit secures your booking. The balance is due 30 days prior to arrival. Bookings made within 30 days of departure require full payment at the time of booking. All bookings are confirmed in writing.

Cancellation Policy
Private tours and packages: cancellations made 31 or more days prior incur no fee; 16–30 days, 25% of the total; 8–15 days, 50%; 7 days or fewer, 100%. Cancellations must be made in writing.

Changes by Us
Touring in regional South Australia is subject to weather and operational conditions. We reserve the right to amend itineraries where necessary. Comparable alternatives will be provided wherever possible. A full refund will be provided if we cancel due to unsafe conditions.

Insurance
International guests must hold comprehensive travel insurance. Coonawarra Experiences holds public liability insurance. Any loss or damage while on tour remains the risk of the individual.

Contact
Simon & Kerry Meares · 1800 861 190 · info@coonawarraexperiences.com.au · coonawarraexperiences.com.au`;

const BUILT_IN_PRODUCTS = [
  {id:"p-uncle-ken",rezdy:"UNCLEKEN",category:"Day Tours",name:"On Country with Uncle Ken",subtitle:"Private cultural experience · Port MacDonnell",type:"private",duration:"3.5 hrs + coastal lunch",departures:"On request",location:"Port MacDonnell",partner:"Bush Adventures",minGuests:2,maxGuests:null,pricing:{structure:"per_adult",tiers:[{label:"Per adult",retail:1295}],note:"On request"},tags:["Indigenous","Cultural","Wildlife","Coastal"],description:"A private cultural experience with Uncle Ken Jones, NAIDOC Elder and proud Boandik man, on his saltwater Country. Stories, songs and a lifetime of knowledge, shared first-hand by a man who has spent more than fifty years as a wildlife officer and conservationist on this coastline. Afterwards, a secluded beach luncheon — deck chairs in the sand, fresh Southern Rock Lobster with crusty bread and a chilled Coonawarra Riesling.",inclusions:["Private guided walk on Boandik Country with Uncle Ken Jones","Stories, songs and cultural knowledge of the land and sea","Coastal luncheon at a secluded beach","Fresh Southern Rock Lobster with crusty bread and lemon","Chilled Coonawarra Riesling","Premium transport, driven by your hosts","Pick-up and drop-off, Penola / Coonawarra region"]},
  {id:"p-caves-cabernet",rezdy:"PGXR9D",category:"Day Tours",name:"Caves, Cabernet & Kangaroos",subtitle:"Full day private tour · Min 2 / Max 4",type:"private",duration:"8 hrs",schedule:"9:00 – 17:00",departures:"Daily",location:"Naracoorte · Coonawarra · Penola",minGuests:2,maxGuests:4,pricing:{structure:"per_adult",tiers:[{label:"Per adult",retail:715}],note:null},tags:["Caves","Wine","Wildlife","Olive Oil"],description:"A full day taking in the best of the Limestone Coast — ancient caves, celebrated wine country, a boutique olive grove and a private kangaroo sanctuary not open to the public.",inclusions:["UNESCO World Heritage–listed Naracoorte Caves exploration","Locally sourced produce luncheon at one of the region's best venues","Icon wine tasting at Wynns Coonawarra Estate","Boutique olive oil tasting at a local grove","Private kangaroo sanctuary visit, not open to the public","Premium transport, driven by your hosts","Pick-up and drop-off, Penola / Coonawarra region","All tasting and entry fees included"]},
  {id:"p-heritage-treasures",rezdy:"PLVMQJ",category:"Day Tours",name:"Heritage & Hidden Treasures",subtitle:"Naracoorte Caves & Yallum Park · Min 2 / Max 4",type:"private",duration:"8 hrs",schedule:"9:00 – 17:00",departures:"Daily",location:"Naracoorte · Penola",minGuests:2,maxGuests:4,pricing:{structure:"tiered_per_person_by_group",tiers:[{label:"2 guests",pax:2,retail:795},{label:"3 guests",pax:3,retail:695},{label:"4 guests",pax:4,retail:595}],note:"Per person, priced by group size"},tags:["Caves","Heritage","History"],description:"A private day built around two of the region's most compelling stories — the deep prehistory of the Naracoorte Caves and the social history of Yallum Park Mansion, one of Australia's best-preserved period homes.",inclusions:["Private 3.5-hour multi-cave tour, UNESCO World Heritage–listed Naracoorte Caves","Set-menu seasonal luncheon at one of the region's best venues","Private guided tour of Yallum Park Mansion","Premium transport and return transfers, driven by your hosts","All entry and tasting fees included"]},
  {id:"p-immerse-day",rezdy:"PFLB9E",category:"Day Tours",name:"Immerse Yourself in Coonawarra",subtitle:"Full day private wine tour · Min 2 / Max 6",type:"private",duration:"6.5 hrs",schedule:"10:30 – 17:00",departures:"Daily",location:"Coonawarra · Penola",minGuests:2,maxGuests:6,pricing:{structure:"per_adult",tiers:[{label:"Per adult",retail:395}],note:null},tags:["Wine","Cellar Door","Dining"],description:"A privately hosted full day among Coonawarra's finest cellar doors, guided throughout by Simon and Kerry. Personalised tastings with the region's favourite winemakers and a set-menu lunch.",inclusions:["Wine tastings at the best cellar doors in Coonawarra","Personalised experiences with the region's favourite winemakers","Set-menu seasonal luncheon at one of the region's best venues","Premium transport, driven by your hosts","Pick-up and drop-off, Penola / Coonawarra accommodation","All tasting fees included"]},
  {id:"p-unearthed",rezdy:"PTGHJM",category:"Day Tours",name:"Coonawarra Unearthed",subtitle:"Full day small-group wine tour · Min 2 / Max 10",type:"small_group",duration:"6 hrs",schedule:"11:00 – 17:00",departures:"Daily",location:"Coonawarra · Penola",minGuests:2,maxGuests:10,pricing:{structure:"per_adult",tiers:[{label:"Per adult",retail:215}],note:null},tags:["Wine","Cellar Door","Small Group"],description:"Our flagship small-group wine day — the best way to discover Coonawarra's cellar doors in good company, with a sumptuous produce platter at an iconic winery.",inclusions:["Wine tastings at the best cellar doors in Coonawarra","Sumptuous produce platter with a glass of wine at an iconic winery","Premium transport, driven by your hosts","Pick-up and drop-off, Penola / Coonawarra accommodation","All tasting fees included"]},
  {id:"p-highlights",rezdy:"PBBRC2",category:"Day Tours",name:"Coonawarra Highlights",subtitle:"Half day small-group wine tour · Min 2 / Max 10",type:"small_group",duration:"4.5 hrs",schedule:"12:30 – 17:00",departures:"Daily",location:"Coonawarra · Penola",minGuests:2,maxGuests:10,pricing:{structure:"per_adult",tiers:[{label:"Per adult",retail:185}],note:null},tags:["Wine","Cellar Door","Half Day"],description:"A relaxed afternoon introduction to Coonawarra's cellar doors — ideal for guests arriving late morning or those who want a gentler taste of the region.",inclusions:["Wine tastings at the best cellar doors in Coonawarra","Sumptuous produce platter with a glass of wine at an iconic winery","Premium transport, driven by your hosts","Pick-up and drop-off, Penola / Coonawarra accommodation","All tasting fees included"]},
  {id:"p-warrawindi-escape",rezdy:"PTG4V2",category:"Stay & Tour Packages",name:"A Warrawindi Escape",subtitle:"Luxury off-grid retreat & private touring · 2 Nights · Penola",type:"private",duration:"2 Nights · 1 Day",departures:"On request",location:"Penola · Limestone Coast",accommodation:"Blue Wren Retreat, Warrawindi Escapes",minGuests:2,maxGuests:2,pricing:{structure:"per_couple",tiers:[{label:"Per couple",retail:3975}],note:"On request"},tags:["Stay & Tour","Off-Grid","Farm","Wildlife"],description:"Two nights at the architecturally designed Blue Wren Retreat on a 3,000-acre private sustainable farm, paired with a fully hosted day across the Limestone Coast.",inclusions:["Two nights at the Blue Wren Retreat, architecturally designed off-grid luxury","Cedar hot tub, open fireplace and sweeping bushland views","Premium Coonawarra wine and chocolate on arrival","Generous breakfast provisions throughout your stay","Freshly prepared roast dinner delivered to your retreat one evening","Privately hosted full-day tour, UNESCO Naracoorte Caves and premium Coonawarra tastings","Regional produce luncheon","Boutique olive grove tasting","Private kangaroo sanctuary encounter"]},
  {id:"p-wagyu-wine-stay",rezdy:"PYVHSJ",category:"Stay & Tour Packages",name:"Wagyu, Wine & Stay",subtitle:"Mayura Steakhouse · Penola apartment · Hosted Coonawarra tour",type:"private",duration:"2 Nights · 2 Days",departures:"Wed–Sun",location:"Penola · Coonawarra",accommodation:"Coonawarra Experiences Apartment, Penola",minGuests:2,maxGuests:2,pricing:{structure:"per_couple",tiers:[{label:"Per couple",retail:1990}],note:"Adults only · Min/Max 2 · Dining Thu, Fri & Sat"},tags:["Stay & Tour","Wagyu","Dining","Wine"],description:"Two nights in the heart of Penola, a five-course Wagyu degustation at the Mayura chef's table with matched museum-release wines, and a fully hosted day through Coonawarra's best cellar doors.",inclusions:["Two nights at the Coonawarra Experiences Apartment, Penola","Queen bedroom, living area and bathroom with underfloor heating","Continental breakfast provisions, wine and chocolate on arrival","Mayura Wagyu Steakhouse chef's table — five-course Wagyu degustation with matched museum-release wines","Fully hosted wine tour, exclusive tastings at 4–5 premium cellar doors","Hearty produce platter and exclusive Wynns Coonawarra Estate visit"]},
  {id:"p-grand-style",rezdy:"PVKWQL",category:"Stay & Tour Packages",name:"A Stay in Grand Style",subtitle:"Delgattie Estate · Period manor · 2 Nights · Mount Gambier",type:"private",duration:"2 Nights · 1 Day",departures:"On request",location:"Mount Gambier · Coonawarra",accommodation:"Delgattie Estate, Mount Gambier",minGuests:2,maxGuests:null,pricing:{structure:"per_couple",tiers:[{label:"Per couple",retail:1850}],note:"On request · Three state rooms available"},tags:["Stay & Tour","Heritage","History","Wine"],description:"Two nights at Delgattie Estate, a beautifully restored 1902 manor in the heart of Mount Gambier, paired with a full private day among Coonawarra's most celebrated cellar doors.",inclusions:["Two nights at Delgattie Estate, your choice of three state rooms","Delgattie sparkling wine on arrival","Breakfast at the Commodore Restaurant on site","Private full-day Coonawarra tour, personalised tastings at the region's top cellar doors","Icon wines and behind-the-scenes access at Wynns Coonawarra Estate","Seasonal set-menu luncheon","Private kangaroo sanctuary visit"]},
  {id:"p-arthurs",rezdy:"ARTHURS",category:"Stay & Tour Packages",name:"Arthur's on Commercial",subtitle:"Luxury Mount Gambier stay & private Coonawarra touring · 2–8 guests",type:"private",duration:"2 Nights · 1 Day",departures:"On request",location:"Mount Gambier · Coonawarra",accommodation:"Arthur's on Commercial, Mount Gambier",minGuests:2,maxGuests:8,pricing:{structure:"tiered_per_couple_by_group",tiers:[{label:"2 guests",pax:2,retail:2650},{label:"4 guests",pax:4,retail:1790},{label:"6 guests",pax:6,retail:1545},{label:"8 guests",pax:8,retail:1395}],note:"Per couple, priced by group size"},tags:["Stay & Tour","Group","Wine"],description:"Mount Gambier's newest luxury residence — four suites across two living spaces, paired with a full private day touring Coonawarra, scaled for groups of two to eight.",inclusions:["Two nights at Arthur's on Commercial, four suites and two living spaces","Full private day touring Coonawarra, personalised tastings at the region's top cellar doors","Private transfers to and from Mount Gambier throughout the day","Set-menu luncheon at one of the region's best venues","Privately hosted icon wine tasting at Wynns Coonawarra Estate"]},
  {id:"p-immerse-package",rezdy:"PEB4NQ",category:"Stay & Tour Packages",name:"Immerse Yourself in Coonawarra (Package)",subtitle:"Stay & tour · 2 Nights · Penola",type:"private",duration:"2 Nights · 1 Day",departures:"Daily · On request",location:"Penola · Coonawarra",accommodation:"Coonawarra Experiences Apartment, Penola",minGuests:2,maxGuests:null,pricing:{structure:"per_couple",tiers:[{label:"Per couple",retail:945}],note:null},tags:["Stay & Tour","Wine","Cellar Door"],description:"Two nights in the heart of Penola paired with a fully hosted day of the region's finest cellar doors — our most accessible stay-and-tour package.",inclusions:["Two nights at the Coonawarra Experiences Apartment, Penola","Queen bedroom, living area and bathroom with underfloor heating","Continental breakfast provisions, wine and chocolate on arrival","Fully hosted wine tour, exclusive tastings at 4–5 premium cellar doors","Hearty produce platter through the day","Exclusive visit to Wynns Coonawarra Estate, private cellar walking tour"]},
  {id:"p-great-ocean-road",rezdy:null,category:"Transfers & Journeys",name:"The Great Ocean Road",subtitle:"Fully hosted Melbourne to Coonawarra · 2 Days · 1 Night en route",type:"private",duration:"2 Days · 1 Night en route",departures:"On request",location:"Melbourne → Coonawarra",vehicle:"Toyota LandCruiser 300 Series",minGuests:2,maxGuests:null,pricing:{structure:"on_request",tiers:[],note:"Price on request · Fully bespoke"},tags:["Transfer","Great Ocean Road","Victoria","Hosted Journey"],description:"An unhurried, fully hosted journey from your Melbourne doorstep to the Limestone Coast — two days along Australia's most spectacular coastline in our Toyota LandCruiser 300 Series.",inclusions:["Door-to-door collection from Melbourne accommodation in the LandCruiser 300","Two days of fully hosted private touring along the Great Ocean Road","The Twelve Apostles, Gibson Steps and Loch Ard Gorge","Cape Otway Lightstation and Maits Rest rainforest walk","Wild koalas at Kennett River and historic Port Fairy","Overnight accommodation en route, tailored to your guests","Seamless arrival into Coonawarra"]},
  {id:"p-mayura",rezdy:null,category:"Experience Components",name:"Mayura Wagyu Steakhouse",subtitle:"Chef's table degustation · Penola",type:"component",duration:null,departures:"Thu–Sat (private on request)",location:"Penola",minGuests:null,maxGuests:null,pricing:{structure:"component",tiers:[],note:"Priced as part of a package or on application"},tags:["Wagyu","Dining","Chef's Table"],description:"An exclusive chef's table degustation at Mayura Station's celebrated steakhouse — full-blood Wagyu across multiple cuts and courses, matched with regional wines.",inclusions:["Private chef's table degustation, full-blood Wagyu","Matched regional wines","Exclusive venue hire available on request"]},
  {id:"p-wynns",rezdy:null,category:"Experience Components",name:"Wynns Coonawarra Estate — Icon Tasting",subtitle:"VIP private tasting · Historic 1896 Gables winery",type:"component",duration:null,departures:null,location:"Coonawarra",minGuests:null,maxGuests:null,pricing:{structure:"component",tiers:[],note:"Included in most day tours and packages"},tags:["Wine","Cellar Door","Icon"],description:"A VIP private tasting inside the historic 1896 Gables winery — icon and museum wines, barrel samples and a vineyard walk.",inclusions:["Private tasting of icon and museum-release wines","Barrel samples and behind-the-scenes access","Guided vineyard walk"]},
  {id:"p-kangaroo-sanctuary",rezdy:null,category:"Experience Components",name:"Private Kangaroo Sanctuary",subtitle:"Not open to the public",type:"component",duration:null,departures:null,location:"Limestone Coast",minGuests:null,maxGuests:null,pricing:{structure:"component",tiers:[],note:"Included in select tours and packages"},tags:["Wildlife","Kangaroos","Private"],description:"A private kangaroo sanctuary not open to the public — an intimate encounter with rescued and resident kangaroos in a relaxed, unhurried setting.",inclusions:["Private access to the kangaroo sanctuary","Hosted encounter with resident kangaroos","Exclusive to Coonawarra Experiences guests"]},
  {id:"p-blue-wren",rezdy:null,category:"Experience Components",name:"Blue Wren Retreat — Warrawindi Escapes",subtitle:"Off-grid luxury · 3,000-acre sustainable farm · Penola",type:"component",duration:null,departures:"On request",location:"Penola",minGuests:null,maxGuests:null,pricing:{structure:"component",tiers:[],note:"Included in A Warrawindi Escape or on application"},tags:["Accommodation","Off-Grid","Farm"],description:"Architecturally designed off-grid luxury on a 3,000-acre working sustainable farm. Cedar hot tub, open fireplace and sweeping bushland views.",inclusions:["Architecturally designed off-grid retreat","Cedar hot tub and open fireplace","Sweeping bushland views","Welcome wine and provisions on arrival"]},
  {id:"p-ottelia",rezdy:null,category:"Experience Components",name:"Ottelia",subtitle:"Seasonal dining · Coonawarra",type:"component",duration:null,departures:null,location:"Coonawarra",minGuests:null,maxGuests:null,pricing:{structure:"component",tiers:[],note:"Included in select tours and packages"},tags:["Dining","Seasonal","Wine"],description:"One of Coonawarra's most celebrated dining experiences — a seasonal menu built around the region's finest produce, set within the Leconfield / Richard Hamilton cellar door.",inclusions:["Seasonal set-menu or à la carte dining","Matched Coonawarra wine list"]},
  {id:"p-confido",rezdy:null,category:"Experience Components",name:"Confido Olive Oil",subtitle:"Boutique olive grove tasting · Coonawarra",type:"component",duration:null,departures:null,location:"Coonawarra",minGuests:null,maxGuests:null,pricing:{structure:"component",tiers:[],note:"Included in select tours and packages"},tags:["Olive Oil","Produce","Artisan"],description:"A boutique olive oil experience with the makers at Confido — freshly pressed extra virgin olive oil, tasted straight from the grove.",inclusions:["Hosted olive oil tasting with the producers","Freshly pressed extra virgin olive oil"]},
];

const CATS = ["All","Day Tours","Stay & Tour Packages","Transfers & Journeys","Experience Components","Custom"];
const CAT_S = {"All":"All","Day Tours":"Day Tours","Stay & Tour Packages":"Packages","Transfers & Journeys":"Transfers","Experience Components":"Components","Custom":"Custom"};
const PRICE_STRUCTURES = [
  {value:"per_adult",label:"Per adult (single rate)"},
  {value:"per_couple",label:"Per couple (single rate)"},
  {value:"on_request",label:"Price on request"},
  {value:"component",label:"Component / included in package"},
  {value:"tiered_per_person_by_group",label:"Tiered per person by group size"},
  {value:"tiered_per_couple_by_group",label:"Tiered per couple by group size"},
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function uid() { return "c_"+Math.random().toString(36).slice(2,11); }
function findProduct(allProducts,id) { return allProducts.find(p=>p.id===id); }

function formatPrice(pricing) {
  const {structure,tiers}=pricing;
  if(structure==="on_request") return "Price on request";
  if(structure==="component") return "See package";
  if(structure==="per_adult") return `$${(tiers[0]?.retail||0).toLocaleString()} per adult`;
  if(structure==="per_couple") return `$${(tiers[0]?.retail||0).toLocaleString()} per couple`;
  if(structure==="tiered_per_person_by_group"||structure==="tiered_per_couple_by_group") {
    if(!tiers||tiers.length===0) return "Tiered pricing";
    const lo=tiers[tiers.length-1].retail,hi=tiers[0].retail;
    return `$${lo}–$${hi} ${structure==="tiered_per_couple_by_group"?"per couple":"per person"}`;
  }
  return "";
}

function typeColor(type) {
  return type==="private"?C.navy:type==="small_group"?C.teal:C.grey400;
}

function fmtDate(d) {
  if(!d) return "";
  return new Date(d).toLocaleDateString("en-AU",{day:"numeric",month:"long",year:"numeric"});
}

function fmtDateShort(d) {
  if(!d) return "";
  return new Date(d).toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"long"});
}

// Auto-generate cover highlights from itinerary products
function buildHighlights(itinerary, allProducts) {
  const items = itinerary.days.flatMap(d=>d.items);
  const seen = new Set();
  const highlights = [];
  // Nights
  const nights = itinerary.days.length;
  if(nights>0) highlights.push({icon:"🌙", label:`${nights} ${nights===1?"Night":"Nights"}`});
  // Guests
  if(itinerary.guestCount) highlights.push({icon:"👤", label:`${itinerary.guestCount} ${itinerary.guestCount===1?"Guest":"Guests"}`});
  // Product tags
  const tagPriority = ["Wagyu","Caves","Indigenous","Wildlife","Heritage","Wine","Off-Grid","Cultural","Transfer"];
  for(const tag of tagPriority) {
    if(highlights.length>=4) break;
    const hasTag = items.some(item=>{
      const p=findProduct(allProducts,item.productId);
      return p?.tags?.includes(tag)&&!seen.has(tag);
    });
    if(hasTag) { seen.add(tag); highlights.push({icon:tagIcon(tag),label:tag}); }
  }
  // Private hosted
  const hasPrivate = items.some(item=>{const p=findProduct(allProducts,item.productId);return p?.type==="private";});
  if(hasPrivate&&highlights.length<5) highlights.push({icon:"🔑",label:"Privately Hosted"});
  return highlights.slice(0,5);
}

function tagIcon(tag) {
  const map={Wagyu:"🥩",Caves:"🦇",Indigenous:"🌿",Wildlife:"🦘",Heritage:"🏛️",Wine:"🍷",
    "Off-Grid":"🏕️",Cultural:"🎶",Transfer:"🚗",Dining:"🍽️",Coastal:"🌊"};
  return map[tag]||"✦";
}

function newItinerary() {
  return {
    id:uid(),title:"New Itinerary",clientName:"",clientEmail:"",
    guestCount:2,arrivalDate:"",departureDate:"",origin:"Melbourne",
    status:"draft",totalPrice:"",showPricing:false,
    intro:"",hostBio:"Simon and Kerry Meares are your personal hosts throughout this journey — locals who left Melbourne to build a life and a business on the Limestone Coast. Every experience in this itinerary reflects a connection they've built with the region's people, places and producers.",
    terms:DEFAULT_TERMS,notes:"",
    days:[{id:uid(),title:"Day 1",date:"",location:"",items:[],dayNotes:""}],
    createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),
  };
}

// ─── Storage ──────────────────────────────────────────────────────────────────
function loadCP() { try{const r=localStorage.getItem("ce_custom_products_v1");return r?JSON.parse(r):[];}catch(e){return[];} }
function saveCP(p) { try{localStorage.setItem("ce_custom_products_v1",JSON.stringify(p));}catch(e){} }
function loadImgs() { try{const r=localStorage.getItem("ce_product_images_v1");return r?JSON.parse(r):{};}catch(e){return{};} }
function saveImgs(i) { try{localStorage.setItem("ce_product_images_v1",JSON.stringify(i));}catch(e){alert("Storage full — try removing some images.");} }
function loadIts() { try{const r=localStorage.getItem("ce_itineraries_v9");return r?JSON.parse(r):[];}catch(e){return[];} }
function saveIts(l) { try{localStorage.setItem("ce_itineraries_v9",JSON.stringify(l));}catch(e){} }

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Cabin:wght@400;600;700&family=PT+Serif:ital@0;1&family=Source+Sans+3:wght@300;400;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{margin:0;background:#faf9f6;font-family:'Source Sans 3','Open Sans',sans-serif;}
input,textarea,select,button{font-family:inherit;}
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-track{background:#f4f3f0;}
::-webkit-scrollbar-thumb{background:#d8c69d;border-radius:3px;}
.img-drop-zone{border:2px dashed #e8e6e0;border-radius:6px;padding:10px;text-align:center;cursor:pointer;transition:border-color .15s,background .15s;}
.img-drop-zone:hover,.img-drop-zone.drag-over{border-color:#40c0c0;background:#e0f7f733;}
.img-thumb{position:relative;display:inline-block;}
.img-thumb-del{position:absolute;top:-4px;right:-4px;width:16px;height:16px;border-radius:50%;background:#d34727;color:white;border:none;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;cursor:pointer;line-height:1;padding:0;}
@media print{
  .no-print{display:none!important;}
  body{background:white;}
  .print-break{page-break-before:always;}
  @page{margin:12mm;size:A4;}
}
`;

// ─── Small components ─────────────────────────────────────────────────────────
function Badge({color,children,xs}){
  return <span style={{display:"inline-block",fontFamily:F.body,fontSize:xs?9:10,fontWeight:600,color:color||C.navy,background:color?`${color}18`:C.sandLight,border:`1px solid ${color?color+"30":C.sandDark}`,borderRadius:20,padding:xs?"1px 5px":"2px 8px",letterSpacing:"0.04em",textTransform:"uppercase"}}>{children}</span>;
}

function TierTable({pricing}){
  if(!["tiered_per_person_by_group","tiered_per_couple_by_group"].includes(pricing.structure)||!pricing.tiers?.length) return null;
  return(
    <table style={{width:"100%",borderCollapse:"collapse",marginTop:4}}>
      <tbody>{pricing.tiers.map((t,i)=>(
        <tr key={i}>
          <td style={{fontFamily:F.body,fontSize:11,color:C.grey600,padding:"2px 0"}}>{t.label}</td>
          <td style={{fontFamily:F.heading,fontSize:12,color:C.terra,textAlign:"right",fontWeight:700}}>${(t.retail||0).toLocaleString()}</td>
        </tr>
      ))}</tbody>
    </table>
  );
}

// ─── Image uploader ───────────────────────────────────────────────────────────
function ImageUploader({productId,images,onImagesChange}){
  const inputRef=useRef();
  const [dragging,setDragging]=useState(false);
  function readFiles(files){
    Array.from(files).forEach(file=>{
      if(!file.type.startsWith("image/")) return;
      const r=new FileReader();
      r.onload=e=>onImagesChange(productId,[...(images||[]),e.target.result]);
      r.readAsDataURL(file);
    });
  }
  const imgs=images||[];
  return(
    <div style={{marginTop:6}}>
      {imgs.length>0&&(
        <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:6}}>
          {imgs.map((src,i)=>(
            <div key={i} className="img-thumb" style={{width:52,height:40}}>
              <img src={src} alt="" style={{width:52,height:40,objectFit:"cover",borderRadius:4,border:`1px solid ${C.grey200}`}}/>
              <button className="img-thumb-del" onClick={()=>onImagesChange(productId,imgs.filter((_,j)=>j!==i))}>×</button>
            </div>
          ))}
        </div>
      )}
      <div className={`img-drop-zone${dragging?" drag-over":""}`}
        onDragOver={e=>{e.preventDefault();setDragging(true);}}
        onDragLeave={()=>setDragging(false)}
        onDrop={e=>{e.preventDefault();setDragging(false);readFiles(e.dataTransfer.files);}}
        onClick={()=>inputRef.current.click()}>
        <div style={{fontFamily:F.body,fontSize:10,color:C.grey400}}>
          {imgs.length===0?<><span style={{fontSize:14}}>📷</span><br/>Drop images or click to upload</>:<span>+ Add more</span>}
        </div>
        <input ref={inputRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>readFiles(e.target.files)}/>
      </div>
      {imgs.length>0&&<div style={{fontFamily:F.body,fontSize:9,color:C.grey400,marginTop:2,textAlign:"center"}}>{imgs.length} image{imgs.length!==1?"s":""} · First used as hero</div>}
    </div>
  );
}

function ImageStrip({images}){
  if(!images?.length) return null;
  const show=images.slice(0,4);
  return(
    <div style={{display:"grid",gridTemplateColumns:`repeat(${show.length},1fr)`,gap:3,marginBottom:10,borderRadius:6,overflow:"hidden"}}>
      {show.map((src,i)=><img key={i} src={src} alt="" style={{width:"100%",height:show.length===1?160:90,objectFit:"cover",display:"block"}}/>)}
    </div>
  );
}

// ─── Custom product form ──────────────────────────────────────────────────────
function ProductForm({initial,onSave,onCancel}){
  const [p,setP]=useState(()=>initial||{id:uid(),custom:true,category:"Day Tours",name:"",subtitle:"",type:"private",duration:"",departures:"",location:"",partner:"",minGuests:2,maxGuests:null,rezdy:"",pricing:{structure:"per_adult",tiers:[{label:"",retail:0}],note:""},tags:[],description:"",inclusions:[]});
  const [incText,setIncText]=useState((initial?.inclusions||[]).join("\n"));
  const [tagText,setTagText]=useState((initial?.tags||[]).join(", "));
  const [tierRows,setTierRows]=useState(()=>{const t=initial?.pricing?.tiers||[];return t.length>0?t:[{label:"",retail:0}];});
  const isTiered=p.pricing.structure==="tiered_per_person_by_group"||p.pricing.structure==="tiered_per_couple_by_group";
  const isSimple=p.pricing.structure==="per_adult"||p.pricing.structure==="per_couple";
  function setPricing(patch){setP(x=>({...x,pricing:{...x.pricing,...patch}}));}
  function handleSave(){
    if(!p.name.trim()){alert("Product name is required.");return;}
    const inclusions=incText.split("\n").map(s=>s.trim()).filter(Boolean);
    const tags=tagText.split(",").map(s=>s.trim()).filter(Boolean);
    let tiers=[];
    if(isTiered) tiers=tierRows.filter(r=>r.label).map(r=>({label:r.label,retail:parseFloat(r.retail)||0}));
    if(isSimple) tiers=[{label:p.pricing.structure==="per_couple"?"Per couple":"Per adult",retail:parseFloat(tierRows[0]?.retail)||0}];
    onSave({...p,inclusions,tags,pricing:{...p.pricing,tiers}});
  }
  const F2={fontFamily:F.body,fontSize:12,color:C.text,border:`1px solid ${C.grey200}`,borderRadius:5,padding:"5px 8px",outline:"none",background:C.white,width:"100%"};
  const L={fontFamily:F.body,fontSize:10,fontWeight:700,color:C.grey400,letterSpacing:"0.08em",textTransform:"uppercase",display:"block",marginBottom:3};
  const W={marginBottom:10};
  return(
    <div style={{background:C.white,border:`2px solid ${C.teal}`,borderRadius:10,padding:14,marginBottom:12}}>
      <div style={{fontFamily:F.heading,fontSize:13,fontWeight:700,color:C.navy,marginBottom:12}}>{initial?"Edit Product":"New Custom Product"}</div>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <div style={{flex:2,...W}}><label style={L}>Product name *</label><input style={F2} value={p.name} onChange={e=>setP(x=>({...x,name:e.target.value}))} placeholder="Product name"/></div>
        <div style={{flex:1,...W}}><label style={L}>Category</label><select style={F2} value={p.category} onChange={e=>setP(x=>({...x,category:e.target.value}))}>{["Day Tours","Stay & Tour Packages","Transfers & Journeys","Experience Components","Custom"].map(c=><option key={c}>{c}</option>)}</select></div>
      </div>
      <div style={W}><label style={L}>Subtitle</label><input style={F2} value={p.subtitle||""} onChange={e=>setP(x=>({...x,subtitle:e.target.value}))} placeholder="e.g. Full day private tour · Min 2 / Max 4"/></div>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <div style={{flex:1,...W}}><label style={L}>Type</label><select style={F2} value={p.type} onChange={e=>setP(x=>({...x,type:e.target.value}))}><option value="private">Private</option><option value="small_group">Small Group</option><option value="component">Component</option></select></div>
        <div style={{flex:1,...W}}><label style={L}>Duration</label><input style={F2} value={p.duration||""} onChange={e=>setP(x=>({...x,duration:e.target.value}))} placeholder="e.g. 6 hrs"/></div>
        <div style={{flex:1,...W}}><label style={L}>Departures</label><input style={F2} value={p.departures||""} onChange={e=>setP(x=>({...x,departures:e.target.value}))} placeholder="e.g. Daily"/></div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <div style={{flex:1,...W}}><label style={L}>Location</label><input style={F2} value={p.location||""} onChange={e=>setP(x=>({...x,location:e.target.value}))} placeholder="e.g. Coonawarra · Penola"/></div>
        <div style={{flex:1,...W}}><label style={L}>Partner</label><input style={F2} value={p.partner||""} onChange={e=>setP(x=>({...x,partner:e.target.value}))} placeholder="Optional"/></div>
        <div style={{flex:1,...W}}><label style={L}>Rezdy code</label><input style={F2} value={p.rezdy||""} onChange={e=>setP(x=>({...x,rezdy:e.target.value}))} placeholder="Internal"/></div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <div style={{flex:1,...W}}><label style={L}>Min guests</label><input style={F2} type="number" value={p.minGuests||""} onChange={e=>setP(x=>({...x,minGuests:parseInt(e.target.value)||null}))} placeholder="2"/></div>
        <div style={{flex:1,...W}}><label style={L}>Max guests</label><input style={F2} type="number" value={p.maxGuests||""} onChange={e=>setP(x=>({...x,maxGuests:parseInt(e.target.value)||null}))} placeholder="10"/></div>
      </div>
      <div style={{borderTop:`1px solid ${C.grey100}`,paddingTop:10,marginBottom:10}}>
        <label style={L}>Pricing structure</label>
        <select style={{...F2,marginBottom:8}} value={p.pricing.structure} onChange={e=>setPricing({structure:e.target.value,tiers:[{label:"",retail:0}]})}>
          {PRICE_STRUCTURES.map(ps=><option key={ps.value} value={ps.value}>{ps.label}</option>)}
        </select>
        {isSimple&&<div style={{display:"flex",gap:8}}><div style={{flex:1}}><label style={L}>Price (AUD)</label><input style={F2} type="number" value={tierRows[0]?.retail||""} onChange={e=>setTierRows([{label:"",retail:e.target.value}])} placeholder="0.00"/></div><div style={{flex:2}}><label style={L}>Price note</label><input style={F2} value={p.pricing.note||""} onChange={e=>setPricing({note:e.target.value})} placeholder="e.g. On request"/></div></div>}
        {isTiered&&<div><label style={L}>Pricing tiers</label>{tierRows.map((row,i)=><div key={i} style={{display:"flex",gap:6,marginBottom:5,alignItems:"center"}}><input style={{...F2,flex:2}} value={row.label} onChange={e=>setTierRows(r=>r.map((x,j)=>j===i?{...x,label:e.target.value}:x))} placeholder="e.g. 2 guests"/><input style={{...F2,flex:1}} type="number" value={row.retail} onChange={e=>setTierRows(r=>r.map((x,j)=>j===i?{...x,retail:e.target.value}:x))} placeholder="Price"/>{tierRows.length>1&&<button onClick={()=>setTierRows(r=>r.filter((_,j)=>j!==i))} style={{color:C.terra,background:"transparent",border:"none",fontSize:16,fontWeight:700,padding:"0 4px"}}>×</button>}</div>)}<button onClick={()=>setTierRows(r=>[...r,{label:"",retail:0}])} style={{fontFamily:F.body,fontSize:11,color:C.teal,background:"transparent",border:`1px solid ${C.teal}40`,borderRadius:5,padding:"3px 10px"}}>+ Add tier</button><div style={{marginTop:6}}><label style={L}>Pricing note</label><input style={F2} value={p.pricing.note||""} onChange={e=>setPricing({note:e.target.value})} placeholder="e.g. Per person, priced by group size"/></div></div>}
        {(p.pricing.structure==="on_request"||p.pricing.structure==="component")&&<div style={W}><label style={L}>Note</label><input style={F2} value={p.pricing.note||""} onChange={e=>setPricing({note:e.target.value})} placeholder="e.g. Price on request"/></div>}
      </div>
      <div style={W}><label style={L}>Description</label><textarea style={{...F2,resize:"vertical",minHeight:70,padding:"6px 8px"}} value={p.description||""} onChange={e=>setP(x=>({...x,description:e.target.value}))} placeholder="Description as it appears in the itinerary..."/></div>
      <div style={W}><label style={L}>Inclusions (one per line)</label><textarea style={{...F2,resize:"vertical",minHeight:70,padding:"6px 8px"}} value={incText} onChange={e=>setIncText(e.target.value)} placeholder={"Premium transport, driven by your hosts\nAll tasting fees included"}/></div>
      <div style={W}><label style={L}>Tags (comma separated)</label><input style={F2} value={tagText} onChange={e=>setTagText(e.target.value)} placeholder="Wine, Cellar Door, Private"/></div>
      <div style={{display:"flex",gap:8,marginTop:4}}>
        <button onClick={handleSave} style={{flex:1,fontFamily:F.heading,fontSize:11,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:C.white,background:C.terra,border:"none",borderRadius:6,padding:"8px 0"}}>{initial?"Save Changes":"Create Product"}</button>
        <button onClick={onCancel} style={{fontFamily:F.body,fontSize:12,color:C.grey600,background:"transparent",border:`1px solid ${C.grey200}`,borderRadius:6,padding:"8px 16px"}}>Cancel</button>
      </div>
    </div>
  );
}

// ─── Library card ─────────────────────────────────────────────────────────────
function LibraryCard({product:p,images,onImagesChange,onAdd,showInternal,onEdit,onDelete}){
  const [open,setOpen]=useState(false);
  const [imgOpen,setImgOpen]=useState(false);
  const isTiered=["tiered_per_person_by_group","tiered_per_couple_by_group"].includes(p.pricing.structure);
  const heroImg=images?.[0];
  return(
    <div style={{background:C.white,border:`1px solid ${p.custom?C.teal:C.grey200}`,borderRadius:8,overflow:"hidden",marginBottom:8}}>
      {heroImg&&<img src={heroImg} alt={p.name} style={{width:"100%",height:80,objectFit:"cover",display:"block"}}/>}
      <div style={{background:heroImg?"transparent":C.navy,padding:"8px 12px"}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:4}}>
          <div>
            <div style={{fontFamily:F.body,fontSize:9,color:heroImg?C.grey400:C.sand,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:2}}>{p.category}{p.custom?" · Custom":""}</div>
            <div style={{fontFamily:F.heading,fontSize:13,fontWeight:700,color:heroImg?C.navy:C.white,lineHeight:1.2}}>{p.name||"Untitled"}</div>
          </div>
          {p.custom&&<div style={{display:"flex",gap:3,flexShrink:0}}><button onClick={onEdit} style={{fontFamily:F.body,fontSize:9,color:C.teal,background:`${C.teal}18`,border:`1px solid ${C.teal}30`,borderRadius:4,padding:"1px 6px"}}>Edit</button><button onClick={onDelete} style={{fontFamily:F.body,fontSize:9,color:C.terra,background:`${C.terra}18`,border:`1px solid ${C.terra}30`,borderRadius:4,padding:"1px 6px"}}>Del</button></div>}
        </div>
      </div>
      <div style={{padding:"8px 12px"}}>
        <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:6}}>
          <Badge color={typeColor(p.type)} xs>{p.type==="small_group"?"Small Group":p.type==="component"?"Component":"Private"}</Badge>
          {p.duration&&<Badge xs>{p.duration}</Badge>}
          {p.departures&&<Badge xs>{p.departures}</Badge>}
        </div>
        {isTiered?<TierTable pricing={p.pricing}/>:<div style={{fontFamily:F.heading,fontSize:13,fontWeight:700,color:C.terra,marginBottom:2}}>{formatPrice(p.pricing)}</div>}
        {p.pricing.note&&<div style={{fontFamily:F.body,fontSize:10,color:C.grey400,marginBottom:4}}>{p.pricing.note}</div>}
        {open&&(
          <>
            {p.description&&<p style={{fontFamily:F.body,fontSize:11,color:C.grey600,lineHeight:1.5,margin:"6px 0"}}>{p.description}</p>}
            {p.inclusions?.length>0&&<ul style={{listStyle:"none",padding:0,marginBottom:6}}>{p.inclusions.map((inc,i)=><li key={i} style={{fontFamily:F.body,fontSize:10,color:C.grey600,padding:"2px 0 2px 10px",position:"relative"}}><span style={{position:"absolute",left:0,top:6,width:6,height:1,background:C.sand}}/>{inc}</li>)}</ul>}
            {showInternal&&p.rezdy&&<div style={{fontFamily:F.body,fontSize:9,color:C.grey400,background:C.grey100,borderRadius:3,padding:"1px 5px",display:"inline-block",marginBottom:6}}>Rezdy: {p.rezdy}</div>}
            <div style={{borderTop:`1px solid ${C.grey100}`,paddingTop:8,marginTop:4}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontFamily:F.body,fontSize:10,fontWeight:700,color:C.grey400,letterSpacing:"0.08em",textTransform:"uppercase"}}>Images</span>
                <button onClick={()=>setImgOpen(v=>!v)} style={{fontFamily:F.body,fontSize:10,color:C.teal,background:"transparent",border:"none",textDecoration:"underline"}}>{imgOpen?"Hide":"Manage"}</button>
              </div>
              {imgOpen&&<ImageUploader productId={p.id} images={images} onImagesChange={onImagesChange}/>}
              {!imgOpen&&(images?.length>0?<div style={{fontFamily:F.body,fontSize:10,color:C.grey400}}>{images.length} image{images.length!==1?"s":""} uploaded</div>:<div style={{fontFamily:F.body,fontSize:10,color:C.grey200}}>No images yet</div>)}
            </div>
          </>
        )}
        <div style={{display:"flex",gap:6,marginTop:8}}>
          <button onClick={()=>setOpen(o=>!o)} style={{flex:1,fontFamily:F.body,fontSize:11,color:C.navy,background:"transparent",border:`1px solid ${C.grey200}`,borderRadius:5,padding:"4px 0"}}>{open?"Less":"Details"}</button>
          <button onClick={()=>onAdd(p)} style={{flex:1,fontFamily:F.body,fontSize:11,fontWeight:600,color:C.white,background:C.terra,border:"none",borderRadius:5,padding:"4px 0"}}>+ Add</button>
        </div>
      </div>
    </div>
  );
}

// ─── Day item ─────────────────────────────────────────────────────────────────
function DayItem({item,onRemove,onMoveUp,onMoveDown,onNoteChange,isFirst,isLast,heroImg,allProducts,showPricing}){
  const p=findProduct(allProducts,item.productId);
  const [editNote,setEditNote]=useState(false);
  const [noteVal,setNoteVal]=useState(item.notes||"");
  if(!p) return null;
  return(
    <div style={{background:C.white,border:`1px solid ${C.grey200}`,borderRadius:6,marginBottom:6,overflow:"hidden"}}>
      {heroImg&&<img src={heroImg} alt={p.name} style={{width:"100%",height:50,objectFit:"cover",display:"block"}}/>}
      <div style={{display:"flex",gap:8,padding:"8px 10px"}}>
        <div style={{width:3,borderRadius:2,background:typeColor(p.type),flexShrink:0,alignSelf:"stretch"}}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:F.heading,fontSize:12,fontWeight:700,color:C.navy}}>{p.name}</div>
          {p.location&&<div style={{fontFamily:F.body,fontSize:10,color:C.grey400,marginTop:1}}>{p.location}</div>}
          {p.duration&&<div style={{fontFamily:F.body,fontSize:10,color:C.teal}}>{p.duration}</div>}
          {showPricing&&<div style={{marginTop:3,fontFamily:F.heading,fontSize:11,fontWeight:700,color:C.terra}}>{formatPrice(p.pricing)}</div>}
          {item.notes&&!editNote&&<div style={{fontFamily:F.body,fontSize:10,color:C.grey600,marginTop:4,fontStyle:"italic",borderLeft:`2px solid ${C.sand}`,paddingLeft:6}}>{item.notes}</div>}
          {editNote?(
            <div style={{marginTop:5}}>
              <textarea value={noteVal} onChange={e=>setNoteVal(e.target.value)} rows={2} style={{width:"100%",fontFamily:F.body,fontSize:11,border:`1px solid ${C.grey200}`,borderRadius:4,padding:"4px 6px",resize:"vertical",outline:"none"}}/>
              <div style={{display:"flex",gap:4,marginTop:3}}>
                <button onClick={()=>{onNoteChange(item.id,noteVal);setEditNote(false);}} style={{fontFamily:F.body,fontSize:10,fontWeight:600,color:C.white,background:C.teal,border:"none",borderRadius:4,padding:"2px 8px"}}>Save</button>
                <button onClick={()=>setEditNote(false)} style={{fontFamily:F.body,fontSize:10,color:C.grey400,background:"transparent",border:`1px solid ${C.grey200}`,borderRadius:4,padding:"2px 8px"}}>Cancel</button>
              </div>
            </div>
          ):(
            <button onClick={()=>setEditNote(true)} style={{fontFamily:F.body,fontSize:10,color:C.grey400,background:"transparent",border:"none",padding:"3px 0",textDecoration:"underline"}}>{item.notes?"Edit note":"+ Add note"}</button>
          )}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:2,flexShrink:0}}>
          {!isFirst&&<button onClick={onMoveUp} style={{width:20,height:20,fontSize:11,fontWeight:700,color:C.navy,background:"transparent",border:`1px solid ${C.grey200}`,borderRadius:3,padding:0,lineHeight:1}}>↑</button>}
          {!isLast&&<button onClick={onMoveDown} style={{width:20,height:20,fontSize:11,fontWeight:700,color:C.navy,background:"transparent",border:`1px solid ${C.grey200}`,borderRadius:3,padding:0,lineHeight:1}}>↓</button>}
          <button onClick={onRemove} style={{width:20,height:20,fontSize:13,fontWeight:700,color:C.terra,background:"transparent",border:`1px solid ${C.terra}40`,borderRadius:3,padding:0,lineHeight:1}}>×</button>
        </div>
      </div>
    </div>
  );
}

// ─── Day card ─────────────────────────────────────────────────────────────────
function DayCard({day,dayIndex,totalDays,productImages,allProducts,showPricing,onUpdate,onRemoveItem,onMoveItem,onNoteChange,onRemove}){
  const w=day.date?WEATHER[new Date(day.date).getMonth()+1]:null;
  return(
    <div style={{background:C.white,border:`1px solid ${C.grey200}`,borderRadius:10,overflow:"hidden",marginBottom:14}}>
      <div style={{background:C.sandLight,borderBottom:`1px solid ${C.grey200}`,padding:"8px 12px",display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontFamily:F.body,fontSize:10,fontWeight:700,color:C.terra,letterSpacing:"0.1em",textTransform:"uppercase",flexShrink:0}}>DAY {dayIndex+1}</span>
        <input value={day.title} onChange={e=>onUpdate({...day,title:e.target.value})} style={{flex:1,fontFamily:F.heading,fontSize:14,fontWeight:700,color:C.navy,background:"transparent",border:"none",outline:"none"}} placeholder={`Day ${dayIndex+1}`}/>
        <input value={day.location||""} onChange={e=>onUpdate({...day,location:e.target.value})} style={{fontFamily:F.body,fontSize:11,color:C.grey600,background:"transparent",border:"none",outline:"none",width:160}} placeholder="Day location..."/>
        <input type="date" value={day.date} onChange={e=>onUpdate({...day,date:e.target.value})} style={{fontFamily:F.body,fontSize:11,color:C.grey600,background:"transparent",border:"none",outline:"none",width:130}}/>
        {w&&<div style={{display:"flex",alignItems:"center",gap:4,background:C.white,border:`1px solid ${C.grey200}`,borderRadius:5,padding:"2px 7px",flexShrink:0}}><span style={{fontSize:13}}>{w.icon}</span><div><div style={{fontFamily:F.body,fontSize:9,fontWeight:600,color:C.navy}}>{w.temp}</div><div style={{fontFamily:F.body,fontSize:9,color:C.grey400}}>Rain: {w.rain}</div></div></div>}
        {totalDays>1&&<button onClick={onRemove} style={{fontFamily:F.body,fontSize:10,color:C.terra,background:"transparent",border:`1px solid ${C.terra}40`,borderRadius:4,padding:"2px 8px"}}>Remove</button>}
      </div>
      {w&&<div style={{background:`${C.teal}08`,borderBottom:`1px solid ${C.grey100}`,padding:"5px 12px",fontFamily:F.serif,fontSize:11,color:C.grey600,fontStyle:"italic"}}>{w.note}</div>}
      <div style={{padding:12}}>
        {day.items.length===0&&<div style={{textAlign:"center",padding:"16px 0",color:C.grey400,fontFamily:F.body,fontSize:12,border:`1px dashed ${C.grey200}`,borderRadius:6,marginBottom:8}}>Add experiences from the library</div>}
        {day.items.map((item,idx)=>(
          <DayItem key={item.id} item={item} isFirst={idx===0} isLast={idx===day.items.length-1}
            heroImg={productImages[item.productId]?.[0]||null}
            allProducts={allProducts} showPricing={showPricing}
            onRemove={()=>onRemoveItem(day.id,item.id)}
            onMoveUp={()=>onMoveItem(day.id,idx,-1)}
            onMoveDown={()=>onMoveItem(day.id,idx,1)}
            onNoteChange={(itemId,note)=>onNoteChange(day.id,itemId,note)}
          />
        ))}
        <textarea value={day.dayNotes} onChange={e=>onUpdate({...day,dayNotes:e.target.value})} placeholder="Day overview notes..." style={{width:"100%",fontFamily:F.body,fontSize:11,color:C.text,border:`1px solid ${C.grey200}`,borderRadius:6,padding:"6px 10px",resize:"vertical",minHeight:36,outline:"none",marginTop:4}}/>
      </div>
    </div>
  );
}

// ─── Preview ──────────────────────────────────────────────────────────────────
function Preview({itinerary,productImages,showInternal,allProducts}){
  const highlights=buildHighlights(itinerary,allProducts);
  const showPrice=itinerary.showPricing;

  return(
    <div style={{fontFamily:F.body,color:C.text,maxWidth:860,margin:"0 auto"}}>

      {/* Cover */}
      <div style={{background:C.navy,borderRadius:10,padding:"28px 32px",marginBottom:16,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,right:0,width:120,height:120,background:C.teal,opacity:0.1,borderRadius:"0 0 0 100%"}}/>
        <div style={{fontFamily:F.body,fontSize:9,color:C.sand,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:6}}>Coonawarra Experiences</div>
        <div style={{fontFamily:F.heading,fontSize:28,fontWeight:700,color:C.white,lineHeight:1.1,marginBottom:6}}>{itinerary.title||"Private Itinerary"}</div>
        {itinerary.clientName&&<div style={{fontFamily:F.serif,fontSize:14,fontStyle:"italic",color:C.sand,marginBottom:14}}>Prepared for {itinerary.clientName}</div>}

        {/* Key details */}
        <div style={{display:"flex",gap:20,flexWrap:"wrap",marginBottom:14}}>
          {itinerary.arrivalDate&&<div style={{fontFamily:F.body,fontSize:11,color:"rgba(255,255,255,0.7)"}}><span style={{color:C.sand,fontWeight:600}}>Arrival</span> · {fmtDate(itinerary.arrivalDate)}</div>}
          {itinerary.departureDate&&<div style={{fontFamily:F.body,fontSize:11,color:"rgba(255,255,255,0.7)"}}><span style={{color:C.sand,fontWeight:600}}>Departure</span> · {fmtDate(itinerary.departureDate)}</div>}
          {itinerary.guestCount&&<div style={{fontFamily:F.body,fontSize:11,color:"rgba(255,255,255,0.7)"}}><span style={{color:C.sand,fontWeight:600}}>Guests</span> · {itinerary.guestCount}</div>}
          <div style={{fontFamily:F.body,fontSize:11,color:"rgba(255,255,255,0.7)"}}><span style={{color:C.sand,fontWeight:600}}>Duration</span> · {itinerary.days.length} {itinerary.days.length===1?"day":"days"}</div>
          {itinerary.origin&&<div style={{fontFamily:F.body,fontSize:11,color:"rgba(255,255,255,0.7)"}}><span style={{color:C.sand,fontWeight:600}}>Origin</span> · {itinerary.origin}</div>}
        </div>

        {/* Total price */}
        {itinerary.totalPrice&&(
          <div style={{display:"inline-block",background:"rgba(255,255,255,0.1)",border:`1px solid rgba(255,255,255,0.2)`,borderRadius:8,padding:"8px 16px",marginBottom:14}}>
            <div style={{fontFamily:F.body,fontSize:9,color:C.sand,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:2}}>Total investment</div>
            <div style={{fontFamily:F.heading,fontSize:20,fontWeight:700,color:C.white}}>{itinerary.totalPrice}</div>
          </div>
        )}

        {/* Highlights strip */}
        {highlights.length>0&&(
          <div style={{display:"flex",gap:8,flexWrap:"wrap",paddingTop:14,borderTop:`1px solid rgba(255,255,255,0.12)`}}>
            {highlights.map((h,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:5,background:"rgba(255,255,255,0.08)",borderRadius:6,padding:"4px 10px"}}>
                <span style={{fontSize:13}}>{h.icon}</span>
                <span style={{fontFamily:F.body,fontSize:11,color:"rgba(255,255,255,0.8)"}}>{h.label}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{marginTop:14,paddingTop:12,borderTop:`1px solid rgba(255,255,255,0.1)`,fontFamily:F.body,fontSize:9,color:"rgba(255,255,255,0.35)"}}>Valid 1 April 2027 – 31 March 2028 · AUD incl. 10% GST</div>
      </div>

      {/* Intro paragraph */}
      {itinerary.intro&&(
        <div style={{background:C.white,border:`1px solid ${C.grey200}`,borderRadius:10,padding:"18px 22px",marginBottom:16,borderLeft:`4px solid ${C.teal}`}}>
          <div style={{fontFamily:F.body,fontSize:9,fontWeight:700,color:C.teal,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>About this journey</div>
          <div style={{fontFamily:F.serif,fontSize:14,color:C.navy,lineHeight:1.75,whiteSpace:"pre-wrap"}}>{itinerary.intro}</div>
        </div>
      )}

      {/* Host bio */}
      {itinerary.hostBio&&(
        <div style={{background:C.sandLight,borderRadius:10,padding:"16px 22px",marginBottom:20,display:"flex",gap:16,alignItems:"flex-start"}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:C.navy,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:F.heading,fontSize:14,fontWeight:700,color:C.sand}}>SK</div>
          <div>
            <div style={{fontFamily:F.heading,fontSize:12,fontWeight:700,color:C.navy,marginBottom:4,letterSpacing:"0.04em",textTransform:"uppercase"}}>Your hosts · Simon & Kerry Meares</div>
            <div style={{fontFamily:F.body,fontSize:12,color:C.grey600,lineHeight:1.65}}>{itinerary.hostBio}</div>
          </div>
        </div>
      )}

      {/* Days */}
      {itinerary.days.map((day,di)=>{
        const w=day.date?WEATHER[new Date(day.date).getMonth()+1]:null;
        return(
          <div key={day.id} className={di>0?"print-break":""} style={{marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,paddingBottom:8,borderBottom:`2px solid ${C.sand}`}}>
              <span style={{fontFamily:F.body,fontSize:9,fontWeight:700,color:C.terra,letterSpacing:"0.1em",textTransform:"uppercase"}}>DAY {di+1}</span>
              <div style={{flex:1}}>
                <div style={{fontFamily:F.heading,fontSize:18,fontWeight:700,color:C.navy}}>{day.title}</div>
                {day.location&&<div style={{fontFamily:F.body,fontSize:11,color:C.grey400,marginTop:1}}>{day.location}</div>}
              </div>
              {day.date&&<span style={{fontFamily:F.body,fontSize:11,color:C.grey400}}>{fmtDateShort(day.date)}</span>}
              {w&&<div style={{display:"flex",alignItems:"center",gap:4,background:C.grey100,borderRadius:5,padding:"3px 8px"}}><span style={{fontSize:13}}>{w.icon}</span><div><div style={{fontFamily:F.body,fontSize:10,fontWeight:600,color:C.navy}}>{w.month} · {w.temp}</div><div style={{fontFamily:F.body,fontSize:9,color:C.grey400}}>Rainfall: {w.rain}</div></div></div>}
            </div>
            {w&&<div style={{fontFamily:F.serif,fontSize:12,fontStyle:"italic",color:C.grey600,marginBottom:12,paddingLeft:10,borderLeft:`2px solid ${C.sand}`}}>{w.note}</div>}
            {day.dayNotes&&<div style={{fontFamily:F.body,fontSize:12,color:C.grey600,marginBottom:14,padding:"10px 12px",background:C.sandLight,borderRadius:6}}>{day.dayNotes}</div>}

            {day.items.map(item=>{
              const p=findProduct(allProducts,item.productId);
              if(!p) return null;
              const imgs=productImages[p.id]||[];
              const isTiered=["tiered_per_person_by_group","tiered_per_couple_by_group"].includes(p.pricing.structure);
              return(
                <div key={item.id} style={{background:C.white,border:`1px solid ${C.grey200}`,borderRadius:8,overflow:"hidden",marginBottom:10,borderLeft:`4px solid ${typeColor(p.type)}`}}>
                  {imgs.length>0&&<ImageStrip images={imgs}/>}
                  <div style={{padding:"12px 14px"}}>
                    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:6}}>
                      <div>
                        <div style={{fontFamily:F.heading,fontSize:14,fontWeight:700,color:C.navy}}>{p.name}</div>
                        {p.location&&<div style={{fontFamily:F.body,fontSize:11,color:C.grey400,marginTop:1}}>{p.location}</div>}
                      </div>
                      {/* Only show individual product price if showPricing is on */}
                      {showPrice&&(
                        <div style={{textAlign:"right",flexShrink:0}}>
                          <div style={{fontFamily:F.heading,fontSize:13,fontWeight:700,color:C.terra}}>{formatPrice(p.pricing)}</div>
                          {isTiered&&<div style={{fontFamily:F.body,fontSize:10,color:C.grey400}}>{p.pricing.note}</div>}
                        </div>
                      )}
                    </div>
                    <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:8}}>
                      <Badge color={typeColor(p.type)} xs>{p.type==="small_group"?"Small Group":p.type==="component"?"Component":"Private"}</Badge>
                      {p.duration&&<Badge xs>{p.duration}</Badge>}
                      {p.departures&&<Badge xs>{p.departures}</Badge>}
                    </div>
                    {p.description&&<p style={{fontFamily:F.body,fontSize:12,color:C.grey600,lineHeight:1.5,marginBottom:8}}>{p.description}</p>}
                    {item.notes&&<div style={{fontFamily:F.body,fontSize:11,fontStyle:"italic",color:C.navy,background:C.sandLight,borderRadius:5,padding:"6px 10px",marginBottom:8}}>Note: {item.notes}</div>}
                    {showPrice&&isTiered&&p.pricing.tiers?.length>0&&(
                      <table style={{borderCollapse:"collapse",marginBottom:8}}>
                        <tbody>{p.pricing.tiers.map((t,i)=><tr key={i}><td style={{fontFamily:F.body,fontSize:11,color:C.grey600,padding:"1px 12px 1px 0"}}>{t.label}</td><td style={{fontFamily:F.heading,fontSize:12,color:C.terra,fontWeight:700}}>${(t.retail||0).toLocaleString()}</td></tr>)}</tbody>
                      </table>
                    )}
                    {p.inclusions?.length>0&&(
                      <div>
                        <div style={{fontFamily:F.body,fontSize:9,fontWeight:700,color:C.grey400,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>Included</div>
                        <ul style={{listStyle:"none",padding:0,columns:2,gap:12}}>
                          {p.inclusions.map((inc,i)=><li key={i} style={{fontFamily:F.body,fontSize:11,color:C.grey600,paddingLeft:10,position:"relative",marginBottom:2,breakInside:"avoid"}}><span style={{position:"absolute",left:0,top:5,width:5,height:1,background:C.teal}}/>{inc}</li>)}
                        </ul>
                      </div>
                    )}
                    {showInternal&&p.rezdy&&<div style={{marginTop:6,fontFamily:F.body,fontSize:9,color:C.grey400,background:C.grey100,borderRadius:3,padding:"1px 5px",display:"inline-block"}}>Rezdy: {p.rezdy}</div>}
                  </div>
                </div>
              );
            })}
            {day.items.length===0&&<div style={{textAlign:"center",padding:16,color:C.grey400,fontFamily:F.body,fontSize:12,border:`1px dashed ${C.grey200}`,borderRadius:6}}>No experiences added to this day</div>}
          </div>
        );
      })}

      {/* Terms & Conditions */}
      {itinerary.terms&&(
        <div className="print-break" style={{marginBottom:20}}>
          <div style={{fontFamily:F.heading,fontSize:14,fontWeight:700,color:C.navy,marginBottom:12,paddingBottom:8,borderBottom:`2px solid ${C.sand}`}}>Terms & Conditions</div>
          <div style={{fontFamily:F.body,fontSize:11,color:C.grey600,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{itinerary.terms}</div>
        </div>
      )}

      {/* Footer */}
      <div style={{background:C.navy,borderRadius:10,padding:"18px 24px"}}>
        <div style={{fontFamily:F.serif,fontSize:13,fontStyle:"italic",color:C.sand,marginBottom:10}}>"Hosted journeys of wine country and beyond."</div>
        <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
          {[["Phone","1800 861 190"],["Email","info@coonawarraexperiences.com.au"],["Web","coonawarraexperiences.com.au"]].map(([k,v])=>(
            <div key={k} style={{fontFamily:F.body,fontSize:11,color:"rgba(255,255,255,0.6)"}}><span style={{color:C.sand,fontWeight:600}}>{k}</span> {v}</div>
          ))}
        </div>
        {itinerary.notes&&<div style={{marginTop:10,paddingTop:10,borderTop:`1px solid rgba(255,255,255,0.12)`,fontFamily:F.body,fontSize:11,color:"rgba(255,255,255,0.5)"}}>{itinerary.notes}</div>}
      </div>
    </div>
  );
}

// ─── Email draft builder ──────────────────────────────────────────────────────
function buildEmailBody(itinerary, allProducts) {
  const lines = [];
  lines.push(`Dear ${itinerary.clientName||"there"},`);
  lines.push("");
  lines.push(`Thank you for your interest in a private journey with Coonawarra Experiences. I'm delighted to share this itinerary for your consideration.`);
  if(itinerary.intro) { lines.push(""); lines.push(itinerary.intro); }
  lines.push("");
  if(itinerary.arrivalDate||itinerary.departureDate) {
    if(itinerary.arrivalDate) lines.push(`Arrival: ${fmtDate(itinerary.arrivalDate)}`);
    if(itinerary.departureDate) lines.push(`Departure: ${fmtDate(itinerary.departureDate)}`);
  }
  if(itinerary.guestCount) lines.push(`Guests: ${itinerary.guestCount}`);
  if(itinerary.totalPrice) lines.push(`Investment: ${itinerary.totalPrice}`);
  lines.push("");
  itinerary.days.forEach((day,di)=>{
    lines.push(`DAY ${di+1} — ${day.title}${day.location?` · ${day.location}`:""}`);
    if(day.dayNotes) lines.push(day.dayNotes);
    day.items.forEach(item=>{
      const p=findProduct(allProducts,item.productId);
      if(p) {
        lines.push(`  · ${p.name}${p.duration?` (${p.duration})`:""}`);
        if(item.notes) lines.push(`    ${item.notes}`);
      }
    });
    lines.push("");
  });
  lines.push("I would love to discuss this itinerary with you and tailor it further to your preferences.");
  lines.push("");
  lines.push("Warm regards,");
  lines.push("Simon & Kerry Meares");
  lines.push("Coonawarra Experiences");
  lines.push("1800 861 190 · info@coonawarraexperiences.com.au");
  return lines.join("\n");
}

function sendEmail(itinerary, allProducts) {
  const subject = encodeURIComponent(`Your Coonawarra Experiences Itinerary — ${itinerary.title}`);
  const to = encodeURIComponent(itinerary.clientEmail||"");
  const body = encodeURIComponent(buildEmailBody(itinerary, allProducts));
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
}

// ─── Status ───────────────────────────────────────────────────────────────────
const SC={draft:C.grey400,review:C.teal,published:C.terra};
const SL={draft:"Draft",review:"In Review",published:"Published"};

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App(){
  const [tab,setTab]=useState("builder");
  const [bView,setBView]=useState("edit");
  const [showInternal,setSI]=useState(false);
  const [itineraries,setIts]=useState(()=>loadIts());
  const [activeId,setActiveId]=useState(null);
  const [productImages,setPImgs]=useState(()=>loadImgs());
  const [customProducts,setCPs]=useState(()=>loadCP());
  const [libCat,setLibCat]=useState("All");
  const [libSearch,setLibSrch]=useState("");
  const [showForm,setShowForm]=useState(false);
  const [editProduct,setEditProduct]=useState(null);

  const allProducts=[...BUILT_IN_PRODUCTS,...customProducts];
  const active=itineraries.find(i=>i.id===activeId)||null;

  function handleImagesChange(productId,imgs){const next={...productImages,[productId]:imgs};setPImgs(next);saveImgs(next);}

  function handleSaveProduct(product){
    let next;
    if(editProduct) next=customProducts.map(p=>p.id===product.id?{...product,custom:true}:p);
    else next=[{...product,id:uid(),custom:true},...customProducts];
    setCPs(next);saveCP(next);setShowForm(false);setEditProduct(null);
  }

  function handleDeleteProduct(id){
    if(!confirm("Delete this custom product?")) return;
    const next=customProducts.filter(p=>p.id!==id);
    setCPs(next);saveCP(next);
  }

  function mutate(fn){
    setIts(prev=>{const next=prev.map(i=>i.id===activeId?{...fn(i),updatedAt:new Date().toISOString()}:i);saveIts(next);return next;});
  }

  function createNew(){const it=newItinerary();const next=[it,...itineraries];setIts(next);saveIts(next);setActiveId(it.id);setTab("builder");setBView("edit");}
  function deleteIt(id){if(!confirm("Delete this itinerary?"))return;const next=itineraries.filter(i=>i.id!==id);setIts(next);saveIts(next);if(activeId===id)setActiveId(null);}
  function dupIt(it){const c={...JSON.parse(JSON.stringify(it)),id:uid(),title:it.title+" (copy)",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};const next=[c,...itineraries];setIts(next);saveIts(next);setActiveId(c.id);setTab("builder");setBView("edit");}
  function addDay(){mutate(it=>({...it,days:[...it.days,{id:uid(),title:`Day ${it.days.length+1}`,date:"",location:"",items:[],dayNotes:""}]}));}
  function removeDay(dayId){mutate(it=>({...it,days:it.days.filter(d=>d.id!==dayId)}));}
  function updateDay(d){mutate(it=>({...it,days:it.days.map(x=>x.id===d.id?d:x)}));}
  function addItem(dayId,product){mutate(it=>({...it,days:it.days.map(d=>d.id===dayId?{...d,items:[...d.items,{id:uid(),productId:product.id,notes:""}]}:d)}));}
  function removeItem(dayId,itemId){mutate(it=>({...it,days:it.days.map(d=>d.id===dayId?{...d,items:d.items.filter(i=>i.id!==itemId)}:d)}));}
  function moveItem(dayId,idx,dir){mutate(it=>({...it,days:it.days.map(d=>{if(d.id!==dayId)return d;const items=[...d.items],ni=idx+dir;if(ni<0||ni>=items.length)return d;[items[idx],items[ni]]=[items[ni],items[idx]];return{...d,items};})}));}
  function updateNote(dayId,itemId,note){mutate(it=>({...it,days:it.days.map(d=>d.id===dayId?{...d,items:d.items.map(i=>i.id===itemId?{...i,notes:note}:i)}:d)}));}

  const filtered=allProducts.filter(p=>{
    const catOk=libCat==="All"||p.category===libCat||(libCat==="Custom"&&p.custom);
    const s=libSearch.toLowerCase();
    return catOk&&(!s||p.name.toLowerCase().includes(s)||p.tags?.some(t=>t.toLowerCase().includes(s))||(showInternal&&p.rezdy?.toLowerCase().includes(s)));
  });

  const fi={fontFamily:F.body,fontSize:12,color:C.text,border:`1px solid ${C.grey200}`,borderRadius:5,padding:"4px 8px",outline:"none",background:C.white};

  return(
    <div style={{minHeight:"100vh",background:C.offWhite}}>
      <style>{CSS}</style>

      {/* Header */}
      <header className="no-print" style={{background:C.navy,position:"sticky",top:0,zIndex:200,boxShadow:"0 2px 12px rgba(25,41,87,0.2)"}}>
        <div style={{maxWidth:1600,margin:"0 auto",padding:"10px 18px",display:"flex",alignItems:"center",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginRight:8,flexShrink:0}}>
            <div style={{width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${C.teal},${C.terra})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{color:C.white,fontSize:12,fontWeight:700,fontFamily:F.heading}}>CE</span>
            </div>
            <div>
              <div style={{fontFamily:F.heading,fontSize:12,fontWeight:700,color:C.white,letterSpacing:"0.04em",textTransform:"uppercase"}}>Coonawarra Experiences</div>
              <div style={{fontFamily:F.body,fontSize:9,color:C.sand,letterSpacing:"0.08em",textTransform:"uppercase"}}>Itinerary Builder · 2027/2028</div>
            </div>
          </div>
          <div style={{display:"flex",gap:3}}>
            {[{k:"builder",l:active?`Builder — ${active.title}`:"Builder"},{k:"saved",l:`Saved (${itineraries.length})`}].map(({k,l})=>(
              <button key={k} onClick={()=>setTab(k)} style={{fontFamily:F.body,fontSize:12,fontWeight:tab===k?600:400,color:tab===k?C.white:"rgba(255,255,255,0.5)",background:tab===k?"rgba(255,255,255,0.12)":"transparent",border:"none",borderRadius:5,padding:"5px 12px"}}>{l}</button>
            ))}
          </div>
          {tab==="builder"&&active&&(
            <div style={{display:"flex",gap:3,marginLeft:4}}>
              {[{k:"edit",l:"Edit"},{k:"preview",l:"Preview"}].map(({k,l})=>(
                <button key={k} onClick={()=>setBView(k)} style={{fontFamily:F.body,fontSize:11,fontWeight:bView===k?600:400,color:bView===k?C.navy:"rgba(255,255,255,0.55)",background:bView===k?C.sand:"transparent",border:"none",borderRadius:5,padding:"4px 10px"}}>{l}</button>
              ))}
            </div>
          )}
          <div style={{flex:1}}/>
          <div onClick={()=>setSI(v=>!v)} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",background:"rgba(255,255,255,0.06)",borderRadius:5,border:`1px solid rgba(255,255,255,0.1)`,cursor:"pointer"}}>
            <div style={{width:26,height:14,borderRadius:7,background:showInternal?C.teal:"rgba(255,255,255,0.18)",position:"relative",transition:"background 0.2s",flexShrink:0}}><div style={{position:"absolute",top:2,left:showInternal?12:2,width:10,height:10,borderRadius:"50%",background:C.white,transition:"left 0.2s"}}/></div>
            <span style={{fontFamily:F.body,fontSize:11,color:"rgba(255,255,255,0.65)",userSelect:"none"}}>Internal</span>
          </div>
          <button onClick={createNew} style={{fontFamily:F.heading,fontSize:10,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:C.white,background:C.terra,border:"none",borderRadius:5,padding:"6px 12px"}}>+ New</button>
          {tab==="builder"&&active&&bView==="preview"&&(
            <>
              <button onClick={()=>{document.title=`${active.clientName||"Itinerary"} — ${active.title}`;window.print();}} style={{fontFamily:F.heading,fontSize:10,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:C.navy,background:C.sand,border:"none",borderRadius:5,padding:"6px 12px"}}>Print / PDF</button>
              <button onClick={()=>sendEmail(active,allProducts)} style={{fontFamily:F.heading,fontSize:10,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:C.white,background:C.teal,border:"none",borderRadius:5,padding:"6px 12px"}}>Email Draft</button>
            </>
          )}
        </div>
        <div style={{background:C.sand,padding:"4px 18px",display:"flex",gap:16,alignItems:"center"}}>
          <span style={{fontFamily:F.body,fontSize:10,fontWeight:700,color:C.navy,letterSpacing:"0.06em",textTransform:"uppercase"}}>Season 2027 / 2028</span>
          <span style={{fontFamily:F.body,fontSize:10,color:C.grey600}}>Valid 1 April 2027 – 31 March 2028 · AUD incl. 10% GST</span>
          {showInternal&&<span style={{fontFamily:F.body,fontSize:10,fontWeight:600,color:C.teal}}>Internal view on</span>}
        </div>
      </header>

      {/* Saved tab */}
      {tab==="saved"&&(
        <div className="no-print" style={{maxWidth:860,margin:"28px auto",padding:"0 18px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
            <div style={{fontFamily:F.heading,fontSize:18,fontWeight:700,color:C.navy}}>Saved Itineraries</div>
            <button onClick={createNew} style={{fontFamily:F.heading,fontSize:10,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:C.white,background:C.terra,border:"none",borderRadius:5,padding:"7px 14px"}}>+ New</button>
          </div>
          {itineraries.length===0?(
            <div style={{textAlign:"center",padding:"50px 20px",background:C.white,borderRadius:10,border:`1px solid ${C.grey200}`}}>
              <div style={{fontFamily:F.heading,fontSize:15,color:C.navy,marginBottom:6}}>No itineraries yet</div>
              <button onClick={createNew} style={{fontFamily:F.heading,fontSize:10,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:C.white,background:C.terra,border:"none",borderRadius:5,padding:"7px 16px",marginTop:12}}>+ New Itinerary</button>
            </div>
          ):itineraries.map(it=>(
            <div key={it.id} style={{background:C.white,border:`2px solid ${activeId===it.id?C.teal:C.grey200}`,borderRadius:10,padding:"12px 16px",marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                  <span style={{fontFamily:F.heading,fontSize:14,fontWeight:700,color:C.navy}}>{it.title}</span>
                  <span style={{fontFamily:F.body,fontSize:9,fontWeight:700,color:SC[it.status],background:`${SC[it.status]}18`,border:`1px solid ${SC[it.status]}30`,borderRadius:10,padding:"1px 6px",textTransform:"uppercase"}}>{SL[it.status]}</span>
                </div>
                <div style={{fontFamily:F.body,fontSize:11,color:C.grey400,display:"flex",gap:10,flexWrap:"wrap"}}>
                  {it.clientName&&<span>{it.clientName}</span>}
                  <span>{it.days.length} {it.days.length===1?"day":"days"}</span>
                  {it.arrivalDate&&<span>Arrives {fmtDate(it.arrivalDate)}</span>}
                  <span>Updated {new Date(it.updatedAt).toLocaleDateString("en-AU")}</span>
                </div>
              </div>
              <div style={{display:"flex",gap:5,flexShrink:0}}>
                <button onClick={()=>{setActiveId(it.id);setTab("builder");setBView("edit");}} style={{fontFamily:F.body,fontSize:11,fontWeight:600,color:C.white,background:C.navy,border:"none",borderRadius:5,padding:"5px 12px"}}>Open</button>
                <button onClick={()=>dupIt(it)} style={{fontFamily:F.body,fontSize:11,color:C.navy,background:"transparent",border:`1px solid ${C.grey200}`,borderRadius:5,padding:"5px 10px"}}>Copy</button>
                <button onClick={()=>deleteIt(it.id)} style={{fontFamily:F.body,fontSize:11,color:C.terra,background:"transparent",border:`1px solid ${C.terra}40`,borderRadius:5,padding:"5px 10px"}}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Builder */}
      {tab==="builder"&&(
        !active?(
          <div style={{textAlign:"center",padding:"70px 20px"}}>
            <div style={{fontFamily:F.heading,fontSize:18,color:C.navy,marginBottom:6}}>No itinerary open</div>
            <div style={{fontFamily:F.body,fontSize:13,color:C.grey400,marginBottom:18}}>Create a new itinerary or open a saved one.</div>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button onClick={createNew} style={{fontFamily:F.heading,fontSize:11,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:C.white,background:C.terra,border:"none",borderRadius:6,padding:"9px 22px"}}>+ New Itinerary</button>
              <button onClick={()=>setTab("saved")} style={{fontFamily:F.heading,fontSize:11,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:C.navy,background:C.white,border:`1px solid ${C.grey200}`,borderRadius:6,padding:"9px 22px"}}>Open Saved</button>
            </div>
          </div>
        ):bView==="preview"?(
          <div style={{padding:"20px 18px"}}>
            <Preview itinerary={active} productImages={productImages} showInternal={showInternal} allProducts={allProducts}/>
          </div>
        ):(
          <div className="no-print" style={{display:"grid",gridTemplateColumns:"300px 1fr",height:"calc(100vh - 84px)",overflow:"hidden"}}>

            {/* Library */}
            <div style={{background:C.white,borderRight:`1px solid ${C.grey200}`,display:"flex",flexDirection:"column",overflow:"hidden"}}>
              <div style={{padding:"10px 12px",borderBottom:`1px solid ${C.grey200}`,background:C.grey100}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:7}}>
                  <div style={{fontFamily:F.heading,fontSize:10,fontWeight:700,color:C.grey400,letterSpacing:"0.1em",textTransform:"uppercase"}}>Product Library</div>
                  <button onClick={()=>{setShowForm(true);setEditProduct(null);setLibCat("Custom");}} style={{fontFamily:F.body,fontSize:10,fontWeight:700,color:C.white,background:C.teal,border:"none",borderRadius:5,padding:"3px 10px"}}>+ Custom</button>
                </div>
                <input value={libSearch} onChange={e=>setLibSrch(e.target.value)} placeholder="Search products..." style={{width:"100%",fontFamily:F.body,fontSize:12,border:`1px solid ${C.grey200}`,borderRadius:5,padding:"5px 9px",outline:"none",background:C.white,marginBottom:7}}/>
                <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                  {CATS.map(cat=>(
                    <button key={cat} onClick={()=>{setLibCat(cat);setShowForm(false);}} style={{fontFamily:F.body,fontSize:9,fontWeight:libCat===cat?700:400,color:libCat===cat?C.white:C.grey600,background:libCat===cat?C.navy:"transparent",border:libCat===cat?"none":`1px solid ${C.grey200}`,borderRadius:10,padding:"2px 7px"}}>
                      {CAT_S[cat]}{cat==="Custom"?` (${customProducts.length})`:""}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:8}}>
                {showForm&&<ProductForm initial={editProduct} onSave={handleSaveProduct} onCancel={()=>{setShowForm(false);setEditProduct(null);}}/>}
                {filtered.length===0&&!showForm&&<div style={{textAlign:"center",padding:24,color:C.grey400,fontFamily:F.body,fontSize:12}}>{libCat==="Custom"?"No custom products yet. Click + Custom to add one.":"No products match"}</div>}
                {filtered.map(p=>(
                  <LibraryCard key={p.id} product={p} images={productImages[p.id]||[]} onImagesChange={handleImagesChange} showInternal={showInternal}
                    onAdd={product=>{if(active?.days?.length>0) addItem(active.days[active.days.length-1].id,product);}}
                    onEdit={()=>{setEditProduct(p);setShowForm(true);setLibCat("Custom");}}
                    onDelete={()=>handleDeleteProduct(p.id)}
                  />
                ))}
              </div>
            </div>

            {/* Builder right panel */}
            <div style={{display:"flex",flexDirection:"column",overflow:"hidden"}}>
              {/* Meta bar */}
              <div style={{background:C.white,borderBottom:`1px solid ${C.grey200}`,padding:"8px 14px"}}>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",marginBottom:6}}>
                  <input value={active.title} onChange={e=>mutate(it=>({...it,title:e.target.value}))} style={{fontFamily:F.heading,fontSize:15,fontWeight:700,color:C.navy,border:"none",outline:"none",background:"transparent",flex:"1 1 180px",minWidth:0}} placeholder="Itinerary title"/>
                  <input value={active.clientName} onChange={e=>mutate(it=>({...it,clientName:e.target.value}))} placeholder="Client name" style={{...fi,width:140}}/>
                  <input value={active.clientEmail} onChange={e=>mutate(it=>({...it,clientEmail:e.target.value}))} placeholder="Client email" style={{...fi,width:180}}/>
                  <input type="number" value={active.guestCount} onChange={e=>mutate(it=>({...it,guestCount:parseInt(e.target.value)||2}))} min={1} max={20} title="Guests" style={{...fi,width:55}}/>
                  <input value={active.origin} onChange={e=>mutate(it=>({...it,origin:e.target.value}))} placeholder="Origin" style={{...fi,width:110}}/>
                  <select value={active.status} onChange={e=>mutate(it=>({...it,status:e.target.value}))} style={{...fi,color:SC[active.status],fontWeight:600}}>
                    <option value="draft">Draft</option><option value="review">In Review</option><option value="published">Published</option>
                  </select>
                </div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <span style={{fontFamily:F.body,fontSize:10,fontWeight:700,color:C.grey400,letterSpacing:"0.06em",textTransform:"uppercase"}}>Arrival</span>
                    <input type="date" value={active.arrivalDate||""} onChange={e=>mutate(it=>({...it,arrivalDate:e.target.value}))} style={{...fi}}/>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <span style={{fontFamily:F.body,fontSize:10,fontWeight:700,color:C.grey400,letterSpacing:"0.06em",textTransform:"uppercase"}}>Departure</span>
                    <input type="date" value={active.departureDate||""} onChange={e=>mutate(it=>({...it,departureDate:e.target.value}))} style={{...fi}}/>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <span style={{fontFamily:F.body,fontSize:10,fontWeight:700,color:C.grey400,letterSpacing:"0.06em",textTransform:"uppercase"}}>Total price</span>
                    <input value={active.totalPrice||""} onChange={e=>mutate(it=>({...it,totalPrice:e.target.value}))} placeholder="e.g. From $3,975 per couple" style={{...fi,width:220}}/>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginLeft:"auto"}}>
                    <span style={{fontFamily:F.body,fontSize:11,color:C.grey400}}>Show item pricing in output</span>
                    <div onClick={()=>mutate(it=>({...it,showPricing:!it.showPricing}))} style={{width:32,height:17,borderRadius:9,background:active.showPricing?C.teal:C.grey200,position:"relative",cursor:"pointer",transition:"background 0.2s",flexShrink:0}}>
                      <div style={{position:"absolute",top:2,left:active.showPricing?14:2,width:13,height:13,borderRadius:"50%",background:C.white,transition:"left 0.2s"}}/>
                    </div>
                  </div>
                </div>
              </div>

              {/* Days scroll */}
              <div style={{flex:1,overflowY:"auto",padding:"14px 14px 28px"}}>
                {active.days.map((day,di)=>(
                  <DayCard key={day.id} day={day} dayIndex={di} totalDays={active.days.length}
                    productImages={productImages} allProducts={allProducts} showPricing={active.showPricing}
                    onUpdate={updateDay} onRemoveItem={removeItem} onMoveItem={moveItem}
                    onNoteChange={updateNote} onRemove={()=>removeDay(day.id)}
                  />
                ))}
                <button onClick={addDay} style={{width:"100%",fontFamily:F.body,fontSize:13,fontWeight:600,color:C.navy,background:C.white,border:`2px dashed ${C.grey200}`,borderRadius:10,padding:"13px"}}>+ Add Day</button>

                {/* Intro */}
                <div style={{marginTop:18,background:C.white,border:`1px solid ${C.grey200}`,borderRadius:10,padding:14}}>
                  <div style={{fontFamily:F.body,fontSize:10,fontWeight:700,color:C.grey400,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6}}>Introduction / journey overview</div>
                  <textarea value={active.intro||""} onChange={e=>mutate(it=>({...it,intro:e.target.value}))} placeholder="Write an opening paragraph for the itinerary — what makes this journey special, the tone you want to set. Appears between the cover and Day 1." style={{width:"100%",fontFamily:F.body,fontSize:12,color:C.text,border:`1px solid ${C.grey200}`,borderRadius:6,padding:"8px 12px",resize:"vertical",minHeight:80,outline:"none"}}/>
                </div>

                {/* Host bio */}
                <div style={{marginTop:12,background:C.white,border:`1px solid ${C.grey200}`,borderRadius:10,padding:14}}>
                  <div style={{fontFamily:F.body,fontSize:10,fontWeight:700,color:C.grey400,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6}}>Host introduction (Simon & Kerry)</div>
                  <textarea value={active.hostBio||""} onChange={e=>mutate(it=>({...it,hostBio:e.target.value}))} placeholder="A short introduction to Simon and Kerry as hosts. Leave blank to hide." style={{width:"100%",fontFamily:F.body,fontSize:12,color:C.text,border:`1px solid ${C.grey200}`,borderRadius:6,padding:"8px 12px",resize:"vertical",minHeight:70,outline:"none"}}/>
                </div>

                {/* Terms */}
                <div style={{marginTop:12,background:C.white,border:`1px solid ${C.grey200}`,borderRadius:10,padding:14}}>
                  <div style={{fontFamily:F.body,fontSize:10,fontWeight:700,color:C.grey400,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6}}>Terms & Conditions</div>
                  <textarea value={active.terms||""} onChange={e=>mutate(it=>({...it,terms:e.target.value}))} placeholder="Terms and conditions. Leave blank to hide." style={{width:"100%",fontFamily:F.body,fontSize:11,color:C.text,border:`1px solid ${C.grey200}`,borderRadius:6,padding:"8px 12px",resize:"vertical",minHeight:120,outline:"none"}}/>
                </div>

                {/* Footer notes */}
                <div style={{marginTop:12,background:C.white,border:`1px solid ${C.grey200}`,borderRadius:10,padding:14}}>
                  <div style={{fontFamily:F.body,fontSize:10,fontWeight:700,color:C.grey400,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6}}>Footer note (optional)</div>
                  <textarea value={active.notes||""} onChange={e=>mutate(it=>({...it,notes:e.target.value}))} placeholder="Any additional note to appear in the footer..." style={{width:"100%",fontFamily:F.body,fontSize:12,color:C.text,border:`1px solid ${C.grey200}`,borderRadius:6,padding:"8px 12px",resize:"vertical",minHeight:48,outline:"none"}}/>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
