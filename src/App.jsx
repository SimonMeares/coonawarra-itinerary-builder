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

const DEFAULT_BEFORE_YOU_ARRIVE = `Getting here
Penola is approximately 4 hours from Adelaide and 5 hours from Melbourne by car. The nearest regional airport is Mount Gambier, around 45 minutes from Penola. Rex Airlines operates daily services from Adelaide and Melbourne.

We recommend arriving no later than 4pm in winter months — wildlife is active at dusk on regional roads and it is safest to complete your drive before dark.

What to pack
Layers are essential year-round. Mornings and evenings can be cool even in summer. In winter, bring a warm jacket, waterproof layer and sturdy footwear for outdoor stops. Comfortable walking shoes are ideal for cave tours and vineyard walks.

Mobile coverage
Coverage is patchy in parts of the Limestone Coast and Coonawarra. Telstra provides the most reliable regional coverage. Download your itinerary and any maps before you leave — we will be contactable throughout your journey.

What to expect
All experiences are privately hosted by Simon and Kerry. Our vehicle is fully air-conditioned and we will collect you from your accommodation. There is no rushing — we take our time and adapt the day to your pace.

A note on dining
Lunches are set-menu unless otherwise noted. Please let us know of any dietary requirements in advance and we will communicate them to all venues on your behalf.

Emergency contacts
Simon Meares (mobile): +61 404 092 611
Kerry Meares (mobile): +61 405 733 477
Emergency services: 000
Penola Hospital: +61 8 8737 0000`;

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

const CATS=["All","Day Tours","Stay & Tour Packages","Transfers & Journeys","Experience Components","Accommodation","Custom"];
const CAT_S={"All":"All","Day Tours":"Day Tours","Stay & Tour Packages":"Packages","Transfers & Journeys":"Transfers","Experience Components":"Components","Accommodation":"Stays","Custom":"Custom"};
const PRICE_STRUCTURES=[
  {value:"per_adult",label:"Per adult (single rate)"},
  {value:"per_couple",label:"Per couple (single rate)"},
  {value:"on_request",label:"Price on request"},
  {value:"component",label:"Component / included in package"},
  {value:"tiered_per_person_by_group",label:"Tiered per person by group size"},
  {value:"tiered_per_couple_by_group",label:"Tiered per couple by group size"},
  {value:"per_night",label:"Per night (accommodation)"},
  {value:"per_night_per_room",label:"Per night per room (accommodation)"},
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function uid(){return "c_"+Math.random().toString(36).slice(2,11);}
function findProduct(all,id){return all.find(p=>p.id===id);}
function fmtDate(d){if(!d)return"";return new Date(d).toLocaleDateString("en-AU",{day:"numeric",month:"long",year:"numeric"});}
function fmtDateShort(d){if(!d)return"";return new Date(d).toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"long"});}

function formatPrice(pricing){
  const{structure,tiers}=pricing;
  if(structure==="on_request")return"Price on request";
  if(structure==="per_night")return`$${(tiers[0]?.retail||0).toLocaleString()} per night`;
  if(structure==="per_night_per_room")return`$${(tiers[0]?.retail||0).toLocaleString()} per room per night`;
  if(structure==="component")return"See package";
  if(structure==="per_adult")return`$${(tiers[0]?.retail||0).toLocaleString()} per adult`;
  if(structure==="per_couple")return`$${(tiers[0]?.retail||0).toLocaleString()} per couple`;
  if(structure==="tiered_per_person_by_group"||structure==="tiered_per_couple_by_group"){
    if(!tiers||!tiers.length)return"Tiered pricing";
    const lo=tiers[tiers.length-1].retail,hi=tiers[0].retail;
    return`$${lo}–$${hi} ${structure==="tiered_per_couple_by_group"?"per couple":"per person"}`;
  }
  return"";
}

function typeColor(type){return type==="private"?C.navy:type==="small_group"?C.teal:C.grey400;}

function netPrice(pricing, commPct){
  const{structure,tiers}=pricing;
  if(!tiers||!tiers.length)return null;
  const disc=1-(commPct/100);
  if(structure==="per_adult"||structure==="per_couple"){
    const net=Math.round(tiers[0].retail*disc);
    return{single:net, label:structure==="per_couple"?"per couple":"per adult"};
  }
  if(structure==="tiered_per_person_by_group"||structure==="tiered_per_couple_by_group"){
    const unit=structure==="tiered_per_couple_by_group"?"per couple":"per person";
    return{tiered:tiers.map(t=>({...t,net:Math.round(t.retail*disc)})),label:unit};
  }
  return null;
}

function buildHighlights(itinerary,allProducts){
  const items=itinerary.days.flatMap(d=>d.items);
  const seen=new Set();
  const highlights=[];
  const nights=itinerary.days.length;
  if(nights>0)highlights.push({icon:"🌙",label:`${nights} ${nights===1?"Night":"Nights"}`});
  if(itinerary.guestCount)highlights.push({icon:"👤",label:`${itinerary.guestCount} ${itinerary.guestCount===1?"Guest":"Guests"}`});
  const tagPriority=["Wagyu","Caves","Indigenous","Wildlife","Heritage","Wine","Off-Grid","Cultural","Transfer","Coastal"];
  for(const tag of tagPriority){
    if(highlights.length>=4)break;
    const has=items.some(item=>{const p=findProduct(allProducts,item.productId);return p?.tags?.includes(tag)&&!seen.has(tag);});
    if(has){seen.add(tag);highlights.push({icon:tagIcon(tag),label:tag});}
  }
  const hasPrivate=items.some(item=>{const p=findProduct(allProducts,item.productId);return p?.type==="private";});
  if(hasPrivate&&highlights.length<5)highlights.push({icon:"🔑",label:"Privately Hosted"});
  return highlights.slice(0,5);
}

function tagIcon(tag){
  const map={Wagyu:"🥩",Caves:"🦇",Indigenous:"🌿",Wildlife:"🦘",Heritage:"🏛️",Wine:"🍷","Off-Grid":"🏕️",Cultural:"🎶",Transfer:"🚗",Dining:"🍽️",Coastal:"🌊"};
  return map[tag]||"✦";
}

function generateCERef(existingItineraries) {
  const year = new Date().getFullYear();
  const season = new Date().getMonth() >= 3 ? year + 1 : year; // April onwards = next season
  const prefix = `CE-${season}-`;
  const existing = (existingItineraries||[])
    .map(it => it.ceRef||"")
    .filter(r => r.startsWith(prefix))
    .map(r => parseInt(r.replace(prefix,""))||0);
  const next = existing.length ? Math.max(...existing) + 1 : 1;
  return `${prefix}${String(next).padStart(3,"0")}`;
}

function newDay(index){
  return{id:uid(),title:`Day ${index}`,date:"",location:"",items:[],dayNotes:"",internalNotes:""};
}

function newItinerary(){
  return{
    id:uid(),ceRef:"",rezdyRef:"",title:"New Itinerary",clientName:"",clientEmail:"",
    guestCount:2,arrivalDate:"",departureDate:"",origin:"Melbourne",
    status:"draft",totalPrice:"",expiryDate:"",bookByDate:"",showPricing:false,tradeMode:false,commission:20,printFlow:false,agentLogo:"",agentName:"",agentRef:"",
    intro:"",hostBio:"Simon and Kerry Meares are your personal hosts throughout this journey — locals who left Melbourne to build a life and a business on the Limestone Coast. Every experience in this itinerary reflects a connection they've built with the region's people, places and producers.",
    welcomeMessage:"",emailIntro:"",beforeYouArrive:DEFAULT_BEFORE_YOU_ARRIVE,
    terms:DEFAULT_TERMS,notes:"",
    coverImage:"",attachments:[],
    guestInfo:{name1:"",name2:"",email:"",phone:"",country:"",dietary:"",medical:"",celebrating:"",notes:""},
    internalNotes:"",showInclusions:true,followUpDate:"",statusHistory:[],days:[newDay(1)],
    createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),
  };
}

// ─── Storage ──────────────────────────────────────────────────────────────────
const CL_CLOUD="dgzv5n4f3";
const REZDY_BASE="https://coonawarraexperiences.rezdy.com/";
const LOGO_URL="https://res.cloudinary.com/dgzv5n4f3/image/upload/f_auto,q_auto,w_300/Coonawarra-Experiences-Logo-Portrait-Reverse-Transparent-300dpi-RGB_olm9ho.png";
const CL_PRESET="ce_unsigned";

async function uploadToCloudinary(file){
  const fd=new FormData();
  fd.append("file",file);
  fd.append("upload_preset",CL_PRESET);
  fd.append("folder","coonawarra-experiences");
  const res=await fetch(`https://api.cloudinary.com/v1_1/${CL_CLOUD}/image/upload`,{method:"POST",body:fd});
  if(!res.ok)throw new Error("Upload failed");
  const data=await res.json();
  return data.secure_url.replace("/upload/","/upload/f_auto,q_auto,w_1400/");
}

// ─── Exchange rates ───────────────────────────────────────────────────────────
const DEFAULT_FX = {NZD:1.08,GBP:0.51,USD:0.64,SGD:0.87,EUR:0.59};
const FX_KEY = "ce_fx_rates";
function loadFX(){try{const r=localStorage.getItem(FX_KEY);return r?JSON.parse(r):DEFAULT_FX;}catch(e){return DEFAULT_FX;}}
function saveFX(r){try{localStorage.setItem(FX_KEY,JSON.stringify(r));}catch(e){}}

function convertPrice(audAmount, currency, rates){
  if(!audAmount||currency==="AUD") return null;
  const rate = rates[currency];
  if(!rate) return null;
  const converted = Math.round(audAmount * rate);
  const symbols = {NZD:"NZ$",GBP:"£",USD:"US$",SGD:"S$",EUR:"€"};
  return `${symbols[currency]||currency}${converted.toLocaleString()}`;
}

// ─── Gmail OAuth ──────────────────────────────────────────────────────────────
const GMAIL_CLIENT_ID = "427243151278-h7m87oo8fqogkoljga3el1empqkn0c06.apps.googleusercontent.com";
const GMAIL_SCOPE = "https://www.googleapis.com/auth/gmail.compose";
const GMAIL_TOKEN_KEY = "ce_gmail_token";

function getStoredToken() {
  try {
    const raw = localStorage.getItem(GMAIL_TOKEN_KEY);
    if (!raw) return null;
    const t = JSON.parse(raw);
    if (Date.now() > t.expires_at) { localStorage.removeItem(GMAIL_TOKEN_KEY); return null; }
    return t.access_token;
  } catch(e) { return null; }
}

function storeToken(access_token, expires_in) {
  localStorage.setItem(GMAIL_TOKEN_KEY, JSON.stringify({
    access_token,
    expires_at: Date.now() + (expires_in - 60) * 1000,
  }));
}

function clearToken() { localStorage.removeItem(GMAIL_TOKEN_KEY); }

function requestGmailToken() {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      client_id: GMAIL_CLIENT_ID,
      redirect_uri: window.location.origin,
      response_type: "token",
      scope: GMAIL_SCOPE,
      prompt: "consent",
    });
    const popup = window.open(
      `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
      "gmail_oauth",
      "width=500,height=600,left=300,top=100"
    );
    if (!popup) { reject(new Error("Popup blocked — please allow popups for this site")); return; }
    const timer = setInterval(() => {
      try {
        if (popup.closed) { clearInterval(timer); reject(new Error("Authorisation cancelled")); return; }
        const url = popup.location.href;
        if (url.includes(window.location.origin) && url.includes("access_token")) {
          clearInterval(timer);
          popup.close();
          const hash = new URLSearchParams(popup.location.hash.slice(1));
          const token = hash.get("access_token");
          const expires = parseInt(hash.get("expires_in") || "3600");
          if (token) { storeToken(token, expires); resolve(token); }
          else reject(new Error("No token received"));
        }
      } catch(e) { /* cross-origin — still loading */ }
    }, 300);
    setTimeout(() => { clearInterval(timer); if (!popup.closed) popup.close(); reject(new Error("Authorisation timed out")); }, 120000);
  });
}

async function getGmailToken() {
  const stored = getStoredToken();
  if (stored) return stored;
  return await requestGmailToken();
}

function loadCP(){try{const r=localStorage.getItem("ce_custom_products_v1");return r?JSON.parse(r):[];}catch(e){return[];}}
function saveCP(p){try{localStorage.setItem("ce_custom_products_v1",JSON.stringify(p));}catch(e){}}
function loadImgs(){try{const r=localStorage.getItem("ce_product_images_v2");return r?JSON.parse(r):{};}catch(e){return{};}}
function saveImgs(i){try{localStorage.setItem("ce_product_images_v2",JSON.stringify(i));}catch(e){alert("Failed to save image references.");}}
function loadIts(){try{const r=localStorage.getItem("ce_itineraries_v10");return r?JSON.parse(r):[];}catch(e){return[];}}
function saveIts(l){try{localStorage.setItem("ce_itineraries_v10",JSON.stringify(l));}catch(e){}}
function loadTemplates(){try{const r=localStorage.getItem("ce_templates_v1");return r?JSON.parse(r):[];}catch(e){return[];}}
function saveTemplates(t){try{localStorage.setItem("ce_templates_v1",JSON.stringify(t));}catch(e){}}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Cabin:wght@400;600;700&family=PT+Serif:ital@0;1&family=Source+Sans+3:wght@300;400;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{margin:0;background:#faf9f6;font-family:'Source Sans 3','Open Sans',sans-serif;counter-reset:page-num;}
input,textarea,select,button{font-family:inherit;}
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-track{background:#f4f3f0;}
::-webkit-scrollbar-thumb{background:#d8c69d;border-radius:3px;}
.img-drop-zone{border:2px dashed #e8e6e0;border-radius:6px;padding:10px;text-align:center;cursor:pointer;transition:border-color .15s,background .15s;}
.img-drop-zone:hover,.img-drop-zone.drag-over{border-color:#40c0c0;background:#e0f7f733;}
.img-thumb{position:relative;display:inline-block;}
.img-thumb-del{position:absolute;top:-4px;right:-4px;width:16px;height:16px;border-radius:50%;background:#d34727;color:white;border:none;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;cursor:pointer;line-height:1;padding:0;}
.pdf-drop{border:2px dashed #e8e6e0;border-radius:6px;padding:12px;cursor:pointer;transition:border-color .15s;}
.pdf-drop:hover{border-color:#40c0c0;}
@media print{
  .no-print{display:none!important;}
  body{background:white;}
  .print-break{page-break-before:always;}
  .cover-page{page-break-after:always;}
  .divider-page{page-break-before:always;page-break-after:always;}
  @page{margin:0;size:A4;}
  @page:not(:first){margin:12mm;}
  .page-content{padding:12mm;}
  .print-page-num::after{content:counter(page);}
  body{counter-reset:page;}
  .print-break{counter-increment:page;}
}
`;

// ─── Small components ─────────────────────────────────────────────────────────
function Badge({color,children,xs}){
  return<span style={{display:"inline-block",fontFamily:F.body,fontSize:xs?9:10,fontWeight:600,color:color||C.navy,background:color?`${color}18`:C.sandLight,border:`1px solid ${color?color+"30":C.sandDark}`,borderRadius:20,padding:xs?"1px 5px":"2px 8px",letterSpacing:"0.04em",textTransform:"uppercase"}}>{children}</span>;
}

function TierTable({pricing}){
  if(!["tiered_per_person_by_group","tiered_per_couple_by_group"].includes(pricing.structure)||!pricing.tiers?.length)return null;
  return<table style={{width:"100%",borderCollapse:"collapse",marginTop:4}}><tbody>{pricing.tiers.map((t,i)=><tr key={i}><td style={{fontFamily:F.body,fontSize:11,color:C.grey600,padding:"2px 0"}}>{t.label}</td><td style={{fontFamily:F.heading,fontSize:12,color:C.terra,textAlign:"right",fontWeight:700}}>${(t.retail||0).toLocaleString()}</td></tr>)}</tbody></table>;
}

// ─── Agent logo uploader ──────────────────────────────────────────────────────
function AgentLogoUploader({onUpload}){
  const inputRef=useRef();
  const[uploading,setUploading]=useState(false);
  async function handleFile(file){
    if(!file||!file.type.startsWith("image/"))return;
    setUploading(true);
    try{const url=await uploadToCloudinary(file);onUpload(url);}
    catch(e){alert("Upload failed — try again.");}
    finally{setUploading(false);}
  }
  return(
    <div className="pdf-drop" onClick={()=>!uploading&&inputRef.current.click()} style={{textAlign:"center",padding:"10px"}}>
      <div style={{fontFamily:F.body,fontSize:11,color:uploading?C.teal:C.grey400}}>{uploading?"⏳ Uploading...":"🏢 Click to upload agent logo"}</div>
      <input ref={inputRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
    </div>
  );
}

// ─── Cover image uploader ─────────────────────────────────────────────────────
function CoverImageUploader({onUpload}){
  const inputRef=useRef();
  const[uploading,setUploading]=useState(false);
  const[error,setError]=useState(null);
  async function handleFile(file){
    if(!file||!file.type.startsWith("image/"))return;
    setUploading(true);setError(null);
    try{const url=await uploadToCloudinary(file);onUpload(url);}
    catch(e){setError("Upload failed — try again.");}
    finally{setUploading(false);}
  }
  return(
    <div className="pdf-drop" onClick={()=>!uploading&&inputRef.current.click()} style={{marginBottom:6,textAlign:"center",padding:"14px"}}>
      <div style={{fontFamily:F.body,fontSize:11,color:uploading?C.teal:C.grey400}}>
        {uploading?<>⏳ Uploading...</>:<>🖼 Click to upload cover image</>}
      </div>
      <input ref={inputRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
      {error&&<div style={{color:C.terra,fontSize:10,marginTop:3}}>{error}</div>}
    </div>
  );
}

// ─── Section box ──────────────────────────────────────────────────────────────
function SectionBox({title,children,accent}){
  return(
    <div style={{background:C.white,border:`1px solid ${C.grey200}`,borderRadius:10,overflow:"hidden",marginTop:12}}>
      <div style={{background:accent||C.grey100,padding:"8px 14px",borderBottom:`1px solid ${C.grey200}`}}>
        <span style={{fontFamily:F.body,fontSize:10,fontWeight:700,color:accent?C.white:C.grey400,letterSpacing:"0.1em",textTransform:"uppercase"}}>{title}</span>
      </div>
      <div style={{padding:14}}>{children}</div>
    </div>
  );
}

// ─── Image uploader ───────────────────────────────────────────────────────────
function ImageUploader({productId,images,onImagesChange}){
  const inputRef=useRef();
  const[dragging,setDragging]=useState(false);
  const[uploading,setUploading]=useState(false);
  const[error,setError]=useState(null);
  const[dragIdx,setDragIdx]=useState(null);
  async function handleFiles(files){
    const imageFiles=Array.from(files).filter(f=>f.type.startsWith("image/"));
    if(!imageFiles.length)return;
    setUploading(true);setError(null);
    try{const urls=await Promise.all(imageFiles.map(f=>uploadToCloudinary(f)));onImagesChange(productId,[...(images||[]),...urls]);}
    catch(e){setError("Upload failed — check connection and try again.");}
    finally{setUploading(false);}
  }
  const imgs=images||[];
  return(
    <div style={{marginTop:6}}>
      {imgs.length>0&&(
        <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:6}}>
          {imgs.map((src,i)=>(
            <div key={src} className="img-thumb" style={{width:52,height:40,cursor:"grab",opacity:dragIdx===i?0.4:1,outline:dragIdx!==null&&dragIdx!==i?`2px solid ${C.teal}`:"none",borderRadius:4}}
              draggable
              onDragStart={()=>setDragIdx(i)}
              onDragOver={e=>{e.preventDefault();}}
              onDrop={e=>{e.preventDefault();if(dragIdx===null||dragIdx===i)return;const next=[...imgs];const[moved]=next.splice(dragIdx,1);next.splice(i,0,moved);onImagesChange(productId,next);setDragIdx(null);}}
              onDragEnd={()=>setDragIdx(null)}
            >
              <img src={src} alt="" style={{width:52,height:40,objectFit:"cover",borderRadius:4,border:`1px solid ${C.grey200}`,pointerEvents:"none"}} crossOrigin="anonymous"/>
              <button className="img-thumb-del" onClick={()=>onImagesChange(productId,imgs.filter((_,j)=>j!==i))}>×</button>
              {i===0&&<div style={{position:"absolute",bottom:2,left:2,background:C.teal,borderRadius:2,padding:"1px 3px",fontFamily:F.body,fontSize:7,fontWeight:700,color:C.white,letterSpacing:"0.04em",lineHeight:1}}>HERO</div>}
            </div>
          ))}
        </div>
      )}
      <div className={`img-drop-zone${dragging?" drag-over":""}`} onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)} onDrop={e=>{e.preventDefault();setDragging(false);handleFiles(e.dataTransfer.files);}} onClick={()=>!uploading&&inputRef.current.click()}>
        <div style={{fontFamily:F.body,fontSize:10,color:uploading?C.teal:C.grey400}}>{uploading?<><span style={{fontSize:14}}>⏳</span><br/>Uploading to Cloudinary...</>:imgs.length===0?<><span style={{fontSize:14}}>📷</span><br/>Drop images or click to upload</>:<span>+ Add more images</span>}</div>
        <input ref={inputRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>handleFiles(e.target.files)}/>
      </div>
      {error&&<div style={{fontFamily:F.body,fontSize:10,color:C.terra,marginTop:3}}>{error}</div>}
      {imgs.length>0&&!uploading&&<div style={{fontFamily:F.body,fontSize:9,color:C.grey400,marginTop:2,textAlign:"center"}}>{imgs.length} image{imgs.length!==1?"s":""} · Drag thumbnails to reorder · First is hero</div>}
    </div>
  );
}

function ImageStrip({images}){
  if(!images?.length)return null;
  const show=images.slice(0,4);
  if(show.length===1){
    return<div style={{marginBottom:10,borderRadius:6,overflow:"hidden"}}><img src={show[0]} alt="" style={{width:"100%",height:260,objectFit:"cover",objectPosition:"center center",display:"block"}} crossOrigin="anonymous"/></div>;
  }
  if(show.length===2){
    return<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3,marginBottom:10,borderRadius:6,overflow:"hidden"}}>
      {show.map((s,i)=><img key={i} src={s} alt="" style={{width:"100%",height:180,objectFit:"cover",objectPosition:"center",display:"block"}} crossOrigin="anonymous"/>)}
    </div>;
  }
  if(show.length===3){
    return<div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gridTemplateRows:"auto auto",gap:3,marginBottom:10,borderRadius:6,overflow:"hidden"}}>
      <img src={show[0]} alt="" style={{width:"100%",height:180,objectFit:"cover",objectPosition:"center",display:"block",gridRow:"1 / 3"}} crossOrigin="anonymous"/>
      <img src={show[1]} alt="" style={{width:"100%",height:87,objectFit:"cover",objectPosition:"center",display:"block"}} crossOrigin="anonymous"/>
      <img src={show[2]} alt="" style={{width:"100%",height:87,objectFit:"cover",objectPosition:"center",display:"block"}} crossOrigin="anonymous"/>
    </div>;
  }
  // 4 images — 2x2 grid
  return<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3,marginBottom:10,borderRadius:6,overflow:"hidden"}}>
    {show.map((s,i)=><img key={i} src={s} alt="" style={{width:"100%",height:130,objectFit:"cover",objectPosition:"center",display:"block"}} crossOrigin="anonymous"/>)}
  </div>;
}

// ─── PDF attachment manager ───────────────────────────────────────────────────
function AttachmentManager({attachments,onUpdate}){
  const inputRef=useRef();
  function handleFiles(files){
    Array.from(files).forEach(file=>{
      if(file.type!=="application/pdf")return;
      const reader=new FileReader();
      reader.onload=e=>{
        const att={id:uid(),name:file.name,size:Math.round(file.size/1024),data:e.target.result};
        onUpdate([...(attachments||[]),att]);
      };
      reader.readAsDataURL(file);
    });
  }
  const atts=attachments||[];
  return(
    <div>
      {atts.length>0&&(
        <div style={{marginBottom:8}}>
          {atts.map(att=>(
            <div key={att.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:C.grey100,borderRadius:6,marginBottom:4}}>
              <span style={{fontSize:16}}>📄</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:F.body,fontSize:12,color:C.navy,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{att.name}</div>
                <div style={{fontFamily:F.body,fontSize:10,color:C.grey400}}>{att.size} KB</div>
              </div>
              <button onClick={()=>onUpdate(atts.filter(a=>a.id!==att.id))} style={{fontFamily:F.body,fontSize:11,color:C.terra,background:"transparent",border:`1px solid ${C.terra}30`,borderRadius:4,padding:"2px 8px"}}>Remove</button>
            </div>
          ))}
        </div>
      )}
      <div className="pdf-drop" onClick={()=>inputRef.current.click()}>
        <div style={{fontFamily:F.body,fontSize:11,color:C.grey400,textAlign:"center"}}>
          <span style={{fontSize:16}}>📎</span>
          <div style={{marginTop:3}}>Click to attach PDF documents</div>
          <div style={{fontSize:10,marginTop:1}}>Rate sheets, maps, dossiers, partner packs</div>
        </div>
        <input ref={inputRef} type="file" accept="application/pdf" multiple style={{display:"none"}} onChange={e=>handleFiles(e.target.files)}/>
      </div>
      {atts.length>0&&<div style={{fontFamily:F.body,fontSize:9,color:C.grey400,marginTop:3,textAlign:"center"}}>PDFs stored in browser — listed in itinerary footer</div>}
    </div>
  );
}

// ─── Guest info form ──────────────────────────────────────────────────────────
function GuestInfoForm({guestInfo,onChange}){
  const gi=guestInfo||{};
  const fi={fontFamily:F.body,fontSize:12,color:C.text,border:`1px solid ${C.grey200}`,borderRadius:5,padding:"5px 8px",outline:"none",background:C.white,width:"100%"};
  const L={fontFamily:F.body,fontSize:10,fontWeight:700,color:C.grey400,letterSpacing:"0.08em",textTransform:"uppercase",display:"block",marginBottom:3};
  const W={marginBottom:10};
  return(
    <div>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <div style={{flex:1,...W}}><label style={L}>Guest 1 full name</label><input style={fi} value={gi.name1||""} onChange={e=>onChange({...gi,name1:e.target.value})} placeholder="First and last name"/></div>
        <div style={{flex:1,...W}}><label style={L}>Guest 2 full name</label><input style={fi} value={gi.name2||""} onChange={e=>onChange({...gi,name2:e.target.value})} placeholder="First and last name (if applicable)"/></div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <div style={{flex:1,...W}}><label style={L}>Contact email</label><input style={fi} type="email" value={gi.email||""} onChange={e=>onChange({...gi,email:e.target.value})} placeholder="Guest email address"/></div>
        <div style={{flex:1,...W}}><label style={L}>Contact phone</label><input style={fi} value={gi.phone||""} onChange={e=>onChange({...gi,phone:e.target.value})} placeholder="Inc. country code"/></div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <div style={{flex:1,...W}}><label style={L}>Country of residence</label><input style={fi} value={gi.country||""} onChange={e=>onChange({...gi,country:e.target.value})} placeholder="e.g. United Kingdom"/></div>
        <div style={{flex:1,...W}}><label style={L}>Celebrating anything?</label><input style={fi} value={gi.celebrating||""} onChange={e=>onChange({...gi,celebrating:e.target.value})} placeholder="e.g. Anniversary, birthday"/></div>
      </div>
      <div style={W}><label style={L}>Dietary requirements</label><textarea style={{...fi,resize:"vertical",minHeight:50,padding:"6px 8px"}} value={gi.dietary||""} onChange={e=>onChange({...gi,dietary:e.target.value})} placeholder="Any dietary requirements, allergies or intolerances for all guests"/></div>
      <div style={W}><label style={L}>Medical / mobility notes</label><textarea style={{...fi,resize:"vertical",minHeight:50,padding:"6px 8px"}} value={gi.medical||""} onChange={e=>onChange({...gi,medical:e.target.value})} placeholder="Any medical conditions or mobility considerations we should know about"/></div>
      <div style={W}><label style={L}>Additional notes</label><textarea style={{...fi,resize:"vertical",minHeight:50,padding:"6px 8px"}} value={gi.notes||""} onChange={e=>onChange({...gi,notes:e.target.value})} placeholder="Anything else useful — preferences, special requests, travel style"/></div>
      <div style={{fontFamily:F.body,fontSize:10,color:C.grey400,padding:"8px 10px",background:C.grey100,borderRadius:6}}>
        Guest information is stored locally in this browser and never transmitted externally. It is for your operational use only and does not appear in client-facing output.
      </div>
    </div>
  );
}

// ─── Template manager ─────────────────────────────────────────────────────────
function TemplateManager({templates,onLoad,onDelete,onClose}){
  return(
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(25,41,87,0.6)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:C.white,borderRadius:12,width:560,maxHeight:"80vh",overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <div style={{background:C.navy,padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontFamily:F.heading,fontSize:15,fontWeight:700,color:C.white}}>Itinerary Templates</div>
          <button onClick={onClose} style={{fontFamily:F.body,fontSize:18,color:"rgba(255,255,255,0.6)",background:"transparent",border:"none",lineHeight:1,padding:0}}>×</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:16}}>
          {templates.length===0?(
            <div style={{textAlign:"center",padding:"40px 20px",color:C.grey400,fontFamily:F.body,fontSize:13}}>
              <div style={{fontSize:32,marginBottom:8}}>📋</div>
              No templates saved yet.
              <div style={{fontSize:11,marginTop:4}}>Save any itinerary as a template from the Edit view.</div>
            </div>
          ):templates.map(t=>(
            <div key={t.id} style={{background:C.grey100,borderRadius:8,padding:"12px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:F.heading,fontSize:13,fontWeight:700,color:C.navy}}>{t.name}</div>
                <div style={{fontFamily:F.body,fontSize:11,color:C.grey400,marginTop:2}}>
                  {t.days?.length||0} days · {t.savedAt?new Date(t.savedAt).toLocaleDateString("en-AU"):""}
                </div>
                {t.description&&<div style={{fontFamily:F.body,fontSize:11,color:C.grey600,marginTop:3,fontStyle:"italic"}}>{t.description}</div>}
              </div>
              <div style={{display:"flex",gap:5,flexShrink:0}}>
                <button onClick={()=>onLoad(t)} style={{fontFamily:F.body,fontSize:11,fontWeight:600,color:C.white,background:C.terra,border:"none",borderRadius:5,padding:"5px 12px"}}>Use</button>
                <button onClick={()=>onDelete(t.id)} style={{fontFamily:F.body,fontSize:11,color:C.terra,background:"transparent",border:`1px solid ${C.terra}30`,borderRadius:5,padding:"5px 10px"}}>Del</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Save as template modal ───────────────────────────────────────────────────
function SaveTemplateModal({itinerary,onSave,onClose}){
  const[name,setName]=useState(itinerary.title||"");
  const[desc,setDesc]=useState("");
  return(
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(25,41,87,0.6)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:C.white,borderRadius:12,width:420,padding:24,boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <div style={{fontFamily:F.heading,fontSize:15,fontWeight:700,color:C.navy,marginBottom:14}}>Save as Template</div>
        <div style={{marginBottom:10}}>
          <label style={{fontFamily:F.body,fontSize:10,fontWeight:700,color:C.grey400,letterSpacing:"0.08em",textTransform:"uppercase",display:"block",marginBottom:3}}>Template name</label>
          <input value={name} onChange={e=>setName(e.target.value)} style={{width:"100%",fontFamily:F.body,fontSize:13,color:C.text,border:`1px solid ${C.grey200}`,borderRadius:5,padding:"6px 10px",outline:"none"}} placeholder="e.g. 2 Night Warrawindi Package"/>
        </div>
        <div style={{marginBottom:16}}>
          <label style={{fontFamily:F.body,fontSize:10,fontWeight:700,color:C.grey400,letterSpacing:"0.08em",textTransform:"uppercase",display:"block",marginBottom:3}}>Description (optional)</label>
          <textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={2} style={{width:"100%",fontFamily:F.body,fontSize:12,color:C.text,border:`1px solid ${C.grey200}`,borderRadius:5,padding:"6px 10px",outline:"none",resize:"vertical"}} placeholder="Brief description of what this template covers"/>
        </div>
        <div style={{fontFamily:F.body,fontSize:11,color:C.grey400,marginBottom:16,background:C.grey100,padding:"8px 12px",borderRadius:6}}>
          Saves the day structure, products, intro, host bio, T&amp;C and Before You Arrive sections. Client name, dates and guest info are not saved.
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>{if(name.trim())onSave(name.trim(),desc.trim());}} style={{flex:1,fontFamily:F.heading,fontSize:11,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:C.white,background:C.terra,border:"none",borderRadius:6,padding:"8px 0"}}>Save Template</button>
          <button onClick={onClose} style={{fontFamily:F.body,fontSize:12,color:C.grey600,background:"transparent",border:`1px solid ${C.grey200}`,borderRadius:6,padding:"8px 16px"}}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Custom product form ──────────────────────────────────────────────────────
function ProductForm({initial,onSave,onCancel}){
  const[p,setP]=useState(()=>initial||{id:uid(),custom:true,category:"Day Tours",name:"",subtitle:"",type:"private",duration:"",departures:"",location:"",partner:"",minGuests:2,maxGuests:null,rezdy:"",pricing:{structure:"per_adult",tiers:[{label:"",retail:0}],note:""},tags:[],description:"",inclusions:[]});
  const[incText,setIncText]=useState((initial?.inclusions||[]).join("\n"));
  const[tagText,setTagText]=useState((initial?.tags||[]).join(", "));
  const[tierRows,setTierRows]=useState(()=>{const t=initial?.pricing?.tiers||[];return t.length>0?t:[{label:"",retail:0}];});
  const isTiered=p.pricing.structure==="tiered_per_person_by_group"||p.pricing.structure==="tiered_per_couple_by_group";
  const isSimple=p.pricing.structure==="per_adult"||p.pricing.structure==="per_couple"||p.pricing.structure==="per_night"||p.pricing.structure==="per_night_per_room";
  const isAccom=p.category==="Accommodation";
  function setPricing(patch){setP(x=>({...x,pricing:{...x.pricing,...patch}}));}
  function handleSave(){
    if(!p.name.trim()){alert("Product name is required.");return;}
    const inclusions=incText.split("\n").map(s=>s.trim()).filter(Boolean);
    const tags=tagText.split(",").map(s=>s.trim()).filter(Boolean);
    let tiers=[];
    if(isTiered)tiers=tierRows.filter(r=>r.label).map(r=>({label:r.label,retail:parseFloat(r.retail)||0}));
    if(isSimple){
      const lbl = p.pricing.structure==="per_couple"?"Per couple":p.pricing.structure==="per_night"?"Per night":p.pricing.structure==="per_night_per_room"?"Per room per night":"Per adult";
      tiers=[{label:lbl,retail:parseFloat(tierRows[0]?.retail)||0}];
    }
    onSave({...p,inclusions,tags,pricing:{...p.pricing,tiers}});
  }
  const fi={fontFamily:F.body,fontSize:12,color:C.text,border:`1px solid ${C.grey200}`,borderRadius:5,padding:"5px 8px",outline:"none",background:C.white,width:"100%"};
  const L={fontFamily:F.body,fontSize:10,fontWeight:700,color:C.grey400,letterSpacing:"0.08em",textTransform:"uppercase",display:"block",marginBottom:3};
  const W={marginBottom:10};
  return(
    <div style={{background:C.white,border:`2px solid ${C.teal}`,borderRadius:10,padding:14,marginBottom:12}}>
      <div style={{fontFamily:F.heading,fontSize:13,fontWeight:700,color:C.navy,marginBottom:12}}>{initial?"Edit Product":"New Custom Product"}</div>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <div style={{flex:2,...W}}><label style={L}>Product name *</label><input style={fi} value={p.name} onChange={e=>setP(x=>({...x,name:e.target.value}))} placeholder="Product name"/></div>
        <div style={{flex:1,...W}}><label style={L}>Category</label><select style={fi} value={p.category} onChange={e=>setP(x=>({...x,category:e.target.value}))}>{["Day Tours","Stay & Tour Packages","Transfers & Journeys","Experience Components","Accommodation","Custom"].map(c=><option key={c}>{c}</option>)}</select></div>
      </div>
      <div style={W}><label style={L}>Subtitle</label><input style={fi} value={p.subtitle||""} onChange={e=>setP(x=>({...x,subtitle:e.target.value}))} placeholder={isAccom?"e.g. 2 bedroom retreat · Sleeps 4 · Penola":"e.g. Full day private tour · Min 2 / Max 4"}/></div>

      {/* Accommodation fields */}
      {isAccom?(
        <>
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            <div style={{flex:1,...W}}><label style={L}>Location</label><input style={fi} value={p.location||""} onChange={e=>setP(x=>({...x,location:e.target.value}))} placeholder="e.g. Penola · Limestone Coast"/></div>
            <div style={{flex:1,...W}}><label style={L}>Property / partner</label><input style={fi} value={p.partner||""} onChange={e=>setP(x=>({...x,partner:e.target.value}))} placeholder="e.g. Warrawindi Escapes"/></div>
          </div>
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            <div style={{flex:1,...W}}><label style={L}>Bedrooms</label><input style={fi} value={p.bedrooms||""} onChange={e=>setP(x=>({...x,bedrooms:e.target.value}))} placeholder="e.g. 2"/></div>
            <div style={{flex:1,...W}}><label style={L}>Sleeps</label><input style={fi} value={p.sleeps||""} onChange={e=>setP(x=>({...x,sleeps:e.target.value}))} placeholder="e.g. 4"/></div>
            <div style={{flex:1,...W}}><label style={L}>Min nights</label><input style={fi} type="number" value={p.minNights||""} onChange={e=>setP(x=>({...x,minNights:parseInt(e.target.value)||null}))} placeholder="2"/></div>
          </div>
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            <div style={{flex:1,...W}}><label style={L}>Check-in</label><input style={fi} value={p.checkIn||""} onChange={e=>setP(x=>({...x,checkIn:e.target.value}))} placeholder="e.g. 3:00 PM"/></div>
            <div style={{flex:1,...W}}><label style={L}>Check-out</label><input style={fi} value={p.checkOut||""} onChange={e=>setP(x=>({...x,checkOut:e.target.value}))} placeholder="e.g. 10:00 AM"/></div>
            <div style={{flex:1,...W}}><label style={L}>Rezdy code</label><input style={fi} value={p.rezdy||""} onChange={e=>setP(x=>({...x,rezdy:e.target.value}))} placeholder="Internal only"/></div>
          </div>
        </>
      ):(
        /* Touring fields */
        <>
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            <div style={{flex:1,...W}}><label style={L}>Type</label><select style={fi} value={p.type} onChange={e=>setP(x=>({...x,type:e.target.value}))}><option value="private">Private</option><option value="small_group">Small Group</option><option value="component">Component</option></select></div>
            <div style={{flex:1,...W}}><label style={L}>Duration</label><input style={fi} value={p.duration||""} onChange={e=>setP(x=>({...x,duration:e.target.value}))} placeholder="e.g. 6 hrs"/></div>
            <div style={{flex:1,...W}}><label style={L}>Departures</label><input style={fi} value={p.departures||""} onChange={e=>setP(x=>({...x,departures:e.target.value}))} placeholder="e.g. Daily"/></div>
          </div>
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            <div style={{flex:1,...W}}><label style={L}>Location</label><input style={fi} value={p.location||""} onChange={e=>setP(x=>({...x,location:e.target.value}))} placeholder="e.g. Coonawarra · Penola"/></div>
            <div style={{flex:1,...W}}><label style={L}>Partner</label><input style={fi} value={p.partner||""} onChange={e=>setP(x=>({...x,partner:e.target.value}))} placeholder="Optional"/></div>
            <div style={{flex:1,...W}}><label style={L}>Rezdy code</label><input style={fi} value={p.rezdy||""} onChange={e=>setP(x=>({...x,rezdy:e.target.value}))} placeholder="Internal only"/></div>
          </div>
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            <div style={{flex:1,...W}}><label style={L}>Min guests</label><input style={fi} type="number" value={p.minGuests||""} onChange={e=>setP(x=>({...x,minGuests:parseInt(e.target.value)||null}))} placeholder="2"/></div>
            <div style={{flex:1,...W}}><label style={L}>Max guests</label><input style={fi} type="number" value={p.maxGuests||""} onChange={e=>setP(x=>({...x,maxGuests:parseInt(e.target.value)||null}))} placeholder="10"/></div>
          </div>
        </>
      )}
      <div style={{borderTop:`1px solid ${C.grey100}`,paddingTop:10,marginBottom:10}}>
        <label style={L}>Pricing structure</label>
        <select style={{...fi,marginBottom:8}} value={p.pricing.structure} onChange={e=>setPricing({structure:e.target.value,tiers:[{label:"",retail:0}]})}>
          {PRICE_STRUCTURES.map(ps=><option key={ps.value} value={ps.value}>{ps.label}</option>)}
        </select>
        {isSimple&&<div style={{display:"flex",gap:8}}><div style={{flex:1}}><label style={L}>Price (AUD)</label><input style={fi} type="number" value={tierRows[0]?.retail||""} onChange={e=>setTierRows([{label:"",retail:e.target.value}])} placeholder="0.00"/></div><div style={{flex:2}}><label style={L}>Price note</label><input style={fi} value={p.pricing.note||""} onChange={e=>setPricing({note:e.target.value})} placeholder="e.g. On request"/></div></div>}
        {isTiered&&<div><label style={L}>Tiers</label>{tierRows.map((row,i)=><div key={i} style={{display:"flex",gap:6,marginBottom:5,alignItems:"center"}}><input style={{...fi,flex:2}} value={row.label} onChange={e=>setTierRows(r=>r.map((x,j)=>j===i?{...x,label:e.target.value}:x))} placeholder="e.g. 2 guests"/><input style={{...fi,flex:1}} type="number" value={row.retail} onChange={e=>setTierRows(r=>r.map((x,j)=>j===i?{...x,retail:e.target.value}:x))} placeholder="Price"/>{tierRows.length>1&&<button onClick={()=>setTierRows(r=>r.filter((_,j)=>j!==i))} style={{color:C.terra,background:"transparent",border:"none",fontSize:16,fontWeight:700,padding:"0 4px"}}>×</button>}</div>)}<button onClick={()=>setTierRows(r=>[...r,{label:"",retail:0}])} style={{fontFamily:F.body,fontSize:11,color:C.teal,background:"transparent",border:`1px solid ${C.teal}40`,borderRadius:5,padding:"3px 10px"}}>+ Add tier</button><div style={{marginTop:6}}><label style={L}>Pricing note</label><input style={fi} value={p.pricing.note||""} onChange={e=>setPricing({note:e.target.value})} placeholder="e.g. Per person, priced by group size"/></div></div>}
        {(p.pricing.structure==="on_request"||p.pricing.structure==="component")&&<div style={W}><label style={L}>Note</label><input style={fi} value={p.pricing.note||""} onChange={e=>setPricing({note:e.target.value})} placeholder="e.g. Price on request"/></div>}
      </div>
      <div style={W}><label style={L}>Description</label><textarea style={{...fi,resize:"vertical",minHeight:70,padding:"6px 8px"}} value={p.description||""} onChange={e=>setP(x=>({...x,description:e.target.value}))} placeholder="Description as it appears in the itinerary..."/></div>
      <div style={W}><label style={L}>Inclusions (one per line)</label><textarea style={{...fi,resize:"vertical",minHeight:70,padding:"6px 8px"}} value={incText} onChange={e=>setIncText(e.target.value)} placeholder={"Premium transport, driven by your hosts\nAll tasting fees included"}/></div>
      <div style={W}><label style={L}>Tags (comma separated)</label><input style={fi} value={tagText} onChange={e=>setTagText(e.target.value)} placeholder="Wine, Cellar Door, Private"/></div>
      <div style={{display:"flex",gap:8,marginTop:4}}>
        <button onClick={handleSave} style={{flex:1,fontFamily:F.heading,fontSize:11,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:C.white,background:C.terra,border:"none",borderRadius:6,padding:"8px 0"}}>{initial?"Save Changes":"Create Product"}</button>
        <button onClick={onCancel} style={{fontFamily:F.body,fontSize:12,color:C.grey600,background:"transparent",border:`1px solid ${C.grey200}`,borderRadius:6,padding:"8px 16px"}}>Cancel</button>
      </div>
    </div>
  );
}

// ─── Bulk image uploader ──────────────────────────────────────────────────────
function BulkImageUploader({allProducts,productImages,onImagesChange}){
  const[open,setOpen]=useState(false);
  const[uploading,setUploading]=useState(null); // product name being uploaded
  const[done,setDone]=useState([]);
  const inputRef=useRef();
  const[targetProduct,setTargetProduct]=useState(null);

  async function handleFiles(files,productId){
    const p=allProducts.find(x=>x.id===productId);
    setUploading(p?.name||"product");
    try{
      const urls=await Promise.all(Array.from(files).filter(f=>f.type.startsWith("image/")).map(f=>uploadToCloudinary(f)));
      onImagesChange(productId,[...(productImages[productId]||[]),...urls]);
      setDone(d=>[...d,productId]);
    }catch(e){alert(`Upload failed for ${p?.name}`);}
    finally{setUploading(null);setTargetProduct(null);}
  }

  if(!open)return(
    <button onClick={()=>setOpen(true)} style={{fontFamily:F.body,fontSize:10,color:C.grey600,background:C.grey100,border:`1px solid ${C.grey200}`,borderRadius:5,padding:"3px 10px"}} title="Bulk image upload">📷 Images</button>
  );

  return(
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(25,41,87,0.6)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setOpen(false)}>
      <div style={{background:C.white,borderRadius:12,width:600,maxHeight:"80vh",overflow:"hidden",display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}>
        <div style={{background:C.navy,padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontFamily:F.heading,fontSize:14,fontWeight:700,color:C.white}}>Bulk Image Upload</div>
          <button onClick={()=>setOpen(false)} style={{color:"rgba(255,255,255,0.6)",background:"transparent",border:"none",fontSize:18,lineHeight:1}}>×</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:14}}>
          {uploading&&<div style={{fontFamily:F.body,fontSize:12,color:C.teal,marginBottom:10,textAlign:"center"}}>⏳ Uploading to {uploading}...</div>}
          {allProducts.filter(p=>p.category!=="Experience Components").map(p=>{
            const imgs=productImages[p.id]||[];
            const isDone=done.includes(p.id);
            return(
              <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",background:isDone?`${C.teal}10`:C.grey100,borderRadius:7,marginBottom:5,border:`1px solid ${isDone?C.teal:C.grey200}`}}>
                {imgs[0]?<img src={imgs[0]} alt="" style={{width:40,height:32,objectFit:"cover",borderRadius:4,flexShrink:0}} crossOrigin="anonymous"/>:<div style={{width:40,height:32,background:C.grey200,borderRadius:4,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>📷</div>}
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:F.body,fontSize:12,fontWeight:600,color:C.navy,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
                  <div style={{fontFamily:F.body,fontSize:10,color:C.grey400}}>{imgs.length} image{imgs.length!==1?"s":""} · {p.category}</div>
                </div>
                <div style={{display:"flex",gap:5,flexShrink:0}}>
                  {isDone&&<span style={{fontFamily:F.body,fontSize:10,color:C.teal,fontWeight:600}}>✓ Done</span>}
                  <button onClick={()=>{setTargetProduct(p.id);inputRef.current.click();}} disabled={!!uploading} style={{fontFamily:F.body,fontSize:10,fontWeight:600,color:C.white,background:C.terra,border:"none",borderRadius:5,padding:"3px 10px",opacity:uploading?0.5:1}}>
                    {imgs.length>0?"Add":"Upload"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <input ref={inputRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>{if(targetProduct)handleFiles(e.target.files,targetProduct);}}/>
        <div style={{padding:"10px 14px",borderTop:`1px solid ${C.grey200}`,fontFamily:F.body,fontSize:11,color:C.grey400,textAlign:"center"}}>Click Upload next to any product to add images · Images go to Cloudinary</div>
      </div>
    </div>
  );
}

// ─── Library card ─────────────────────────────────────────────────────────────
function LibraryCard({product:p,images,onImagesChange,onAdd,showInternal,onEdit,onDelete,onDuplicate}){
  const[open,setOpen]=useState(false);
  const[imgOpen,setImgOpen]=useState(false);
  const isTiered=["tiered_per_person_by_group","tiered_per_couple_by_group"].includes(p.pricing.structure);
  const heroImg=images?.[0];
  return(
    <div style={{background:C.white,border:`1px solid ${p.custom?C.teal:C.grey200}`,borderRadius:8,overflow:"hidden",marginBottom:8}}>
      {heroImg&&<img src={heroImg} alt={p.name} style={{width:"100%",height:80,objectFit:"cover",display:"block"}} crossOrigin="anonymous"/>}
      <div style={{background:heroImg?"transparent":C.navy,padding:"8px 12px"}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:4}}>
          <div>
            <div style={{fontFamily:F.body,fontSize:9,color:heroImg?C.grey400:C.sand,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:2}}>{p.category}{p.custom?" · Custom":""}</div>
            <div style={{fontFamily:F.heading,fontSize:13,fontWeight:700,color:heroImg?C.navy:C.white,lineHeight:1.2}}>{p.name||"Untitled"}</div>
          </div>
          {p.custom&&<div style={{display:"flex",gap:3,flexShrink:0}}><button onClick={onEdit} style={{fontFamily:F.body,fontSize:9,color:C.teal,background:`${C.teal}18`,border:`1px solid ${C.teal}30`,borderRadius:4,padding:"1px 6px"}}>Edit</button><button onClick={onDuplicate} style={{fontFamily:F.body,fontSize:9,color:C.navy,background:`${C.navy}12`,border:`1px solid ${C.navy}30`,borderRadius:4,padding:"1px 6px"}}>Copy</button><button onClick={onDelete} style={{fontFamily:F.body,fontSize:9,color:C.terra,background:`${C.terra}18`,border:`1px solid ${C.terra}30`,borderRadius:4,padding:"1px 6px"}}>Del</button></div>}
        </div>
      </div>
      <div style={{padding:"8px 12px"}}>
        <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:6}}>
          {p.category==="Accommodation"?(
            <>
              {p.bedrooms&&<Badge xs>{p.bedrooms} bed</Badge>}
              {p.sleeps&&<Badge xs>Sleeps {p.sleeps}</Badge>}
              {p.minNights&&<Badge xs>Min {p.minNights} nights</Badge>}
            </>
          ):(
            <>
              <Badge color={typeColor(p.type)} xs>{p.type==="small_group"?"Small Group":p.type==="component"?"Component":"Private"}</Badge>
              {p.duration&&<Badge xs>{p.duration}</Badge>}
              {p.departures&&<Badge xs>{p.departures}</Badge>}
            </>
          )}
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
              {!imgOpen&&(images?.length>0?<div style={{fontFamily:F.body,fontSize:10,color:C.grey400}}>{images.length} image{images.length!==1?"s":""} on Cloudinary</div>:<div style={{fontFamily:F.body,fontSize:10,color:C.grey200}}>No images yet</div>)}
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
  const[editNote,setEditNote]=useState(false);
  const[noteVal,setNoteVal]=useState(item.notes||"");
  if(!p)return null;
  return(
    <div style={{background:C.white,border:`1px solid ${C.grey200}`,borderRadius:6,marginBottom:6,overflow:"hidden"}}>
      {heroImg&&<img src={heroImg} alt={p.name} style={{width:"100%",height:50,objectFit:"cover",display:"block"}} crossOrigin="anonymous"/>}
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
function DayCard({day,dayIndex,totalDays,productImages,allProducts,showPricing,onUpdate,onRemoveItem,onMoveItem,onNoteChange,onRemove,onDuplicate,onMoveDay,isFirstDay,isLastDay}){
  const w=day.date?WEATHER[new Date(day.date).getMonth()+1]:null;
  return(
    <div style={{background:C.white,border:`1px solid ${C.grey200}`,borderRadius:10,overflow:"hidden",marginBottom:14}}>
      <div style={{background:C.sandLight,borderBottom:`1px solid ${C.grey200}`,padding:"8px 12px",display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontFamily:F.body,fontSize:10,fontWeight:700,color:C.terra,letterSpacing:"0.1em",textTransform:"uppercase",flexShrink:0}}>DAY {dayIndex+1}</span>
        <input value={day.title} onChange={e=>onUpdate({...day,title:e.target.value})} style={{flex:1,fontFamily:F.heading,fontSize:14,fontWeight:700,color:C.navy,background:"transparent",border:"none",outline:"none"}} placeholder={`Day ${dayIndex+1}`}/>
        <input value={day.location||""} onChange={e=>onUpdate({...day,location:e.target.value})} style={{fontFamily:F.body,fontSize:11,color:C.grey600,background:"transparent",border:"none",outline:"none",width:150}} placeholder="Location..."/>
        <input type="date" value={day.date} onChange={e=>onUpdate({...day,date:e.target.value})} style={{fontFamily:F.body,fontSize:11,color:C.grey600,background:"transparent",border:"none",outline:"none",width:130}}/>
        {w&&<div style={{display:"flex",alignItems:"center",gap:4,background:C.white,border:`1px solid ${C.grey200}`,borderRadius:5,padding:"2px 7px",flexShrink:0}}><span style={{fontSize:13}}>{w.icon}</span><div><div style={{fontFamily:F.body,fontSize:9,fontWeight:600,color:C.navy}}>{w.temp}</div><div style={{fontFamily:F.body,fontSize:9,color:C.grey400}}>Rain: {w.rain}</div></div></div>}
        {!isFirstDay&&<button onClick={()=>onMoveDay(-1)} title="Move day up" style={{fontFamily:F.body,fontSize:11,fontWeight:700,color:C.navy,background:"transparent",border:`1px solid ${C.grey200}`,borderRadius:4,padding:"1px 7px",flexShrink:0}}>↑</button>}
        {!isLastDay&&<button onClick={()=>onMoveDay(1)} title="Move day down" style={{fontFamily:F.body,fontSize:11,fontWeight:700,color:C.navy,background:"transparent",border:`1px solid ${C.grey200}`,borderRadius:4,padding:"1px 7px",flexShrink:0}}>↓</button>}
        <button onClick={onDuplicate} title="Duplicate this day" style={{fontFamily:F.body,fontSize:10,color:C.teal,background:"transparent",border:`1px solid ${C.teal}30`,borderRadius:4,padding:"2px 8px",flexShrink:0}}>Copy</button>
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
        <textarea value={day.dayNotes} onChange={e=>onUpdate({...day,dayNotes:e.target.value})} placeholder="Day overview notes (appears in itinerary)..." style={{width:"100%",fontFamily:F.body,fontSize:11,color:C.text,border:`1px solid ${C.grey200}`,borderRadius:6,padding:"6px 10px",resize:"vertical",minHeight:36,outline:"none",marginTop:4}}/>
        <textarea value={day.internalNotes||""} onChange={e=>onUpdate({...day,internalNotes:e.target.value})} placeholder="Internal notes — operational reminders, supplier contacts (never shown to client)..." style={{width:"100%",fontFamily:F.body,fontSize:11,color:C.terra,border:`1px solid ${C.terra}30`,borderRadius:6,padding:"6px 10px",resize:"vertical",minHeight:32,outline:"none",marginTop:4,background:"#fff8f6"}}/>
      </div>
    </div>
  );
}

// ─── Preview ──────────────────────────────────────────────────────────────────
function Preview({itinerary,productImages,showInternal,allProducts,currency,fxRates}){
  const isTrade=itinerary.tradeMode||false;
  const comm=itinerary.commission||20;
  const highlights=buildHighlights(itinerary,allProducts);
  const showPrice=itinerary.showPricing;
  return(
    <div style={{fontFamily:F.body,color:C.text,maxWidth:860,margin:"0 auto"}}>
      {/* Cover — trade and guest have separate layouts */}
      {isTrade?(
        /* ── TRADE COVER ── */
        <div style={{background:C.navy,borderRadius:10,marginBottom:16,position:"relative",overflow:"hidden"}}>
          {itinerary.coverImage&&<img src={itinerary.coverImage} alt="" style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center",opacity:0.12,display:"block"}} crossOrigin="anonymous"/>}
          <div style={{position:"relative",padding:"28px 32px"}}>
            {/* CE logo + agent logo row */}
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:16}}>
              <img src={LOGO_URL} alt="Coonawarra Experiences" style={{height:80,width:"auto",display:"block"}} crossOrigin="anonymous"/>
              {itinerary.agentLogo&&(
                <div style={{background:"rgba(255,255,255,0.95)",borderRadius:8,padding:"8px 12px",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <img src={itinerary.agentLogo} alt={itinerary.agentName||"Agent"} style={{maxHeight:50,maxWidth:140,objectFit:"contain",display:"block"}} crossOrigin="anonymous"/>
                </div>
              )}
            </div>
            {/* Confidential notice */}
            <div style={{background:"rgba(211,71,39,0.15)",border:"1px solid rgba(211,71,39,0.4)",borderRadius:5,padding:"4px 12px",marginBottom:14,display:"inline-block"}}>
              <span style={{fontFamily:F.body,fontSize:9,fontWeight:700,color:C.terra,letterSpacing:"0.1em",textTransform:"uppercase"}}>Confidential · Trade rate sheet · Not for distribution to end guests</span>
            </div>
            {/* Title */}
            <div style={{fontFamily:F.heading,fontSize:26,fontWeight:700,color:C.white,lineHeight:1.1,marginBottom:8}}>{itinerary.title||"Private Itinerary"}</div>
            {/* Agent details */}
            {itinerary.agentName&&<div style={{fontFamily:F.serif,fontSize:13,fontStyle:"italic",color:C.sand,marginBottom:2}}>Prepared for {itinerary.agentName}{itinerary.clientName?` · Guest: ${itinerary.clientName}`:""}</div>}
            {itinerary.agentRef&&<div style={{fontFamily:F.body,fontSize:11,color:"rgba(255,255,255,0.45)",marginBottom:14}}>Agent ref: {itinerary.agentRef}</div>}
            {!itinerary.agentName&&itinerary.clientName&&<div style={{fontFamily:F.serif,fontSize:13,fontStyle:"italic",color:C.sand,marginBottom:14}}>Guest: {itinerary.clientName}</div>}
            {/* Journey details */}
            <div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:14}}>
              {itinerary.arrivalDate&&<div style={{fontFamily:F.body,fontSize:11,color:"rgba(255,255,255,0.7)"}}><span style={{color:C.sand,fontWeight:600}}>Arrival</span> · {fmtDate(itinerary.arrivalDate)}</div>}
              {itinerary.departureDate&&<div style={{fontFamily:F.body,fontSize:11,color:"rgba(255,255,255,0.7)"}}><span style={{color:C.sand,fontWeight:600}}>Departure</span> · {fmtDate(itinerary.departureDate)}</div>}
              {itinerary.guestCount&&<div style={{fontFamily:F.body,fontSize:11,color:"rgba(255,255,255,0.7)"}}><span style={{color:C.sand,fontWeight:600}}>Guests</span> · {itinerary.guestCount}</div>}
              <div style={{fontFamily:F.body,fontSize:11,color:"rgba(255,255,255,0.7)"}}><span style={{color:C.sand,fontWeight:600}}>Duration</span> · {itinerary.days.length} {itinerary.days.length===1?"day":"days"}</div>
              {itinerary.origin&&<div style={{fontFamily:F.body,fontSize:11,color:"rgba(255,255,255,0.7)"}}><span style={{color:C.sand,fontWeight:600}}>Origin</span> · {itinerary.origin}</div>}
            </div>
            {/* Commission + Book by boxes */}
            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}>
              <div style={{background:"rgba(211,71,39,0.2)",border:"1px solid rgba(211,71,39,0.4)",borderRadius:6,padding:"8px 16px"}}>
                <div style={{fontFamily:F.body,fontSize:9,color:C.terra,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:2}}>Commission</div>
                <div style={{fontFamily:F.heading,fontSize:18,fontWeight:700,color:C.white}}>{comm}%</div>
              </div>
              {itinerary.totalPrice&&<div style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:6,padding:"8px 16px"}}>
                <div style={{fontFamily:F.body,fontSize:9,color:C.sand,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:2}}>Total (net rates)</div>
                <div style={{fontFamily:F.heading,fontSize:18,fontWeight:700,color:C.white}}>{itinerary.totalPrice}</div>
              </div>}
              {itinerary.bookByDate&&<div style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:6,padding:"8px 16px"}}>
                <div style={{fontFamily:F.body,fontSize:9,color:C.sand,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:2}}>Book by</div>
                <div style={{fontFamily:F.heading,fontSize:14,fontWeight:700,color:C.white}}>{fmtDate(itinerary.bookByDate)}</div>
              </div>}
              {itinerary.expiryDate&&<div style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:6,padding:"8px 16px"}}>
                <div style={{fontFamily:F.body,fontSize:9,color:C.sand,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:2}}>Quote valid until</div>
                <div style={{fontFamily:F.heading,fontSize:14,fontWeight:700,color:C.terra}}>{fmtDate(itinerary.expiryDate)}</div>
              </div>}
            </div>
            {/* Footer refs */}
            <div style={{paddingTop:12,borderTop:"1px solid rgba(255,255,255,0.1)",display:"flex",gap:14,flexWrap:"wrap"}}>
              <div style={{fontFamily:F.body,fontSize:9,color:"rgba(255,255,255,0.3)"}}>Valid 1 April 2027 – 31 March 2028 · AUD incl. 10% GST</div>
              {itinerary.ceRef&&<div style={{fontFamily:F.body,fontSize:9,color:"rgba(255,255,255,0.4)"}}><span style={{color:C.sand}}>CE Ref</span> {itinerary.ceRef}</div>}
              {itinerary.rezdyRef&&<div style={{fontFamily:F.body,fontSize:9,color:"rgba(255,255,255,0.4)"}}><span style={{color:C.sand}}>Rezdy</span> {itinerary.rezdyRef}</div>}
              {itinerary.agentRef&&<div style={{fontFamily:F.body,fontSize:9,color:"rgba(255,255,255,0.4)"}}><span style={{color:C.sand}}>Agent ref</span> {itinerary.agentRef}</div>}
            </div>
          </div>
        </div>
      ):(
        /* ── GUEST COVER — full page ── */
        <div className="cover-page no-print-border" style={{background:C.navy,position:"relative",overflow:"hidden",minHeight:480,display:"flex",flexDirection:"column",justifyContent:"space-between",borderRadius:10,marginBottom:20}}>
          {/* Hero image — full bleed */}
          {itinerary.coverImage&&<img src={itinerary.coverImage} alt="" style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center",display:"block"}} crossOrigin="anonymous"/>}
          {/* Dark overlay so text is always readable */}
          <div style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",background:itinerary.coverImage?"linear-gradient(to bottom, rgba(25,41,87,0.55) 0%, rgba(25,41,87,0.3) 40%, rgba(25,41,87,0.85) 100%)":"rgba(25,41,87,1)"}}/>
          {/* Teal accent circle — only when no hero image */}
          {!itinerary.coverImage&&<div style={{position:"absolute",top:0,right:0,width:200,height:200,background:C.teal,opacity:0.08,borderRadius:"0 0 0 100%"}}/>}
          {/* Content */}
          <div style={{position:"relative",padding:"32px 36px",flex:1,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
            {/* Top — logo */}
            <div>
              <img src={LOGO_URL} alt="Coonawarra Experiences" style={{height:80,width:"auto",display:"block",marginBottom:0}} crossOrigin="anonymous"/>
            </div>
            {/* Middle — title and welcome */}
            <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",paddingTop:32,paddingBottom:24}}>
              <div style={{fontFamily:F.heading,fontSize:36,fontWeight:700,color:C.white,lineHeight:1.05,marginBottom:12,textShadow:itinerary.coverImage?"0 2px 8px rgba(0,0,0,0.4)":"none"}}>{itinerary.title||"Private Itinerary"}</div>
              {itinerary.clientName&&<div style={{fontFamily:F.serif,fontSize:16,fontStyle:"italic",color:C.sand,marginBottom:16,textShadow:itinerary.coverImage?"0 1px 4px rgba(0,0,0,0.4)":"none"}}>Prepared for {itinerary.clientName}</div>}
              {itinerary.welcomeMessage&&<div style={{fontFamily:F.serif,fontSize:14,fontStyle:"italic",color:"rgba(255,255,255,0.85)",lineHeight:1.7,maxWidth:520,textShadow:itinerary.coverImage?"0 1px 4px rgba(0,0,0,0.4)":"none",whiteSpace:"pre-wrap"}}>{itinerary.welcomeMessage}</div>}
            </div>
            {/* Bottom — details, price, highlights */}
            <div>
              {/* Key details row */}
              <div style={{display:"flex",gap:18,flexWrap:"wrap",marginBottom:14}}>
                {itinerary.arrivalDate&&<div style={{fontFamily:F.body,fontSize:12,color:"rgba(255,255,255,0.75)"}}><span style={{color:C.sand,fontWeight:600}}>Arrival</span> · {fmtDate(itinerary.arrivalDate)}</div>}
                {itinerary.departureDate&&<div style={{fontFamily:F.body,fontSize:12,color:"rgba(255,255,255,0.75)"}}><span style={{color:C.sand,fontWeight:600}}>Departure</span> · {fmtDate(itinerary.departureDate)}</div>}
                {itinerary.guestCount&&<div style={{fontFamily:F.body,fontSize:12,color:"rgba(255,255,255,0.75)"}}><span style={{color:C.sand,fontWeight:600}}>Guests</span> · {itinerary.guestCount}</div>}
                <div style={{fontFamily:F.body,fontSize:12,color:"rgba(255,255,255,0.75)"}}><span style={{color:C.sand,fontWeight:600}}>Duration</span> · {itinerary.days.length} {itinerary.days.length===1?"day":"days"}</div>
                {itinerary.origin&&<div style={{fontFamily:F.body,fontSize:12,color:"rgba(255,255,255,0.75)"}}><span style={{color:C.sand,fontWeight:600}}>Origin</span> · {itinerary.origin}</div>}
              </div>
              {/* Total price */}
              {itinerary.totalPrice&&(
                <div style={{display:"inline-block",background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.25)",borderRadius:8,padding:"8px 18px",marginBottom:16}}>
                  <div style={{fontFamily:F.body,fontSize:9,color:C.sand,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:2}}>Total investment</div>
                  <div style={{fontFamily:F.heading,fontSize:22,fontWeight:700,color:C.white}}>{itinerary.totalPrice}</div>
                  {currency&&currency!=="AUD"&&(()=>{
                    const num=parseFloat((itinerary.totalPrice||"").replace(/[^0-9.]/g,""));
                    if(!num||!fxRates)return null;
                    const rate=fxRates[currency];
                    const symbols={NZD:"NZ$",GBP:"£",USD:"US$",SGD:"S$",EUR:"€"};
                    if(!rate)return null;
                    return<div style={{fontFamily:F.body,fontSize:11,color:C.sand,marginTop:1}}>approx. {symbols[currency]}{Math.round(num*rate).toLocaleString()} {currency}</div>;
                  })()}
                </div>
              )}
              {/* Highlights strip */}
              {highlights.length>0&&(
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
                  {highlights.map((h,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:5,background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:6,padding:"4px 10px"}}>
                      <span style={{fontSize:13}}>{h.icon}</span>
                      <span style={{fontFamily:F.body,fontSize:11,color:"rgba(255,255,255,0.85)"}}>{h.label}</span>
                    </div>
                  ))}
                </div>
              )}
              {/* Footer bar */}
              <div style={{paddingTop:12,borderTop:"1px solid rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                <div style={{fontFamily:F.body,fontSize:9,color:"rgba(255,255,255,0.3)"}}>Valid 1 April 2027 – 31 March 2028 · AUD incl. 10% GST</div>
                <div style={{display:"flex",gap:12}}>
                  {itinerary.expiryDate&&<div style={{fontFamily:F.body,fontSize:9,color:C.terra,fontWeight:600}}>Quote valid until {fmtDate(itinerary.expiryDate)}</div>}
                  {itinerary.ceRef&&<div style={{fontFamily:F.body,fontSize:9,color:"rgba(255,255,255,0.4)"}}><span style={{color:C.sand}}>Ref</span> {itinerary.ceRef}</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Intro */}
      {itinerary.intro&&(
        <div style={{background:C.white,border:`1px solid ${C.grey200}`,borderRadius:10,padding:"18px 22px",marginBottom:16,borderLeft:`4px solid ${C.teal}`}}>
          <div style={{fontFamily:F.body,fontSize:9,fontWeight:700,color:C.teal,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>{isTrade?"Product overview":"About this journey"}</div>
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
          <div key={day.id} className={di>0&&!itinerary.printFlow?"print-break":""} style={{marginBottom:20}}>
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
              if(!p)return null;
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
                      {showPrice&&(
                        <div style={{textAlign:"right",flexShrink:0}}>
                          {isTrade?(()=>{
                            const n=netPrice(p.pricing,comm);
                            if(!n)return<div style={{fontFamily:F.heading,fontSize:12,color:C.terra}}>POA</div>;
                            if(n.tiered)return(
                              <div>
                                {n.tiered.map((t,i)=>(
                                  <div key={i} style={{marginBottom:3}}>
                                    <div style={{fontFamily:F.body,fontSize:10,color:C.grey400}}>{t.label}</div>
                                    <div style={{display:"flex",gap:8,alignItems:"baseline"}}>
                                      <span style={{fontFamily:F.heading,fontSize:13,fontWeight:700,color:C.terra}}>${t.net.toLocaleString()}</span>
                                      <span style={{fontFamily:F.body,fontSize:9,color:C.grey400}}>net · RRP ${t.retail.toLocaleString()}</span>
                                    </div>
                                  </div>
                                ))}
                                <div style={{fontFamily:F.body,fontSize:9,color:C.grey400,marginTop:2}}>{n.label} · {comm}% commission</div>
                              </div>
                            );
                            const grossAmt=(p.pricing.tiers[0]?.retail||0);
                            const commAmt=Math.round(grossAmt*(comm/100));
                            return(
                              <div>
                                <div style={{fontFamily:F.heading,fontSize:14,fontWeight:700,color:C.terra}}>${n.single.toLocaleString()} <span style={{fontSize:10,fontWeight:400,color:C.grey400}}>{n.label}</span></div>
                                <div style={{display:"flex",gap:8,marginTop:3}}>
                                  <div style={{fontFamily:F.body,fontSize:9,color:C.grey400}}>RRP ${grossAmt.toLocaleString()}</div>
                                  <div style={{fontFamily:F.body,fontSize:9,color:C.grey400}}>·</div>
                                  <div style={{fontFamily:F.body,fontSize:9,color:C.grey400}}>Comm ${commAmt.toLocaleString()} ({comm}%)</div>
                                </div>
                              </div>
                            );
                          })():(
                            <><div style={{fontFamily:F.heading,fontSize:13,fontWeight:700,color:C.terra}}>{formatPrice(p.pricing)}</div>{isTiered&&<div style={{fontFamily:F.body,fontSize:10,color:C.grey400}}>{p.pricing.note}</div>}</>
                          )}
                        </div>
                      )}
                    </div>
                    {(p.duration||p.departures)&&(
                      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:8}}>
                        {p.duration&&<span style={{fontFamily:F.body,fontSize:11,color:C.grey400}}>{p.duration}</span>}
                        {p.departures&&<span style={{fontFamily:F.body,fontSize:11,color:C.grey400}}>{p.departures}</span>}
                      </div>
                    )}
                    {p.description&&<p style={{fontFamily:F.body,fontSize:12,color:C.grey600,lineHeight:1.5,marginBottom:8}}>{p.description}</p>}
                    {item.notes&&<div style={{fontFamily:F.body,fontSize:11,fontStyle:"italic",color:C.navy,background:C.sandLight,borderRadius:5,padding:"6px 10px",marginBottom:8}}>Note: {item.notes}</div>}
                    {showPrice&&isTiered&&p.pricing.tiers?.length>0&&<table style={{borderCollapse:"collapse",marginBottom:8}}><tbody>{p.pricing.tiers.map((t,i)=><tr key={i}><td style={{fontFamily:F.body,fontSize:11,color:C.grey600,padding:"1px 12px 1px 0"}}>{t.label}</td><td style={{fontFamily:F.heading,fontSize:12,color:C.terra,fontWeight:700}}>${(t.retail||0).toLocaleString()}</td></tr>)}</tbody></table>}
                    {p.inclusions?.length>0&&itinerary.showInclusions!==false&&(
                      <div>
                        <div style={{fontFamily:F.body,fontSize:9,fontWeight:700,color:C.grey400,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>Included</div>
                        <ul style={{listStyle:"none",padding:0,columns:2,gap:12}}>
                          {p.inclusions.map((inc,i)=><li key={i} style={{fontFamily:F.body,fontSize:11,color:C.grey600,paddingLeft:10,position:"relative",marginBottom:2,breakInside:"avoid"}}><span style={{position:"absolute",left:0,top:5,width:5,height:1,background:C.teal}}/>{inc}</li>)}
                        </ul>
                      </div>
                    )}
                    {showInternal&&p.rezdy&&<div style={{marginTop:6,fontFamily:F.body,fontSize:9,color:C.grey400,background:C.grey100,borderRadius:3,padding:"1px 5px",display:"inline-block"}}>Rezdy: {p.rezdy}</div>}
                    {p.rezdy&&!showInternal&&(
                      <a href={`${REZDY_BASE}${p.rezdy}`} target="_blank" rel="noopener noreferrer"
                        style={{display:"inline-flex",alignItems:"center",gap:4,marginTop:8,fontFamily:F.body,fontSize:11,fontWeight:600,color:C.terra,textDecoration:"none",border:`1px solid ${C.terra}40`,borderRadius:5,padding:"4px 12px"}}>
                        Book this experience →
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
            {day.items.length===0&&<div style={{textAlign:"center",padding:16,color:C.grey400,fontFamily:F.body,fontSize:12,border:`1px dashed ${C.grey200}`,borderRadius:6}}>No experiences added to this day</div>}
          </div>
        );
      })}

      {/* Net rate summary table — trade only */}
      {isTrade&&(()=>{
        const allItems=itinerary.days.flatMap(d=>d.items);
        const seen=new Set();
        const unique=allItems.filter(item=>{if(seen.has(item.productId))return false;seen.add(item.productId);return true;});
        if(!unique.length)return null;
        return(
          <div className="print-break" style={{marginBottom:20}}>
            <div style={{fontFamily:F.heading,fontSize:14,fontWeight:700,color:C.navy,marginBottom:12,paddingBottom:8,borderBottom:`2px solid ${C.sand}`}}>Net Rate Summary · {comm}% Commission</div>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr style={{background:C.navy}}>
                  {["Experience","Gross (AUD)","Commission","Net rate"].map(h=>(
                    <th key={h} style={{fontFamily:F.body,fontSize:10,fontWeight:700,color:C.sand,padding:"8px 12px",textAlign:"left",letterSpacing:"0.06em",textTransform:"uppercase"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {unique.map((item,i)=>{
                  const p=findProduct(allProducts,item.productId);
                  if(!p)return null;
                  const tiers=p.pricing.tiers;
                  const isT=["tiered_per_person_by_group","tiered_per_couple_by_group"].includes(p.pricing.structure);
                  const isOR=p.pricing.structure==="on_request"||p.pricing.structure==="component";
                  return(
                    <tr key={item.id} style={{background:i%2===0?C.white:C.grey100,borderBottom:`1px solid ${C.grey200}`}}>
                      <td style={{fontFamily:F.body,fontSize:12,color:C.navy,fontWeight:600,padding:"8px 12px"}}>{p.name}</td>
                      <td style={{fontFamily:F.body,fontSize:11,color:C.grey600,padding:"8px 12px"}}>
                        {isOR?"On request":isT?tiers.map(t=>`${t.label}: $${t.retail.toLocaleString()}`).join(" / "):`$${(tiers[0]?.retail||0).toLocaleString()} ${p.pricing.structure==="per_couple"?"per couple":"per adult"}`}
                      </td>
                      <td style={{fontFamily:F.body,fontSize:11,color:C.grey600,padding:"8px 12px"}}>
                        {isOR?"—":isT?tiers.map(t=>`$${Math.round(t.retail*(comm/100)).toLocaleString()}`).join(" / "):`$${Math.round((tiers[0]?.retail||0)*(comm/100)).toLocaleString()}`}
                      </td>
                      <td style={{fontFamily:F.heading,fontSize:12,fontWeight:700,color:C.terra,padding:"8px 12px"}}>
                        {isOR?"POA":isT?tiers.map(t=>`${t.label}: $${Math.round(t.retail*(1-comm/100)).toLocaleString()}`).join(" / "):`$${Math.round((tiers[0]?.retail||0)*(1-comm/100)).toLocaleString()} ${p.pricing.structure==="per_couple"?"per couple":"per adult"}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{marginTop:8,fontFamily:F.body,fontSize:10,color:C.grey400}}>All rates in AUD inclusive of 10% GST · Net rates based on {comm}% commission on retail</div>
          </div>
        );
      })()}

      {/* Divider before Before You Arrive */}
      {itinerary.beforeYouArrive&&!isTrade&&(
        <div className="divider-page no-print-border" style={{background:C.navy,borderRadius:10,marginBottom:16,padding:"40px 36px",display:"flex",alignItems:"center",minHeight:120}}>
          <div>
            <div style={{fontFamily:F.body,fontSize:9,color:C.sand,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:8}}>Coonawarra Experiences</div>
            <div style={{fontFamily:F.heading,fontSize:28,fontWeight:700,color:C.white}}>Before You Arrive</div>
          </div>
        </div>
      )}
      {/* Before you arrive */}
      {itinerary.beforeYouArrive&&!isTrade&&(
        <div className="print-break" style={{marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,paddingBottom:8,borderBottom:`2px solid ${C.sand}`}}>
            <span style={{fontFamily:F.heading,fontSize:18,fontWeight:700,color:C.navy}}>Before You Arrive</span>
          </div>
          <div style={{fontFamily:F.body,fontSize:12,color:C.grey600,lineHeight:1.75,whiteSpace:"pre-wrap"}}>{itinerary.beforeYouArrive}</div>
        </div>
      )}

      {/* Divider before Terms */}
      {itinerary.terms&&(
        <div className="divider-page no-print-border" style={{background:C.navy,borderRadius:10,marginBottom:16,padding:"40px 36px",display:"flex",alignItems:"center",minHeight:120}}>
          <div>
            <div style={{fontFamily:F.body,fontSize:9,color:C.sand,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:8}}>Coonawarra Experiences</div>
            <div style={{fontFamily:F.heading,fontSize:28,fontWeight:700,color:C.white}}>{isTrade?"Booking Conditions":"Terms & Conditions"}</div>
          </div>
        </div>
      )}
      {/* Terms */}
      {itinerary.terms&&(
        <div className="print-break" style={{marginBottom:20}}>
          <div style={{fontFamily:F.heading,fontSize:14,fontWeight:700,color:C.navy,marginBottom:12,paddingBottom:8,borderBottom:`2px solid ${C.sand}`}}>{isTrade?"Booking Conditions":"Terms & Conditions"}</div>
          <div style={{fontFamily:F.body,fontSize:11,color:C.grey600,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{itinerary.terms}</div>
        </div>
      )}

      {/* Attachments list */}
      {itinerary.attachments?.length>0&&(
        <div style={{marginBottom:20,padding:"14px 16px",background:C.grey100,borderRadius:8}}>
          <div style={{fontFamily:F.body,fontSize:10,fontWeight:700,color:C.grey400,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>Documents attached</div>
          {itinerary.attachments.map(att=>(
            <div key={att.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <span style={{fontSize:14}}>📄</span>
              <span style={{fontFamily:F.body,fontSize:12,color:C.navy}}>{att.name}</span>
              <span style={{fontFamily:F.body,fontSize:10,color:C.grey400}}>({att.size} KB)</span>
            </div>
          ))}
        </div>
      )}

      {/* Page number — print only */}
      <div className="no-print" style={{display:"none"}}/>
      <style>{`@media print{.print-page-num{display:block!important;}.print-break::before{counter-increment:page-num;}.page-num-footer{position:running(footer);}@page{@bottom-center{content:counter(page-num);font-family:Arial,sans-serif;font-size:9pt;color:#9e9b92;}}}`}</style>
      {/* Footer */}
      <div style={{background:C.navy,borderRadius:10,padding:"18px 24px"}}>
        <div style={{fontFamily:F.serif,fontSize:13,fontStyle:"italic",color:C.sand,marginBottom:10}}>"Unearthing South Australia's captivating Limestone Coast."</div>
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

// ─── Offline HTML generator ───────────────────────────────────────────────────
function generateOfflineHTML(itinerary, allProducts, productImages, activeCurrency, fxRates) {
  // Build a self-contained HTML snapshot of the preview
  const fmtD = d => {if(!d)return"";return new Date(d).toLocaleDateString("en-AU",{day:"numeric",month:"long",year:"numeric"});};
  const fmtDS = d => {if(!d)return"";return new Date(d).toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"long"});};
  const WEATHER_DATA = {1:{month:"January",temp:"20–34°C",rain:"Low",icon:"☀️",note:"Peak summer. Hot days, long light evenings."},2:{month:"February",temp:"20–33°C",rain:"Low",icon:"☀️",note:"Still hot. Vintage begins in Coonawarra."},3:{month:"March",temp:"16–28°C",rain:"Low",icon:"🌤️",note:"Vintage season. Warm days, cooler evenings."},4:{month:"April",temp:"12–22°C",rain:"Medium",icon:"🌤️",note:"Autumn colours in the vineyard. Cool nights."},5:{month:"May",temp:"9–18°C",rain:"Medium",icon:"🌥️",note:"Shoulder season. Quieter, good value."},6:{month:"June",temp:"6–14°C",rain:"High",icon:"🌧️",note:"Winter. Fires in the cellar doors."},7:{month:"July",temp:"5–13°C",rain:"High",icon:"🌧️",note:"Coldest month. Warm layers recommended."},8:{month:"August",temp:"6–14°C",rain:"High",icon:"🌧️",note:"Winter wrapping up. Wildlife active at dusk."},9:{month:"September",temp:"8–17°C",rain:"Medium",icon:"🌤️",note:"Spring. Vines budding. Wildflowers along the coast."},10:{month:"October",temp:"11–21°C",rain:"Low",icon:"🌤️",note:"Perfect touring weather. Peak season begins."},11:{month:"November",temp:"13–25°C",rain:"Low",icon:"☀️",note:"Warm and sunny. Book ahead."},12:{month:"December",temp:"16–28°C",rain:"Low",icon:"☀️",note:"Summer holidays. Festive atmosphere."}};

  let body = "";

  // Cover
  if(itinerary.coverImage) body += `<div class="cover" style="position:relative;overflow:hidden"><img src="${itinerary.coverImage}" alt="" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;opacity:0.18;">`; body += `<div class="cover">`;
  body += `
    <img src="https://res.cloudinary.com/dgzv5n4f3/image/upload/f_auto,q_auto,w_300/Coonawarra-Experiences-Logo-Portrait-Reverse-Transparent-300dpi-RGB_olm9ho.png" alt="Coonawarra Experiences" style="height:90px;width:auto;display:block;margin-bottom:10px;">
    <h1>${itinerary.title||"Private Itinerary"}</h1>
    ${itinerary.clientName?`<p class="serif italic sand">Prepared for ${itinerary.clientName}</p>`:""}
    <div class="cover-meta">
      ${itinerary.arrivalDate?`<span><b>Arrival</b> · ${fmtD(itinerary.arrivalDate)}</span>`:""}
      ${itinerary.departureDate?`<span><b>Departure</b> · ${fmtD(itinerary.departureDate)}</span>`:""}
      ${itinerary.guestCount?`<span><b>Guests</b> · ${itinerary.guestCount}</span>`:""}
      <span><b>Duration</b> · ${itinerary.days.length} day${itinerary.days.length===1?"":"s"}</span>
      ${itinerary.origin?`<span><b>Origin</b> · ${itinerary.origin}</span>`:""}
    </div>
    ${itinerary.totalPrice?`<div class="price-box"><div class="price-label">Total investment</div><div class="price-val">${itinerary.totalPrice}</div></div>`:""}
    ${activeCurrency&&activeCurrency!=="AUD"?`<div class="currency-note">Prices shown in AUD · Approximate ${activeCurrency} equivalents shown where available</div>`:""}
    <div class="season-note">Valid 1 April 2027 – 31 March 2028 · AUD incl. 10% GST${itinerary.ceRef?` &nbsp;·&nbsp; Ref ${itinerary.ceRef}`:""}${itinerary.rezdyRef?` &nbsp;·&nbsp; Rezdy ${itinerary.rezdyRef}`:""}${itinerary.expiryDate?` &nbsp;·&nbsp; <span style="color:#d34727;font-weight:600;">Quote valid until ${fmtD(itinerary.expiryDate)}</span>`:""}</div>
  </div>`;

  // Intro
  if(itinerary.intro) body += `<div class="section teal-border"><div class="eyebrow teal">About this journey</div><p class="serif large">${itinerary.intro}</p></div>`;

  // Host bio
  if(itinerary.hostBio) body += `<div class="section sand-bg"><div class="host-avatar">SK</div><div><div class="eyebrow navy">Your hosts · Simon & Kerry Meares</div><p>${itinerary.hostBio}</p></div></div>`;

  // Days
  itinerary.days.forEach((day,di)=>{
    const w = day.date ? WEATHER_DATA[new Date(day.date).getMonth()+1] : null;
    body += `<div class="page-break"><div class="day-header"><span class="day-num">DAY ${di+1}</span><div><div class="day-title">${day.title}</div>${day.location?`<div class="day-loc">${day.location}</div>`:""}</div>${day.date?`<span class="day-date">${fmtDS(day.date)}</span>`:""}</div>`;
    if(w) body += `<div class="weather-note">${w.icon} ${w.note}</div>`;
    if(day.dayNotes) body += `<div class="day-notes">${day.dayNotes}</div>`;
    day.items.forEach(item=>{
      const p = allProducts.find(x=>x.id===item.productId);
      if(!p) return;
      const imgs = productImages[p.id]||[];
      body += `<div class="experience">`;
      if(imgs.length){body += `<div class="img-strip"><img src="${imgs[0]}" alt="${p.name}" style="width:100%;height:160px;object-fit:cover;display:block;border-radius:6px 6px 0 0"></div>`;}
      body += `<div class="exp-body"><div class="exp-title">${p.name}</div>`;
      if(p.location) body += `<div class="exp-loc">${p.location}</div>`;
      if(p.description) body += `<p class="exp-desc">${p.description}</p>`;
      if(item.notes) body += `<div class="note-box">Note: ${item.notes}</div>`;
      if(p.inclusions?.length) body += `<div class="inc-label">Included</div><ul class="inc-list">${p.inclusions.map(i=>`<li>${i}</li>`).join("")}</ul>`;
      body += `</div></div>`;
    });
    body += `</div>`;
  });

  // Before you arrive
  if(itinerary.beforeYouArrive) body += `<div class="page-break"><h2 class="section-title">Before You Arrive</h2><div class="body-text pre">${itinerary.beforeYouArrive}</div></div>`;

  // Terms
  if(itinerary.terms) body += `<div class="page-break"><h2 class="section-title">Terms & Conditions</h2><div class="body-text small pre">${itinerary.terms}</div></div>`;

  // Attachments
  if(itinerary.attachments?.length){
    body += `<div class="attachments"><div class="eyebrow">Documents attached to this itinerary</div>`;
    itinerary.attachments.forEach(att=>{
      body += `<div class="att-item"><a href="${att.data}" download="${att.name}" class="att-link">📄 ${att.name} <span class="att-size">(${att.size} KB)</span></a></div>`;
    });
    body += `</div>`;
  }

  // Footer
  body += `<div class="footer"><p class="serif italic">"Unearthing South Australia's captivating Limestone Coast."</p><div class="footer-contacts"><span><b>Phone</b> 1800 861 190</span><span><b>Email</b> info@coonawarraexperiences.com.au</span><span><b>Web</b> coonawarraexperiences.com.au</span></div></div>`;

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${itinerary.title||"Itinerary"} — ${itinerary.clientName||"Coonawarra Experiences"}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Segoe UI',Arial,sans-serif;background:#faf9f6;color:#1a1917;max-width:860px;margin:0 auto;padding:20px;}
h1{font-family:Arial Black,sans-serif;font-size:28px;color:white;line-height:1.1;margin-bottom:6px;}
h2.section-title{font-family:Arial Black,sans-serif;font-size:18px;color:#192957;margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid #d8c69d;}
.cover{background:#192957;border-radius:10px;padding:28px 32px;margin-bottom:16px;color:white;}
.cover-label{font-size:9px;color:#d8c69d;letter-spacing:.15em;text-transform:uppercase;margin-bottom:6px;}
.sand{color:#d8c69d!important;}
.italic{font-style:italic;}
.serif{font-family:Georgia,serif;}
.large{font-size:14px;line-height:1.75;}
.cover-meta{display:flex;gap:20px;flex-wrap:wrap;margin:14px 0;font-size:11px;color:rgba(255,255,255,.7);}
.cover-meta b{color:#d8c69d;}
.price-box{display:inline-block;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:8px;padding:8px 16px;margin-bottom:14px;}
.price-label{font-size:9px;color:#d8c69d;letter-spacing:.1em;text-transform:uppercase;margin-bottom:2px;}
.price-val{font-family:Arial Black,sans-serif;font-size:20px;font-weight:700;color:white;}
.season-note{font-size:9px;color:rgba(255,255,255,.35);margin-top:14px;padding-top:12px;border-top:1px solid rgba(255,255,255,.1);}
.section{background:white;border:1px solid #e8e6e0;border-radius:10px;padding:18px 22px;margin-bottom:16px;}
.teal-border{border-left:4px solid #40c0c0;}
.sand-bg{background:#f0ead8;display:flex;gap:16px;align-items:flex-start;}
.host-avatar{width:44px;height:44px;border-radius:50%;background:#192957;color:#d8c69d;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex-shrink:0;}
.eyebrow{font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px;}
.teal{color:#40c0c0;}
.navy{color:#192957;}
.page-break{margin-bottom:20px;page-break-before:auto;}
.day-header{display:flex;align-items:center;gap:10px;margin-bottom:10px;padding-bottom:8px;border-bottom:2px solid #d8c69d;}
.day-num{font-size:9px;font-weight:700;color:#d34727;letter-spacing:.1em;text-transform:uppercase;flex-shrink:0;}
.day-title{font-family:Arial Black,sans-serif;font-size:18px;font-weight:700;color:#192957;}
.day-loc{font-size:11px;color:#9e9b92;margin-top:1px;}
.day-date{font-size:11px;color:#9e9b92;margin-left:auto;flex-shrink:0;}
.weather-note{font-family:Georgia,serif;font-style:italic;font-size:12px;color:#5c5a54;margin-bottom:12px;padding-left:10px;border-left:2px solid #d8c69d;}
.day-notes{font-size:12px;color:#5c5a54;margin-bottom:14px;padding:10px 12px;background:#f0ead8;border-radius:6px;}
.experience{background:white;border:1px solid #e8e6e0;border-radius:8px;overflow:hidden;margin-bottom:10px;border-left:4px solid #192957;}
.exp-body{padding:12px 14px;}
.exp-title{font-family:Arial Black,sans-serif;font-size:14px;font-weight:700;color:#192957;margin-bottom:2px;}
.exp-loc{font-size:11px;color:#9e9b92;margin-bottom:6px;}
.exp-desc{font-size:12px;color:#5c5a54;line-height:1.5;margin-bottom:8px;}
.note-box{font-size:11px;font-style:italic;color:#192957;background:#f0ead8;border-radius:5px;padding:6px 10px;margin-bottom:8px;}
.inc-label{font-size:9px;font-weight:700;color:#9e9b92;letter-spacing:.1em;text-transform:uppercase;margin-bottom:4px;}
.inc-list{list-style:none;padding:0;columns:2;gap:12px;}
.inc-list li{font-size:11px;color:#5c5a54;padding-left:10px;position:relative;margin-bottom:2px;}
.inc-list li::before{content:"";position:absolute;left:0;top:7px;width:5px;height:1px;background:#40c0c0;}
.body-text{font-size:12px;color:#5c5a54;line-height:1.7;}
.body-text.small{font-size:11px;}
.pre{white-space:pre-wrap;}
.attachments{margin-bottom:20px;padding:14px 16px;background:#f4f3f0;border-radius:8px;}
.att-item{margin-bottom:4px;}
.att-link{color:#192957;text-decoration:none;font-size:12px;}
.att-link:hover{text-decoration:underline;}
.att-size{color:#9e9b92;font-size:10px;}
.footer{background:#192957;border-radius:10px;padding:18px 24px;margin-top:20px;}
.footer p{color:#d8c69d;margin-bottom:10px;}
.footer-contacts{display:flex;gap:20px;flex-wrap:wrap;font-size:11px;color:rgba(255,255,255,.6);}
.footer-contacts b{color:#d8c69d;}
@media(max-width:600px){.cover-meta,.footer-contacts{flex-direction:column;gap:8px;}.inc-list{columns:1;}}
@media print{body{max-width:none;padding:0;}.page-break{page-break-before:always;}@page{margin:12mm;}}
</style></head><body>${body}</body></html>`;
}

// ─── Export CSV ───────────────────────────────────────────────────────────────
function exportToCSV(itineraries, allProducts) {
  const rows = [
    ["CE Ref","Rezdy Ref","Title","Client","Email","Guests","Origin","Arrival","Departure","Status","Total Price","Days","Products","Created","Updated"]
  ];
  itineraries.forEach(it=>{
    const products = it.days.flatMap(d=>d.items).map(item=>{
      const p=allProducts.find(x=>x.id===item.productId);
      return p?.name||"";
    }).filter(Boolean).join(" | ");
    rows.push([
      it.ceRef||"",
      it.rezdyRef||"",
      it.title||"",
      it.clientName||"",
      it.clientEmail||"",
      it.guestCount||"",
      it.origin||"",
      it.arrivalDate||"",
      it.departureDate||"",
      it.status||"",
      it.totalPrice||"",
      it.days?.length||0,
      products,
      it.createdAt?new Date(it.createdAt).toLocaleDateString("en-AU"):"",
      it.updatedAt?new Date(it.updatedAt).toLocaleDateString("en-AU"):"",
    ]);
  });
  const csv = rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob = new Blob([csv],{type:"text/csv"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href=url;
  a.download=`CE_Itineraries_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Netlify deploy ───────────────────────────────────────────────────────────
// Token is stored server-side as NETLIFY_DEPLOY_TOKEN environment variable.
// The browser calls /.netlify/functions/deploy which proxies to the Netlify API.
const NETLIFY_LIVE_URL = "https://ce-limestonecoast.netlify.app";

async function sha1(str) {
  const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("");
}

async function deployToNetlify(itinerary, allProducts, productImages, activeCurrency, fxRates) {
  const html = generateOfflineHTML(itinerary, allProducts, productImages, activeCurrency, fxRates);
  const fileHash = await sha1(html);

  // Call our serverless function — token never touches the browser
  const res = await fetch("/.netlify/functions/deploy", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({html, fileHash}),
  });

  if (!res.ok) {
    const err = await res.json().catch(()=>({}));
    throw new Error(err?.error || `Deploy error ${res.status}`);
  }

  const result = await res.json();
  if (result.error) throw new Error(result.error);
  return NETLIFY_LIVE_URL;
}

// ─── Share button component ────────────────────────────────────────────────────
function ShareButton({itinerary, allProducts, productImages, activeCurrency, fxRates}) {
  const [state, setState] = useState("idle"); // idle | deploying | done | error
  const [liveUrl, setLiveUrl] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleDeploy() {
    setState("deploying");
    try {
      const url = await deployToNetlify(itinerary, allProducts, productImages, activeCurrency, fxRates);
      setLiveUrl(url);
      setState("done");
    } catch(e) {
      console.error(e);
      setState("error");
      setTimeout(()=>setState("idle"), 4000);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(liveUrl).then(()=>{
      setCopied(true);
      setTimeout(()=>setCopied(false), 2000);
    });
  }

  if (state==="done") return (
    <div style={{display:"flex",alignItems:"center",gap:4}}>
      <div style={{display:"flex",flexDirection:"column",gap:1}}>
        <div style={{fontFamily:F.body,fontSize:10,color:C.white,background:"rgba(255,255,255,0.15)",borderRadius:5,padding:"4px 10px",maxWidth:240,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
          ce-limestonecoast.netlify.app
        </div>
        <div style={{fontFamily:F.body,fontSize:9,color:"rgba(255,255,255,0.45)",paddingLeft:2}}>
          Live: {itinerary.ceRef||"—"}{itinerary.clientName?` · ${itinerary.clientName}`:""}
        </div>
      </div>
      <button onClick={handleCopy} style={{fontFamily:F.heading,fontSize:10,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:C.navy,background:C.sand,border:"none",borderRadius:5,padding:"6px 10px"}}>
        {copied?"✓ Copied":"Copy link"}
      </button>
      <button onClick={handleDeploy} title="Redeploy" style={{fontFamily:F.body,fontSize:10,color:"rgba(255,255,255,0.6)",background:"transparent",border:`1px solid rgba(255,255,255,0.2)`,borderRadius:5,padding:"5px 8px"}}>↺</button>
    </div>
  );

  return (
    <button onClick={handleDeploy} disabled={state==="deploying"}
      style={{fontFamily:F.heading,fontSize:10,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",
        color:C.white,background:state==="error"?C.terra:"#2d6a4f",border:"none",borderRadius:5,padding:"6px 12px",
        opacity:state==="deploying"?0.7:1,cursor:state==="deploying"?"not-allowed":"pointer"}}
    >
      {state==="deploying"?"Publishing...":state==="error"?"✗ Failed":"🔗 Share link"}
    </button>
  );
}

// ─── Product usage tracker ────────────────────────────────────────────────────
function getProductUsage(itineraries, allProducts) {
  const counts = {};
  itineraries.forEach(it=>{
    it.days?.forEach(d=>{
      d.items?.forEach(item=>{
        counts[item.productId] = (counts[item.productId]||0) + 1;
      });
    });
  });
  return allProducts
    .filter(p=>counts[p.id])
    .map(p=>({...p, usageCount:counts[p.id]}))
    .sort((a,b)=>b.usageCount-a.usageCount);
}

// ─── Email builder ────────────────────────────────────────────────────────────
function buildEmailBody(itinerary,allProducts){
  const lines=[];
  lines.push(`Dear ${itinerary.clientName||"there"},`,"");
  lines.push("Thank you for your interest in a private journey with Coonawarra Experiences. I'm delighted to share this itinerary for your consideration.");
  if(itinerary.intro){lines.push("",itinerary.intro);}
  lines.push("");
  if(itinerary.arrivalDate)lines.push(`Arrival: ${fmtDate(itinerary.arrivalDate)}`);
  if(itinerary.departureDate)lines.push(`Departure: ${fmtDate(itinerary.departureDate)}`);
  if(itinerary.guestCount)lines.push(`Guests: ${itinerary.guestCount}`);
  if(itinerary.totalPrice)lines.push(`Investment: ${itinerary.totalPrice}`);
  lines.push("");
  itinerary.days.forEach((day,di)=>{
    lines.push(`DAY ${di+1} — ${day.title}${day.location?` · ${day.location}`:""}`);
    if(day.dayNotes)lines.push(day.dayNotes);
    day.items.forEach(item=>{
      const p=findProduct(allProducts,item.productId);
      if(p){lines.push(`  · ${p.name}${p.duration?` (${p.duration})`:""}`);if(item.notes)lines.push(`    ${item.notes}`);}
    });
    lines.push("");
  });
  lines.push("I would love to discuss this itinerary with you and tailor it further to your preferences.","","Warm regards,","Simon & Kerry Meares","Coonawarra Experiences","1800 861 190 · info@coonawarraexperiences.com.au");
  return lines.join("\n");
}

// Build HTML email body for Gmail draft
function buildHtmlEmailBody(itinerary, allProducts) {
  const navy="#192957", sand="#d8c69d", teal="#40c0c0", terra="#d34727", grey="#5c5a54";
  const fmtD=d=>{if(!d)return"";return new Date(d).toLocaleDateString("en-AU",{day:"numeric",month:"long",year:"numeric"});};
  let html=`<div style="font-family:Arial,sans-serif;max-width:620px;color:#1a1917;">`;

  // Opening
  html+=`<p style="margin-bottom:16px;">Dear ${itinerary.clientName||"there"},</p>`;
  if(itinerary.emailIntro){
    html+=`<p style="margin-bottom:16px;white-space:pre-wrap;">${itinerary.emailIntro}</p>`;
  } else {
    html+=`<p style="margin-bottom:16px;">Thank you for your interest in a private journey with Coonawarra Experiences. Please find your itinerary attached.</p>`;
  }

  if(itinerary.intro){html+=`<p style="margin-bottom:16px;font-style:italic;color:${grey};">${itinerary.intro}</p>`;}

  // Key details
  html+=`<table style="width:100%;border-collapse:collapse;background:#f0ead8;border-radius:8px;margin-bottom:20px;">`;
  html+=`<tr><td colspan="2" style="padding:12px 16px 6px;font-size:11px;font-weight:700;color:${navy};letter-spacing:.08em;text-transform:uppercase;">Journey Details</td></tr>`;
  if(itinerary.arrivalDate)html+=`<tr><td style="padding:3px 16px;font-size:12px;color:${grey};width:120px;">Arrival</td><td style="padding:3px 16px;font-size:12px;font-weight:600;color:${navy};">${fmtD(itinerary.arrivalDate)}</td></tr>`;
  if(itinerary.departureDate)html+=`<tr><td style="padding:3px 16px;font-size:12px;color:${grey};">Departure</td><td style="padding:3px 16px;font-size:12px;font-weight:600;color:${navy};">${fmtD(itinerary.departureDate)}</td></tr>`;
  if(itinerary.guestCount)html+=`<tr><td style="padding:3px 16px;font-size:12px;color:${grey};">Guests</td><td style="padding:3px 16px;font-size:12px;font-weight:600;color:${navy};">${itinerary.guestCount}</td></tr>`;
  if(itinerary.totalPrice)html+=`<tr><td style="padding:3px 16px 12px;font-size:12px;color:${grey};">Investment</td><td style="padding:3px 16px 12px;font-size:14px;font-weight:700;color:${terra};">${itinerary.totalPrice}</td></tr>`;
  html+=`</table>`;

  // Days
  itinerary.days.forEach((day,di)=>{
    html+=`<div style="margin-bottom:20px;">`;
    html+=`<div style="border-bottom:2px solid ${sand};padding-bottom:6px;margin-bottom:10px;">`;
    html+=`<span style="font-size:9px;font-weight:700;color:${terra};letter-spacing:.1em;text-transform:uppercase;margin-right:8px;">DAY ${di+1}</span>`;
    html+=`<span style="font-size:16px;font-weight:700;color:${navy};">${day.title}</span>`;
    if(day.location)html+=`<span style="font-size:11px;color:#9e9b92;margin-left:8px;">· ${day.location}</span>`;
    html+=`</div>`;
    if(day.dayNotes)html+=`<p style="font-size:12px;color:${grey};margin-bottom:10px;padding:8px 12px;background:#f0ead8;border-radius:5px;">${day.dayNotes}</p>`;
    day.items.forEach(item=>{
      const p=allProducts.find(x=>x.id===item.productId);
      if(!p)return;
      html+=`<div style="margin-bottom:8px;padding:10px 14px;background:#ffffff;border:1px solid #e8e6e0;border-radius:6px;border-left:3px solid ${navy};">`;
      html+=`<div style="font-size:13px;font-weight:700;color:${navy};margin-bottom:2px;">${p.name}</div>`;
      if(p.location)html+=`<div style="font-size:11px;color:#9e9b92;margin-bottom:4px;">${p.location}</div>`;
      if(p.duration)html+=`<div style="font-size:11px;color:${teal};margin-bottom:4px;">${p.duration}</div>`;
      if(p.description)html+=`<p style="font-size:12px;color:${grey};line-height:1.5;margin:4px 0;">${p.description}</p>`;
      if(item.notes)html+=`<p style="font-size:11px;font-style:italic;color:${navy};margin-top:6px;">Note: ${item.notes}</p>`;
      html+=`</div>`;
    });
    html+=`</div>`;
  });

  // Closing
  html+=`<p style="margin-top:20px;margin-bottom:8px;">I would love to discuss this itinerary further and tailor it to your preferences.</p>`;
  html+=`<p style="margin-bottom:20px;">Please don't hesitate to call or email at any time.</p>`;
  html+=`<div style="border-top:1px solid #e8e6e0;padding-top:16px;margin-top:16px;">`;
  html+=`<p style="margin:0;font-weight:600;color:${navy};">Warm regards,</p>`;
  html+=`<p style="margin:4px 0 0;color:${navy};">Simon & Kerry Meares</p>`;
  html+=`<p style="margin:2px 0 0;font-size:12px;color:${grey};">Coonawarra Experiences</p>`;
  html+=`<p style="margin:2px 0 0;font-size:12px;color:${grey};">1800 861 190 · info@coonawarraexperiences.com.au</p>`;
  html+=`<p style="margin:2px 0 0;font-size:12px;color:${grey};">coonawarraexperiences.com.au</p>`;
  html+=`</div></div>`;
  return html;
}

async function createGmailDraft(itinerary, allProducts, productImages, activeCurrency, fxRates) {
  const subject = `Your Coonawarra Experiences Itinerary — ${itinerary.title}`;
  const to = itinerary.clientEmail || "";
  const plainBody = buildEmailBody(itinerary, allProducts);

  // Generate the self-contained HTML itinerary file
  const htmlItinerary = generateOfflineHTML(itinerary, allProducts, productImages, activeCurrency, fxRates);
  const fileName = `${(itinerary.clientName||"Itinerary").replace(/[^a-z0-9]/gi,"_")}_${itinerary.title.replace(/[^a-z0-9]/gi,"_")}.html`;
  const fileB64 = btoa(unescape(encodeURIComponent(htmlItinerary)));

  // Build multipart/mixed email with plain text body + HTML attachment
  const fromAddr = "info@coonawarraexperiences.com.au";
  const outerBoundary = "outer_" + Math.random().toString(36).slice(2);

  const parts = [
    `From: ${fromAddr}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/mixed; boundary="${outerBoundary}"`,
    ``,
    `--${outerBoundary}`,
    `Content-Type: text/plain; charset="UTF-8"`,
    `Content-Transfer-Encoding: quoted-printable`,
    ``,
    plainBody,
    ``,
    `--${outerBoundary}`,
    `Content-Type: text/html; name="${fileName}"`,
    `Content-Disposition: attachment; filename="${fileName}"`,
    `Content-Transfer-Encoding: base64`,
    ``,
    fileB64,
    ``,
    `--${outerBoundary}--`,
  ];

  const rfcMessage = parts.join("\r\n");

  // Base64url encode the whole message
  const encoded = btoa(unescape(encodeURIComponent(rfcMessage)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");

  const token = await getGmailToken();
  const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/drafts", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify({ message: { raw: encoded } }),
  });
  if (res.status === 401) { clearToken(); throw new Error("Gmail session expired — please try again"); }

  if (!res.ok) {
    const err = await res.json().catch(()=>({}));
    throw new Error(err?.error?.message || `Gmail API error ${res.status}`);
  }
  return await res.json();
}

// ─── Gmail draft button ───────────────────────────────────────────────────────
function EmailDraftButton({itinerary,allProducts,productImages,activeCurrency,fxRates}){
  const[state,setState]=useState("idle");
  const[msg,setMsg]=useState("");
  const[connected,setConnected]=useState(()=>!!getStoredToken());

  async function handleClick(){
    setState("loading");setMsg("");
    try{
      await createGmailDraft(itinerary,allProducts,productImages,activeCurrency,fxRates);
      setConnected(true);
      setState("success");setMsg("Draft created — itinerary attached");
      setTimeout(()=>setState("idle"),3500);
    }catch(e){
      if(e.message?.includes("cancelled")||e.message?.includes("Popup")) setState("idle");
      else setState("error");
      setMsg(e.message||"Failed");
      setTimeout(()=>setState("idle"),4000);
    }
  }

  function handleDisconnect(){
    clearToken();setConnected(false);setMsg("");setState("idle");
  }

  const bg=state==="success"?C.teal:state==="error"?C.terra:C.teal;
  const label=state==="loading"?"Creating draft...":state==="success"?"✓ Draft in Gmail":state==="error"?"✗ Error":"Gmail Draft";

  return(
    <div style={{position:"relative",display:"inline-flex",alignItems:"center",gap:4}}>
      <button onClick={handleClick} disabled={state==="loading"} style={{fontFamily:F.heading,fontSize:10,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:C.white,background:bg,border:"none",borderRadius:connected?"5px 0 0 5px":5,padding:"6px 12px",opacity:state==="loading"?0.7:1,cursor:state==="loading"?"not-allowed":"pointer"}}>
        {!connected&&state==="idle"?"Connect Gmail":label}
      </button>
      {connected&&state==="idle"&&(
        <button onClick={handleDisconnect} title="Disconnect Gmail" style={{fontFamily:F.body,fontSize:10,color:"rgba(255,255,255,0.7)",background:"rgba(64,192,192,0.4)",border:"none",borderRadius:"0 5px 5px 0",padding:"6px 8px",cursor:"pointer",borderLeft:"1px solid rgba(255,255,255,0.2)"}}>✕</button>
      )}
      {msg&&state!=="idle"&&(
        <div style={{position:"absolute",top:"calc(100% + 6px)",right:0,background:state==="success"?C.teal:C.terra,color:C.white,fontFamily:F.body,fontSize:10,borderRadius:5,padding:"4px 10px",whiteSpace:"nowrap",zIndex:10,boxShadow:"0 2px 8px rgba(0,0,0,0.2)"}}>{msg}</div>
      )}
    </div>
  );
}

// ─── Status ───────────────────────────────────────────────────────────────────
const SC={draft:C.grey400,review:C.teal,published:C.terra};
const SL={draft:"Draft",review:"In Review",published:"Published"};

// ─── Edit tabs ────────────────────────────────────────────────────────────────
const EDIT_TABS=[
  {k:"itinerary",l:"Itinerary"},
  {k:"guest",l:"Guest Info"},
  {k:"content",l:"Content"},
  {k:"attachments",l:"Attachments"},
];

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App(){
  const[tab,setTab]=useState("builder");
  const[bView,setBView]=useState("edit");
  const[editTab,setEditTab]=useState("itinerary");
  const[showInternal,setSI]=useState(false);
  const[itineraries,setIts]=useState(()=>loadIts());
  const[activeId,setActiveId]=useState(null);
  const[productImages,setPImgs]=useState(()=>loadImgs());
  const[customProducts,setCPs]=useState(()=>loadCP());
  const[templates,setTemplates]=useState(()=>loadTemplates());
  const[libCat,setLibCat]=useState("All");
  const[libSearch,setLibSrch]=useState("");
  const[showForm,setShowForm]=useState(false);
  const[editProduct,setEditProduct]=useState(null);
  const[showTemplateManager,setShowTM]=useState(false);
  const[showSaveTemplate,setShowST]=useState(false);
  const[fxRates,setFxRates]=useState(()=>loadFX());
  const[activeCurrency,setActiveCurrency]=useState("AUD");
  const[showFxSettings,setShowFxSettings]=useState(false);
  const[dayPicker,setDayPicker]=useState(null); // {product} when open

  const allProducts=[...BUILT_IN_PRODUCTS,...customProducts];

  // Keyboard shortcuts
  useState(()=>{
    function handleKey(e){
      if(e.ctrlKey||e.metaKey){
        if(e.key==="p"&&active&&bView==="preview"){e.preventDefault();document.title=`${active.clientName||"Itinerary"} — ${active.title}`;window.print();}
        if(e.key==="d"&&active&&bView==="edit"&&editTab==="itinerary"){e.preventDefault();if(active.days.length>0)duplicateDay(active.days[active.days.length-1].id);}
        if(e.key==="n"){e.preventDefault();createNew();}
      }
    }
    window.addEventListener("keydown",handleKey);
    return()=>window.removeEventListener("keydown",handleKey);
  });
  const active=itineraries.find(i=>i.id===activeId)||null;

  function handleImagesChange(productId,imgs){const next={...productImages,[productId]:imgs};setPImgs(next);saveImgs(next);}

  function handleSaveProduct(product){
    let next;
    if(editProduct)next=customProducts.map(p=>p.id===product.id?{...product,custom:true}:p);
    else next=[{...product,id:uid(),custom:true},...customProducts];
    setCPs(next);saveCP(next);setShowForm(false);setEditProduct(null);
  }

  function handleDeleteProduct(id){
    if(!confirm("Delete this custom product?"))return;
    const next=customProducts.filter(p=>p.id!==id);setCPs(next);saveCP(next);
  }

  function handleDuplicateProduct(product){
    const copy={...JSON.parse(JSON.stringify(product)),id:uid(),name:product.name+" (copy)"};
    const next=[copy,...customProducts];
    setCPs(next);saveCP(next);
    setLibCat(product.category==="Accommodation"?"Accommodation":"Custom");
  }

  // Template operations
  function handleSaveTemplate(name,description){
    const template={
      id:uid(),name,description,savedAt:new Date().toISOString(),
      days:JSON.parse(JSON.stringify(active.days)),
      intro:active.intro,hostBio:active.hostBio,
      beforeYouArrive:active.beforeYouArrive,terms:active.terms,
      guestCount:active.guestCount,origin:active.origin,
    };
    const next=[template,...templates];
    setTemplates(next);saveTemplates(next);setShowST(false);
  }

  function handleDeleteTemplate(id){
    const tmpl=templates.find(t=>t.id===id);
    if(!confirm(`Delete template "${tmpl?.name||"this template"}"?\n\nThis cannot be undone.`))return;
    const next=templates.filter(t=>t.id!==id);setTemplates(next);saveTemplates(next);
  }

  function handleLoadTemplate(template){
    mutate(it=>({
      ...it,
      days:JSON.parse(JSON.stringify(template.days)).map(d=>({...d,id:uid(),items:d.items.map(i=>({...i,id:uid()}))})),
      intro:template.intro||it.intro,
      hostBio:template.hostBio||it.hostBio,
      beforeYouArrive:template.beforeYouArrive||it.beforeYouArrive,
      terms:template.terms||it.terms,
    }));
    setShowTM(false);
  }

  function mutate(fn){setIts(prev=>{const next=prev.map(i=>i.id===activeId?{...fn(i),updatedAt:new Date().toISOString()}:i);saveIts(next);return next;});}

  function createNew(){
    const it=newItinerary();
    it.ceRef=generateCERef(itineraries);
    const next=[it,...itineraries];
    setIts(next);saveIts(next);setActiveId(it.id);setTab("builder");setBView("edit");setEditTab("itinerary");
  }
  function deleteIt(id){
    const it=itineraries.find(i=>i.id===id);
    const name=it?.clientName?`${it.title} — ${it.clientName}`:it?.title||"this itinerary";
    if(!confirm(`Delete "${name}"?\n\nThis cannot be undone.`))return;
    const next=itineraries.filter(i=>i.id!==id);
    setIts(next);saveIts(next);
    if(activeId===id)setActiveId(null);
  }
  function dupIt(it){
    const c={...JSON.parse(JSON.stringify(it)),id:uid(),title:it.title+" (copy)",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
    c.ceRef=generateCERef([...itineraries,c]);
    const next=[c,...itineraries];
    setIts(next);saveIts(next);setActiveId(c.id);setTab("builder");setBView("edit");
  }
  function addDay(){mutate(it=>({...it,days:[...it.days,newDay(it.days.length+1)]}));}
  function duplicateDay(dayId){
    mutate(it=>{
      const idx=it.days.findIndex(d=>d.id===dayId);
      if(idx<0)return it;
      const copy={...JSON.parse(JSON.stringify(it.days[idx])),id:uid(),items:it.days[idx].items.map(i=>({...i,id:uid()}))};
      const days=[...it.days];days.splice(idx+1,0,copy);
      return{...it,days};
    });
  }
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

      {/* Modals */}
      {showTemplateManager&&<TemplateManager templates={templates} onLoad={handleLoadTemplate} onDelete={handleDeleteTemplate} onClose={()=>setShowTM(false)}/>}
      {showSaveTemplate&&active&&<SaveTemplateModal itinerary={active} onSave={handleSaveTemplate} onClose={()=>setShowST(false)}/>}
      {showFxSettings&&(
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(25,41,87,0.5)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowFxSettings(false)}>
          <div style={{background:C.white,borderRadius:10,padding:22,width:340,boxShadow:"0 20px 60px rgba(0,0,0,0.25)"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontFamily:F.heading,fontSize:14,fontWeight:700,color:C.navy,marginBottom:4}}>Exchange Rates</div>
            <div style={{fontFamily:F.body,fontSize:11,color:C.grey400,marginBottom:14}}>Set your fixed rates against AUD. Update these seasonally.</div>
            {Object.entries(fxRates).map(([currency,rate])=>(
              <div key={currency} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <span style={{fontFamily:F.heading,fontSize:12,fontWeight:700,color:C.navy,width:36}}>{currency}</span>
                <span style={{fontFamily:F.body,fontSize:11,color:C.grey400,flex:1}}>1 AUD =</span>
                <input type="number" step="0.01" value={rate} onChange={e=>{const next={...fxRates,[currency]:parseFloat(e.target.value)||0};setFxRates(next);saveFX(next);}} style={{fontFamily:F.body,fontSize:12,color:C.text,border:`1px solid ${C.grey200}`,borderRadius:5,padding:"4px 8px",outline:"none",width:80,textAlign:"right"}}/>
                <span style={{fontFamily:F.body,fontSize:11,color:C.grey400,width:30}}>{currency}</span>
              </div>
            ))}
            <div style={{marginTop:12,display:"flex",gap:8}}>
              <button onClick={()=>{setFxRates(DEFAULT_FX);saveFX(DEFAULT_FX);}} style={{fontFamily:F.body,fontSize:11,color:C.grey600,background:C.grey100,border:"none",borderRadius:5,padding:"6px 12px"}}>Reset defaults</button>
              <button onClick={()=>setShowFxSettings(false)} style={{flex:1,fontFamily:F.body,fontSize:11,fontWeight:600,color:C.white,background:C.navy,border:"none",borderRadius:5,padding:"6px 12px"}}>Done</button>
            </div>
          </div>
        </div>
      )}
      {dayPicker&&active&&(
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(25,41,87,0.5)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setDayPicker(null)}>
          <div style={{background:C.white,borderRadius:10,padding:20,minWidth:300,boxShadow:"0 20px 60px rgba(0,0,0,0.25)"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontFamily:F.heading,fontSize:14,fontWeight:700,color:C.navy,marginBottom:4}}>Add to which day?</div>
            <div style={{fontFamily:F.body,fontSize:12,color:C.grey400,marginBottom:12}}>{dayPicker.product.name}</div>
            {active.days.map((day,di)=>(
              <button key={day.id} onClick={()=>{addItem(day.id,dayPicker.product);setDayPicker(null);}} style={{display:"block",width:"100%",textAlign:"left",fontFamily:F.body,fontSize:13,color:C.navy,background:C.grey100,border:`1px solid ${C.grey200}`,borderRadius:6,padding:"8px 12px",marginBottom:5,cursor:"pointer"}}>
                <span style={{fontFamily:F.body,fontSize:10,fontWeight:700,color:C.terra,textTransform:"uppercase",letterSpacing:"0.08em",marginRight:8}}>Day {di+1}</span>{day.title}
              </button>
            ))}
            <button onClick={()=>setDayPicker(null)} style={{marginTop:4,fontFamily:F.body,fontSize:12,color:C.grey400,background:"transparent",border:"none",width:"100%",padding:"6px 0"}}>Cancel</button>
          </div>
        </div>
      )}

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
          {/* Templates */}
          <button onClick={()=>setShowTM(true)} style={{fontFamily:F.body,fontSize:11,color:"rgba(255,255,255,0.7)",background:"rgba(255,255,255,0.08)",border:`1px solid rgba(255,255,255,0.15)`,borderRadius:5,padding:"5px 11px"}}>📋 Templates</button>
          {tab==="builder"&&active&&bView==="edit"&&(
            <button onClick={()=>setShowST(true)} style={{fontFamily:F.body,fontSize:11,color:"rgba(255,255,255,0.7)",background:"rgba(255,255,255,0.08)",border:`1px solid rgba(255,255,255,0.15)`,borderRadius:5,padding:"5px 11px"}}>Save as template</button>
          )}
          {/* Internal toggle */}
          <div onClick={()=>setSI(v=>!v)} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",background:"rgba(255,255,255,0.06)",borderRadius:5,border:`1px solid rgba(255,255,255,0.1)`,cursor:"pointer"}}>
            <div style={{width:26,height:14,borderRadius:7,background:showInternal?C.teal:"rgba(255,255,255,0.18)",position:"relative",transition:"background 0.2s",flexShrink:0}}><div style={{position:"absolute",top:2,left:showInternal?12:2,width:10,height:10,borderRadius:"50%",background:C.white,transition:"left 0.2s"}}/></div>
            <span style={{fontFamily:F.body,fontSize:11,color:"rgba(255,255,255,0.65)",userSelect:"none"}}>Internal</span>
          </div>
          <button onClick={createNew} style={{fontFamily:F.heading,fontSize:10,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:C.white,background:C.terra,border:"none",borderRadius:5,padding:"6px 12px"}}>+ New</button>
          {tab==="builder"&&active&&bView==="preview"&&(
            <>
              <div style={{display:"flex",alignItems:"center",gap:3}}>
                {["AUD","NZD","GBP","USD","SGD","EUR"].map(c=>(
                  <button key={c} onClick={()=>setActiveCurrency(c)} style={{fontFamily:F.body,fontSize:10,fontWeight:activeCurrency===c?700:400,color:activeCurrency===c?C.navy:"rgba(255,255,255,0.6)",background:activeCurrency===c?C.sand:"transparent",border:activeCurrency===c?"none":`1px solid rgba(255,255,255,0.2)`,borderRadius:4,padding:"3px 7px"}}>{c}</button>
                ))}
                <button onClick={()=>setShowFxSettings(v=>!v)} style={{fontFamily:F.body,fontSize:10,color:"rgba(255,255,255,0.5)",background:"transparent",border:"none",padding:"3px 5px"}} title="Edit exchange rates">⚙</button>
              </div>
              <ShareButton itinerary={active} allProducts={allProducts} productImages={productImages} activeCurrency={activeCurrency} fxRates={fxRates}/>
              <button onClick={()=>{document.title=`${active.clientName||"Itinerary"} — ${active.title}`;window.print();}} style={{fontFamily:F.heading,fontSize:10,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:C.navy,background:C.sand,border:"none",borderRadius:5,padding:"6px 12px"}}>Print / PDF</button>
              <EmailDraftButton itinerary={active} allProducts={allProducts} productImages={productImages} activeCurrency={activeCurrency} fxRates={fxRates}/>
              <button onClick={()=>{
                const html=generateOfflineHTML(active,allProducts,productImages,activeCurrency,fxRates);
                const blob=new Blob([html],{type:"text/html"});
                const url=URL.createObjectURL(blob);
                const a=document.createElement("a");
                a.href=url;a.download=`${(active.clientName||"Itinerary").replace(/[^a-z0-9]/gi,"_")}_${active.title.replace(/[^a-z0-9]/gi,"_")}.html`;
                a.click();URL.revokeObjectURL(url);
              }} style={{fontFamily:F.heading,fontSize:10,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:C.white,background:"#5c5a54",border:"none",borderRadius:5,padding:"6px 12px"}}>↓ Offline</button>
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
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>exportToCSV(itineraries,allProducts)} style={{fontFamily:F.heading,fontSize:10,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:C.navy,background:C.white,border:`1px solid ${C.grey200}`,borderRadius:5,padding:"7px 14px"}}>↓ Export CSV</button>
              <button onClick={createNew} style={{fontFamily:F.heading,fontSize:10,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:C.white,background:C.terra,border:"none",borderRadius:5,padding:"7px 14px"}}>+ New</button>
            </div>
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
                  {it.ceRef&&<span style={{fontFamily:F.body,fontSize:10,fontWeight:700,color:C.terra}}>{it.ceRef}</span>}
                  {it.followUpDate&&new Date(it.followUpDate)<=new Date()&&<span style={{fontFamily:F.body,fontSize:9,fontWeight:700,color:C.white,background:C.terra,borderRadius:4,padding:"1px 6px"}}>Follow up due</span>}
                  {it.clientName&&<span>{it.clientName}</span>}
                  <span>{it.days.length} {it.days.length===1?"day":"days"}</span>
                  {it.arrivalDate&&<span>Arrives {fmtDate(it.arrivalDate)}</span>}
                  <span>Updated {new Date(it.updatedAt).toLocaleDateString("en-AU")}</span>
                  {it.statusHistory?.length>1&&<span style={{color:C.grey400}}>· {it.statusHistory.length} status changes</span>}
                </div>
              </div>
              <div style={{display:"flex",gap:5,flexShrink:0}}>
                <button onClick={()=>{
                  // Backfill CE ref if missing
                  if(!it.ceRef){
                    const ref=generateCERef(itineraries.filter(i=>i.id!==it.id));
                    const next=itineraries.map(i=>i.id===it.id?{...i,ceRef:ref}:i);
                    setIts(next);saveIts(next);
                  }
                  setActiveId(it.id);setTab("builder");setBView("edit");setEditTab("itinerary");
                }} style={{fontFamily:F.body,fontSize:11,fontWeight:600,color:C.white,background:C.navy,border:"none",borderRadius:5,padding:"5px 12px"}}>Open</button>
                <button onClick={()=>dupIt(it)} style={{fontFamily:F.body,fontSize:11,color:C.navy,background:"transparent",border:`1px solid ${C.grey200}`,borderRadius:5,padding:"5px 10px"}}>Copy</button>
                <button onClick={()=>deleteIt(it.id)} style={{fontFamily:F.body,fontSize:11,color:C.terra,background:"transparent",border:`1px solid ${C.terra}40`,borderRadius:5,padding:"5px 10px"}}>Delete</button>
              </div>
            </div>
          ))}
          {/* Product usage tracker */}
          {itineraries.length>0&&(()=>{
            const usage=getProductUsage(itineraries,allProducts).slice(0,8);
            if(!usage.length)return null;
            return(
              <div style={{marginTop:28}}>
                <div style={{fontFamily:F.heading,fontSize:14,fontWeight:700,color:C.navy,marginBottom:12}}>Most used products</div>
                <div style={{background:C.white,border:`1px solid ${C.grey200}`,borderRadius:10,overflow:"hidden"}}>
                  {usage.map((p,i)=>(
                    <div key={p.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderBottom:i<usage.length-1?`1px solid ${C.grey100}`:"none"}}>
                      <div style={{fontFamily:F.heading,fontSize:13,fontWeight:700,color:C.terra,width:24,textAlign:"center",flexShrink:0}}>{p.usageCount}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontFamily:F.body,fontSize:12,fontWeight:600,color:C.navy,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
                        <div style={{fontFamily:F.body,fontSize:10,color:C.grey400}}>{p.category}</div>
                      </div>
                      <div style={{fontFamily:F.body,fontSize:10,color:C.grey400}}>{p.usageCount} itinerar{p.usageCount===1?"y":"ies"}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Builder tab */}
      {tab==="builder"&&(
        !active?(
          <div style={{textAlign:"center",padding:"70px 20px"}}>
            <div style={{fontFamily:F.heading,fontSize:18,color:C.navy,marginBottom:6}}>No itinerary open</div>
            <div style={{fontFamily:F.body,fontSize:13,color:C.grey400,marginBottom:18}}>Create a new itinerary or open a saved one.</div>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button onClick={createNew} style={{fontFamily:F.heading,fontSize:11,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:C.white,background:C.terra,border:"none",borderRadius:6,padding:"9px 22px"}}>+ New Itinerary</button>
              <button onClick={()=>setTab("saved")} style={{fontFamily:F.heading,fontSize:11,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:C.navy,background:C.white,border:`1px solid ${C.grey200}`,borderRadius:6,padding:"9px 22px"}}>Open Saved</button>
              <button onClick={()=>setShowTM(true)} style={{fontFamily:F.heading,fontSize:11,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:C.navy,background:C.white,border:`1px solid ${C.grey200}`,borderRadius:6,padding:"9px 22px"}}>📋 Use Template</button>
            </div>
          </div>
        ):bView==="preview"?(
          <div style={{padding:"20px 18px"}}>
            <Preview itinerary={active} productImages={productImages} showInternal={showInternal} allProducts={allProducts} currency={activeCurrency} fxRates={fxRates}/>
          </div>
        ):(
          <div className="no-print" style={{display:"grid",gridTemplateColumns:"300px 1fr",height:"calc(100vh - 84px)",overflow:"hidden"}}>
            {/* Library */}
            <div style={{background:C.white,borderRight:`1px solid ${C.grey200}`,display:"flex",flexDirection:"column",overflow:"hidden"}}>
              <div style={{padding:"10px 12px",borderBottom:`1px solid ${C.grey200}`,background:C.grey100}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:7}}>
                  <div style={{fontFamily:F.heading,fontSize:10,fontWeight:700,color:C.grey400,letterSpacing:"0.1em",textTransform:"uppercase"}}>Product Library</div>
                  <div style={{display:"flex",gap:4}}>
                    <BulkImageUploader allProducts={allProducts} productImages={productImages} onImagesChange={handleImagesChange}/>
                    <button onClick={()=>{setShowForm(true);setEditProduct(null);setLibCat("Custom");}} style={{fontFamily:F.body,fontSize:10,fontWeight:700,color:C.white,background:C.teal,border:"none",borderRadius:5,padding:"3px 10px"}}>+ Custom</button>
                  </div>
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
                    onAdd={product=>{
                      if(!active?.days?.length)return;
                      if(active.days.length===1){addItem(active.days[0].id,product);}
                      else{setDayPicker({product});}
                    }}
                    onEdit={()=>{setEditProduct(p);setShowForm(true);setLibCat("Custom");}}
                    onDuplicate={()=>handleDuplicateProduct(p)}
                    onDelete={()=>handleDeleteProduct(p.id)}
                  />
                ))}
              </div>
            </div>

            {/* Right panel */}
            <div style={{display:"flex",flexDirection:"column",overflow:"hidden"}}>
              {/* Meta bar */}
              <div style={{background:C.white,borderBottom:`1px solid ${C.grey200}`,padding:"8px 14px"}}>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",marginBottom:6}}>
                  <input value={active.title} onChange={e=>mutate(it=>({...it,title:e.target.value}))} style={{fontFamily:F.heading,fontSize:15,fontWeight:700,color:C.navy,border:"none",outline:"none",background:"transparent",flex:"1 1 180px",minWidth:0}} placeholder="Itinerary title"/>
                  <div style={{position:"relative"}}>
                    <input value={active.clientName} onChange={e=>{
                      mutate(it=>({...it,clientName:e.target.value}));
                    }} placeholder="Client name" style={{...fi,width:140}}
                    list="past-clients"/>
                    <datalist id="past-clients">
                      {[...new Set(itineraries.filter(i=>i.id!==activeId&&i.clientName).map(i=>i.clientName))].map(name=>(
                        <option key={name} value={name}/>
                      ))}
                    </datalist>
                  </div>
                  <input value={active.clientEmail} onChange={e=>mutate(it=>({...it,clientEmail:e.target.value}))} placeholder="Client email" style={{...fi,width:180}}/>
                  <input type="number" value={active.guestCount} onChange={e=>mutate(it=>({...it,guestCount:parseInt(e.target.value)||2}))} min={1} max={20} title="Guests" style={{...fi,width:55}}/>
                  <input value={active.origin} onChange={e=>mutate(it=>({...it,origin:e.target.value}))} placeholder="Origin" style={{...fi,width:110}}/>
                  <select value={active.status} onChange={e=>{
                    const newStatus=e.target.value;
                    mutate(it=>({...it,status:newStatus,
                      statusHistory:[...(it.statusHistory||[]),{status:newStatus,date:new Date().toISOString()}]
                    }));
                  }} style={{...fi,color:SC[active.status],fontWeight:600}}>
                    <option value="draft">Draft</option><option value="review">In Review</option><option value="published">Published</option>
                  </select>
                  <div style={{display:"flex",alignItems:"center",gap:4,background:C.sandLight,borderRadius:5,padding:"3px 8px",flexShrink:0}}>
                    <span style={{fontFamily:F.body,fontSize:10,fontWeight:700,color:C.terra,letterSpacing:"0.06em"}}>{active.ceRef||"—"}</span>
                  </div>
                  <input value={active.rezdyRef||""} onChange={e=>mutate(it=>({...it,rezdyRef:e.target.value}))} placeholder="Rezdy ref..." style={{...fi,width:100}} title="Rezdy booking reference"/>
                </div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <span style={{fontFamily:F.body,fontSize:10,fontWeight:700,color:C.grey400,letterSpacing:"0.06em",textTransform:"uppercase"}}>Arrival</span>
                    <input type="date" value={active.arrivalDate||""} onChange={e=>mutate(it=>({...it,arrivalDate:e.target.value}))} style={fi}/>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <span style={{fontFamily:F.body,fontSize:10,fontWeight:700,color:C.grey400,letterSpacing:"0.06em",textTransform:"uppercase"}}>Departure</span>
                    <input type="date" value={active.departureDate||""} onChange={e=>mutate(it=>({...it,departureDate:e.target.value}))} style={fi}/>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <span style={{fontFamily:F.body,fontSize:10,fontWeight:700,color:C.grey400,letterSpacing:"0.06em",textTransform:"uppercase"}}>Total price</span>
                    <input value={active.totalPrice||""} onChange={e=>mutate(it=>({...it,totalPrice:e.target.value}))} placeholder="e.g. From $3,975 per couple" style={{...fi,width:220}}/>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <span style={{fontFamily:F.body,fontSize:10,fontWeight:700,color:C.grey400,letterSpacing:"0.06em",textTransform:"uppercase"}}>Quote valid until</span>
                    <input type="date" value={active.expiryDate||""} onChange={e=>mutate(it=>({...it,expiryDate:e.target.value}))} style={{...fi}}/>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <span style={{fontFamily:F.body,fontSize:10,fontWeight:700,color:C.terra,letterSpacing:"0.06em",textTransform:"uppercase"}}>Follow up</span>
                    <input type="date" value={active.followUpDate||""} onChange={e=>mutate(it=>({...it,followUpDate:e.target.value}))} style={{...fi,borderColor:active.followUpDate&&new Date(active.followUpDate)<=new Date()?C.terra:C.grey200}}/>
                  </div>
                  {active.tradeMode&&(
                    <div style={{display:"flex",alignItems:"center",gap:5}}>
                      <span style={{fontFamily:F.body,fontSize:10,fontWeight:700,color:C.terra,letterSpacing:"0.06em",textTransform:"uppercase"}}>Book by</span>
                      <input type="date" value={active.bookByDate||""} onChange={e=>mutate(it=>({...it,bookByDate:e.target.value}))} style={{...fi,borderColor:C.terra}}/>
                    </div>
                  )}
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontFamily:F.body,fontSize:11,color:C.grey400}}>Show inclusions</span>
                    <div onClick={()=>mutate(it=>({...it,showInclusions:it.showInclusions===false?true:false}))} style={{width:32,height:17,borderRadius:9,background:active.showInclusions===false?C.grey200:C.teal,position:"relative",cursor:"pointer",transition:"background 0.2s",flexShrink:0}}>
                      <div style={{position:"absolute",top:2,left:active.showInclusions===false?2:14,width:13,height:13,borderRadius:"50%",background:C.white,transition:"left 0.2s"}}/>
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginLeft:"auto"}}>
                    <span style={{fontFamily:F.body,fontSize:11,color:C.grey400}}>Show item pricing</span>
                    <div onClick={()=>mutate(it=>({...it,showPricing:!it.showPricing}))} style={{width:32,height:17,borderRadius:9,background:active.showPricing?C.teal:C.grey200,position:"relative",cursor:"pointer",transition:"background 0.2s",flexShrink:0}}>
                      <div style={{position:"absolute",top:2,left:active.showPricing?14:2,width:13,height:13,borderRadius:"50%",background:C.white,transition:"left 0.2s"}}/>
                    </div>
                    <span style={{fontFamily:F.body,fontSize:11,color:C.grey400,marginLeft:8}}>Trade mode</span>
                    <div onClick={()=>mutate(it=>({...it,tradeMode:!it.tradeMode,showPricing:!it.tradeMode}))} style={{width:32,height:17,borderRadius:9,background:active.tradeMode?C.terra:C.grey200,position:"relative",cursor:"pointer",transition:"background 0.2s",flexShrink:0}}>
                      <div style={{position:"absolute",top:2,left:active.tradeMode?14:2,width:13,height:13,borderRadius:"50%",background:C.white,transition:"left 0.2s"}}/>
                    </div>
                    {active.tradeMode&&(
                      <select value={active.commission||20} onChange={e=>mutate(it=>({...it,commission:parseInt(e.target.value)}))} style={{fontFamily:F.body,fontSize:11,color:C.terra,fontWeight:700,border:`1px solid ${C.terra}40`,borderRadius:5,padding:"3px 6px",outline:"none",background:C.white}}>
                        {[10,15,20,25].map(c=><option key={c} value={c}>{c}% comm</option>)}
                      </select>
                    )}
                  </div>
                </div>
              </div>

              {/* Edit sub-tabs */}
              <div style={{background:C.white,borderBottom:`1px solid ${C.grey200}`,padding:"0 14px",display:"flex",gap:2}}>
                {EDIT_TABS.map(({k,l})=>(
                  <button key={k} onClick={()=>setEditTab(k)} style={{fontFamily:F.body,fontSize:12,fontWeight:editTab===k?600:400,color:editTab===k?C.navy:C.grey400,background:"transparent",border:"none",borderBottom:editTab===k?`2px solid ${C.terra}`:"2px solid transparent",padding:"8px 14px",marginBottom:-1}}>
                    {l}{k==="guest"&&active.guestInfo?.name1?" ✓":""}
                    {k==="attachments"&&active.attachments?.length>0?` (${active.attachments.length})`:""}
                  </button>
                ))}
              </div>

              {/* Edit content */}
              <div style={{flex:1,overflowY:"auto",padding:"14px 14px 28px"}}>

                {/* Itinerary tab */}
                {editTab==="itinerary"&&(
                  <>
                    {active.days.map((day,di)=>(
                      <DayCard key={day.id} day={day} dayIndex={di} totalDays={active.days.length}
                        productImages={productImages} allProducts={allProducts} showPricing={active.showPricing}
                        onUpdate={updateDay} onRemoveItem={removeItem} onMoveItem={moveItem}
                        onNoteChange={updateNote} onRemove={()=>removeDay(day.id)}
                        onDuplicate={()=>duplicateDay(day.id)}
                        onMoveDay={(dir)=>mutate(it=>{const days=[...it.days];const ni=di+dir;if(ni<0||ni>=days.length)return it;[days[di],days[ni]]=[days[ni],days[di]];return{...it,days};})}
                        isFirstDay={di===0} isLastDay={di===active.days.length-1}
                      />
                    ))}
                    <button onClick={addDay} style={{width:"100%",fontFamily:F.body,fontSize:13,fontWeight:600,color:C.navy,background:C.white,border:`2px dashed ${C.grey200}`,borderRadius:10,padding:"13px"}}>+ Add Day</button>
                    <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",background:C.white,border:`1px solid ${C.grey200}`,borderRadius:8,marginTop:8}}>
                      <div style={{flex:1}}>
                        <div style={{fontFamily:F.body,fontSize:12,fontWeight:600,color:C.navy}}>Print layout</div>
                        <div style={{fontFamily:F.body,fontSize:11,color:C.grey400}}>{active.printFlow?"Experiences flow continuously — compact layout":"Each day starts on a new page — more space per day"}</div>
                      </div>
                      <div onClick={()=>mutate(it=>({...it,printFlow:!it.printFlow}))} style={{width:36,height:20,borderRadius:10,background:active.printFlow?C.teal:C.grey200,position:"relative",cursor:"pointer",transition:"background 0.2s",flexShrink:0}}>
                        <div style={{position:"absolute",top:3,left:active.printFlow?16:3,width:14,height:14,borderRadius:"50%",background:C.white,transition:"left 0.2s"}}/>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",marginTop:4}}>
                      <div style={{flex:1,height:1,background:`repeating-linear-gradient(90deg,${C.grey200} 0,${C.grey200} 6px,transparent 6px,transparent 12px)`}}/>
                      <span style={{fontFamily:F.body,fontSize:9,color:C.grey400,letterSpacing:"0.08em",textTransform:"uppercase",flexShrink:0}}>Page break · Before You Arrive</span>
                      <div style={{flex:1,height:1,background:`repeating-linear-gradient(90deg,${C.grey200} 0,${C.grey200} 6px,transparent 6px,transparent 12px)`}}/>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0"}}>
                      <div style={{flex:1,height:1,background:`repeating-linear-gradient(90deg,${C.grey200} 0,${C.grey200} 6px,transparent 6px,transparent 12px)`}}/>
                      <span style={{fontFamily:F.body,fontSize:9,color:C.grey400,letterSpacing:"0.08em",textTransform:"uppercase",flexShrink:0}}>Page break · Terms & Conditions</span>
                      <div style={{flex:1,height:1,background:`repeating-linear-gradient(90deg,${C.grey200} 0,${C.grey200} 6px,transparent 6px,transparent 12px)`}}/>
                    </div>
                  </>
                )}

                {/* Guest info tab */}
                {editTab==="guest"&&(
                  <SectionBox title="Guest Information (internal only)">
                    <GuestInfoForm guestInfo={active.guestInfo} onChange={gi=>mutate(it=>({...it,guestInfo:gi}))}/>
                  </SectionBox>
                )}

                {/* Content tab */}
                {editTab==="content"&&(
                  <>
                    {active.tradeMode&&(
                      <SectionBox title="Trade Partner Details" accent={C.terra}>
                        <div style={{display:"flex",gap:8,marginBottom:10}}>
                          <div style={{flex:2}}>
                            <label style={{fontFamily:F.body,fontSize:10,fontWeight:700,color:C.grey400,letterSpacing:"0.08em",textTransform:"uppercase",display:"block",marginBottom:3}}>Agency / partner name</label>
                            <input value={active.agentName||""} onChange={e=>mutate(it=>({...it,agentName:e.target.value}))} placeholder="e.g. Nyhavn Rejser" style={{width:"100%",fontFamily:F.body,fontSize:12,color:C.text,border:`1px solid ${C.grey200}`,borderRadius:5,padding:"5px 8px",outline:"none"}}/>
                          </div>
                          <div style={{flex:1}}>
                            <label style={{fontFamily:F.body,fontSize:10,fontWeight:700,color:C.grey400,letterSpacing:"0.08em",textTransform:"uppercase",display:"block",marginBottom:3}}>Agent ref / file no.</label>
                            <input value={active.agentRef||""} onChange={e=>mutate(it=>({...it,agentRef:e.target.value}))} placeholder="e.g. NYH-2027-042" style={{width:"100%",fontFamily:F.body,fontSize:12,color:C.text,border:`1px solid ${C.grey200}`,borderRadius:5,padding:"5px 8px",outline:"none"}}/>
                          </div>
                        </div>
                        <div>
                          <label style={{fontFamily:F.body,fontSize:10,fontWeight:700,color:C.grey400,letterSpacing:"0.08em",textTransform:"uppercase",display:"block",marginBottom:3}}>Agent logo (appears on trade cover)</label>
                          {active.agentLogo?(
                            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                              <img src={active.agentLogo} alt="Agent logo" style={{height:40,maxWidth:160,objectFit:"contain",background:C.white,border:`1px solid ${C.grey200}`,borderRadius:4,padding:4}}/>
                              <button onClick={()=>mutate(it=>({...it,agentLogo:""}))} style={{fontFamily:F.body,fontSize:11,color:C.terra,background:"transparent",border:`1px solid ${C.terra}30`,borderRadius:4,padding:"3px 10px"}}>Remove</button>
                            </div>
                          ):(
                            <AgentLogoUploader onUpload={url=>mutate(it=>({...it,agentLogo:url}))}/>
                          )}
                        </div>
                      </SectionBox>
                    )}
                    <SectionBox title="Cover Hero Image (optional)">
                      <div style={{marginBottom:8}}>
                        {active.coverImage?(
                          <div style={{position:"relative",marginBottom:8}}>
                            <img src={active.coverImage} alt="Cover" style={{width:"100%",height:100,objectFit:"cover",borderRadius:6,display:"block"}} crossOrigin="anonymous"/>
                            <button onClick={()=>mutate(it=>({...it,coverImage:""}))} style={{position:"absolute",top:4,right:4,background:C.terra,color:C.white,border:"none",borderRadius:4,padding:"2px 8px",fontFamily:F.body,fontSize:10,cursor:"pointer"}}>Remove</button>
                          </div>
                        ):(
                          <CoverImageUploader onUpload={url=>mutate(it=>({...it,coverImage:url}))}/>
                        )}
                        <div style={{fontFamily:F.body,fontSize:10,color:C.grey400}}>Appears as a full-bleed background behind the navy cover. Use a landscape landscape photo — vineyard, coastline, wildlife.</div>
                      </div>
                    </SectionBox>
                    <SectionBox title="Welcome Message (appears on cover)">
                      <div style={{fontFamily:F.body,fontSize:11,color:C.grey400,marginBottom:6}}>A personal note on the cover page, below the client name. Set in italic serif. Leave blank to hide.</div>
                      <textarea value={active.welcomeMessage||""} onChange={e=>mutate(it=>({...it,welcomeMessage:e.target.value}))} placeholder={`We're delighted to have put together this journey for you — a few days of wine, wilderness and warm Limestone Coast hospitality.\n\nWe look forward to welcoming you in person.`} style={{width:"100%",fontFamily:F.serif,fontStyle:"italic",fontSize:13,color:C.navy,border:`1px solid ${C.grey200}`,borderRadius:6,padding:"8px 12px",resize:"vertical",minHeight:80,outline:"none"}}/>
                    </SectionBox>
                    <SectionBox title="Introduction / Journey Overview">
                      <textarea value={active.intro||""} onChange={e=>mutate(it=>({...it,intro:e.target.value}))} placeholder="Write an opening paragraph for the itinerary — what makes this journey special, the tone you want to set. Appears between the cover and Day 1." style={{width:"100%",fontFamily:F.body,fontSize:12,color:C.text,border:`1px solid ${C.grey200}`,borderRadius:6,padding:"8px 12px",resize:"vertical",minHeight:90,outline:"none"}}/>
                    </SectionBox>
                    <SectionBox title="Host Introduction (Simon & Kerry)">
                      <textarea value={active.hostBio||""} onChange={e=>mutate(it=>({...it,hostBio:e.target.value}))} placeholder="A short introduction to Simon and Kerry as hosts. Leave blank to hide." style={{width:"100%",fontFamily:F.body,fontSize:12,color:C.text,border:`1px solid ${C.grey200}`,borderRadius:6,padding:"8px 12px",resize:"vertical",minHeight:70,outline:"none"}}/>
                    </SectionBox>
                    <SectionBox title="Before You Arrive">
                      <textarea value={active.beforeYouArrive||""} onChange={e=>mutate(it=>({...it,beforeYouArrive:e.target.value}))} placeholder="Practical information for guests — getting here, what to pack, mobile coverage, dining notes, emergency contacts. Leave blank to hide." style={{width:"100%",fontFamily:F.body,fontSize:12,color:C.text,border:`1px solid ${C.grey200}`,borderRadius:6,padding:"8px 12px",resize:"vertical",minHeight:160,outline:"none"}}/>
                    </SectionBox>
                    <SectionBox title="Terms & Conditions">
                      <textarea value={active.terms||""} onChange={e=>mutate(it=>({...it,terms:e.target.value}))} placeholder="Terms and conditions. Leave blank to hide." style={{width:"100%",fontFamily:F.body,fontSize:11,color:C.text,border:`1px solid ${C.grey200}`,borderRadius:6,padding:"8px 12px",resize:"vertical",minHeight:130,outline:"none"}}/>
                    </SectionBox>
                    <SectionBox title="Email Introduction">
                      <div style={{fontFamily:F.body,fontSize:11,color:C.grey400,marginBottom:6}}>Opening paragraph for the Gmail draft email — personal note before the itinerary summary. Leave blank for the default.</div>
                      <textarea value={active.emailIntro||""} onChange={e=>mutate(it=>({...it,emailIntro:e.target.value}))} placeholder={`Hi ${active.clientName||"[name]"},\n\nThank you for your interest in a private journey with us. I've put together the following itinerary based on what we discussed...`} style={{width:"100%",fontFamily:F.body,fontSize:12,color:C.text,border:`1px solid ${C.grey200}`,borderRadius:6,padding:"8px 12px",resize:"vertical",minHeight:80,outline:"none"}}/>
                    </SectionBox>
                    <SectionBox title="Internal Notes (never shown to client or agent)">
                      <textarea value={active.internalNotes||""} onChange={e=>mutate(it=>({...it,internalNotes:e.target.value}))} placeholder="Operational reminders, supplier contacts, logistics, follow-up notes..." style={{width:"100%",fontFamily:F.body,fontSize:12,color:C.terra,border:`1px solid ${C.terra}30`,borderRadius:6,padding:"8px 12px",resize:"vertical",minHeight:70,outline:"none",background:"#fff8f6"}}/>
                    </SectionBox>
                    <SectionBox title="Footer Note (optional)">
                      <textarea value={active.notes||""} onChange={e=>mutate(it=>({...it,notes:e.target.value}))} placeholder="Any additional note to appear in the itinerary footer..." style={{width:"100%",fontFamily:F.body,fontSize:12,color:C.text,border:`1px solid ${C.grey200}`,borderRadius:6,padding:"8px 12px",resize:"vertical",minHeight:48,outline:"none"}}/>
                    </SectionBox>
                  </>
                )}

                {/* Attachments tab */}
                {editTab==="attachments"&&(
                  <SectionBox title="Document Attachments">
                    <div style={{fontFamily:F.body,fontSize:12,color:C.grey600,marginBottom:12,lineHeight:1.5}}>
                      Attach PDFs to this itinerary — rate sheets, partner information packs, the See South Australia Collective dossier, wine region maps. Attachments are listed in the itinerary footer and stored in the browser.
                    </div>
                    <AttachmentManager attachments={active.attachments} onUpdate={atts=>mutate(it=>({...it,attachments:atts}))}/>
                  </SectionBox>
                )}

              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
