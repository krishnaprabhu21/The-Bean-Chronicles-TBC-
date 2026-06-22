import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SEO } from '../components/ui/SEO';
import { useTheme } from '../contexts/ThemeContext';
import { BackButton } from '../components/ui/BackButton';

// ── Device data ─────────────────────────────────────────────────────────────

const devices = [
  {
    id: "espresso-machine",
    name: "Espresso Machine",
    tagline: "The Foundation of Café Culture",
    category: "Pressure Brewing",
    origin: "Milan, Italy — 1901",
    brewTime: "25–30 sec",
    difficulty: 5,
    grind: "Extra Fine",
    ratio: "1 : 2",
    accentColor: "#C9A84C",
    description:
      "Forces near-boiling water through a tightly packed puck of finely ground coffee at 9 bars of pressure. The result is a concentrated 30ml shot topped with a reddish-gold layer of crema — emulsified coffee oils that form under pressure. Invented by Luigi Bezzera and patented in 1901, the espresso machine transformed coffee from a domestic ritual into a public theatre. Mastery demands exact grind size, consistent tamping pressure (roughly 30 lbs), precise dose, and the right water temperature (91–96°C). Even a 0.5-second variation in shot time can shift the cup from bright to bitter.",
    flavourProfile: [
      "Concentrated",
      "Bold",
      "Crema-Rich",
      "Intense",
      "Complex",
    ],
    tip: "Weigh your output, not just your dose. A 1:2 ratio (18g in → 36g out) in 27–30 seconds is the modern specialty standard.",
    specs: [
      { label: "Pressure", value: "9 bar" },
      { label: "Water Temp", value: "91–96 °C" },
      { label: "Shot Volume", value: "25–40 ml" },
    ],
  },
  {
    id: "french-press",
    name: "French Press",
    tagline: "Immersion in Its Purest Form",
    category: "Immersion Brewing",
    origin: "France — 1929",
    brewTime: "4 minutes",
    difficulty: 2,
    grind: "Coarse",
    ratio: "1 : 15",
    accentColor: "#A08040",
    description:
      "Coarsely ground coffee steeps fully submerged in hot water for four minutes before a stainless-steel mesh plunger presses the grounds to the bottom. Unlike paper-filtered methods, the French Press retains the natural oils (cafestol and kahweol) that paper absorbs, producing a heavier body with a rich, textured mouthfeel. Patented by Attilio Calimani in Milan in 1929, it remains one of the most forgiving brewers available — there are few ways to catastrophically ruin it. The main variable to master is grind size: too fine and grounds pass through the mesh; too coarse and the cup will taste weak.",
    flavourProfile: ["Full Body", "Rich", "Oily", "Earthy", "Robust"],
    tip: "Let the press sit for 4 full minutes — no stirring after the crust forms. Pour immediately after pressing to stop extraction.",
    specs: [
      { label: "Water Temp", value: "93–96 °C" },
      { label: "Steep Time", value: "4 min" },
      { label: "Filter", value: "Metal mesh" },
    ],
  },
  {
    id: "v60",
    name: "Pour Over (V60)",
    tagline: "Precision Poured to Perfection",
    category: "Filter Brewing",
    origin: "Japan — 2005",
    brewTime: "3–4 minutes",
    difficulty: 3,
    grind: "Medium-Fine",
    ratio: "1 : 16",
    accentColor: "#7A9E6A",
    description:
      "Hario's V60 — named for its 60° cone angle — is the defining dripper of the third-wave specialty movement. Hot water is poured in slow, deliberate spirals over coffee held in a paper filter inside the ribbed cone. The spiral ribs channel air upward, preventing the filter from sealing against the wall, which ensures even water flow. Paper filtration removes all oils and suspended solids, producing a cup of exceptional clarity and brightness. The technique demands a gooseneck kettle for flow control and a scale for precision. A proper bloom pour (2× the coffee weight in water) for 30–45 seconds degasses the grounds and promotes even extraction.",
    flavourProfile: ["Clean", "Bright", "Floral", "Complex", "Tea-like"],
    tip: "Pour in three stages: bloom (45s), centre spiral, then outer spiral. Keep total brew time under 3:30 for medium-light roasts.",
    specs: [
      { label: "Water Temp", value: "90–96 °C" },
      { label: "Filter", value: "Paper (rinse first)" },
      { label: "Bloom", value: "30–45 sec" },
    ],
  },
  {
    id: "aeropress",
    name: "AeroPress",
    tagline: "The Most Versatile Brewer Ever Made",
    category: "Pressure + Immersion",
    origin: "California, USA — 2005",
    brewTime: "1–2 minutes",
    difficulty: 3,
    grind: "Medium-Fine to Fine",
    ratio: "1 : 15 (variable)",
    accentColor: "#5A7A9A",
    description:
      "Invented by Frisbee entrepreneur Alan Adler in 2005, the AeroPress is a plastic cylinder that combines immersion steeping with gentle manual air pressure. Coffee and hot water steep briefly before a plunger is pressed downward through a micro-filter (paper or metal). Its unique versatility is unmatched: grind size, temperature, steep time, water volume, and even orientation (standard or inverted) can all be radically altered to produce anything from an espresso-style concentrate to a clean Americano-style cup. World AeroPress Championships have spawned thousands of documented recipes. It is also virtually unbreakable and weighs under 200g — the ideal travel brewer.",
    flavourProfile: [
      "Versatile",
      "Low Acid",
      "Smooth",
      "Syrupy",
      "Concentrated",
    ],
    tip: "Try the inverted method: flip the AeroPress upside down, steep 1–2 minutes, then flip and press. It eliminates premature drip-through.",
    specs: [
      { label: "Water Temp", value: "80–96 °C" },
      { label: "Pressure", value: "Manual (~0.35 bar)" },
      { label: "Filter", value: "Paper or metal disk" },
    ],
  },
  {
    id: "chemex",
    name: "Chemex",
    tagline: "Where Science Meets Elegance",
    category: "Filter Brewing",
    origin: "New York, USA — 1941",
    brewTime: "4–5 minutes",
    difficulty: 3,
    grind: "Medium-Coarse",
    ratio: "1 : 15",
    accentColor: "#9A8A6A",
    description:
      "Designed by chemist and inventor Peter Schlumbohm, the Chemex is simultaneously a laboratory instrument and a design icon — it has been part of the Museum of Modern Art's permanent collection since 1943. The hourglass-shaped borosilicate glass vessel uses paper filters that are 20–30% thicker than standard filters, removing nearly all oils and micro-fines. The result is an exceptionally clean, transparent brew with a delicate sweetness. The polished wood collar and leather tie at the waist serve a functional purpose — insulating the hand from the glass — while contributing to its timeless aesthetic. Chemex rewards patience: a properly bloomed and slowly poured cup is among the cleanest expressions possible.",
    flavourProfile: ["Crystal Clear", "Clean", "Delicate", "Sweet", "Refined"],
    tip: "Rinse the folded paper filter with 100ml of hot water before adding coffee — it eliminates papery taste and pre-warms the vessel.",
    specs: [
      { label: "Water Temp", value: "93–96 °C" },
      { label: "Filter", value: "20–30% thicker paper" },
      { label: "Design", value: "MoMA collection, 1943" },
    ],
  },
  {
    id: "moka-pot",
    name: "Moka Pot",
    tagline: "Italy's Stovetop Espresso",
    category: "Stovetop Pressure",
    origin: "Crusinallo, Italy — 1933",
    brewTime: "5–8 minutes",
    difficulty: 2,
    grind: "Fine",
    ratio: "1 : 7",
    accentColor: "#8A6040",
    description:
      "Alfonso Bialetti's octagonal aluminium Moka Express became one of the most recognisable objects of 20th-century Italy, eventually entering 90% of Italian homes. Steam pressure from boiling water in the sealed lower chamber forces hot water up through a basket of finely ground coffee and into the upper collection chamber. The pressure produced (1–2 bar) is far below espresso machines, so the brew is not technically espresso — but it is concentrated, bold, and far stronger than drip. The distinct metallic-edged, slightly bitter character of Moka is an acquired taste that millions prize. Stainless steel versions are induction-compatible; the classic aluminium reacts mildly with acidic coffee but some argue this adds to the character.",
    flavourProfile: [
      "Bold",
      "Robust",
      "Bittersweet",
      "Strong",
      "Metallic-Edge",
    ],
    tip: "Use pre-boiled water in the lower chamber — starting with cold water over-extracts the grounds before pressure builds.",
    specs: [
      { label: "Pressure", value: "1–2 bar" },
      { label: "Water Temp", value: "93–96 °C (pre-boil)" },
      { label: "Material", value: "Aluminium or steel" },
    ],
  },
  {
    id: "cold-brew",
    name: "Cold Brew",
    tagline: "Time as the Extraction Force",
    category: "Cold Immersion",
    origin: "Kyoto, Japan — 17th century",
    brewTime: "12–24 hours",
    difficulty: 1,
    grind: "Extra Coarse",
    ratio: "1 : 8 (concentrate)",
    accentColor: "#4A7A8A",
    description:
      "Cold brew uses time rather than heat to extract coffee. Coarsely ground coffee is submerged in cold or room-temperature water for 12 to 24 hours, then filtered. The absence of heat means different chemical compounds are extracted: fewer acids and bitter chlorogenic acids dissolve in cold water, while sugars and volatile aromatics are preserved. The result is a naturally sweet, low-acid concentrate with notable body and chocolatey depth. The concentrate is typically diluted 1:1 with water or milk. Japanese Kyoto-style drip cold brew — where ice-cold water drips through grounds one drop per second over 8–12 hours — is the refined ancestor of modern cold brew.",
    flavourProfile: ["Sweet", "Low Acid", "Chocolatey", "Smooth", "Full Body"],
    tip: "Use a 1:8 ratio of coffee to water for concentrate. Refrigerate during steeping for safety and to slow extraction to 18–24 hours.",
    specs: [
      { label: "Temp", value: "Cold / Room temp" },
      { label: "Steep", value: "12–24 hours" },
      { label: "Filter", value: "Fine mesh + paper" },
    ],
  },
  {
    id: "siphon",
    name: "Siphon (Vacuum Pot)",
    tagline: "Theater and Science in Equal Measure",
    category: "Vapor Pressure",
    origin: "Germany/France — 1830s",
    brewTime: "5–8 minutes",
    difficulty: 5,
    grind: "Medium",
    ratio: "1 : 15",
    accentColor: "#9A6080",
    description:
      "One of the most visually dramatic coffee brewers ever devised. Two glass (or acrylic) chambers are connected by a tube sealed with a cloth or glass bead filter. Heat — traditionally a spirit lamp, now often a halogen beam — causes water in the lower globe to expand and travel upward through the tube into the upper chamber, where it mixes with coffee grounds. When heat is removed, the partial vacuum created as steam condenses pulls the brewed coffee back down through the filter, leaving the grounds behind. First patented in the 1830s by Loeff of Berlin, perfected by French designer Mme. Vassieux in 1840, and elevated to a ceremony by Japanese kissaten café culture from the 1940s onward. Produces a cup of remarkable clarity combined with full body — a combination almost impossible to achieve through other methods.",
    flavourProfile: ["Clarity", "Full Body", "Vivid", "Clean", "Exceptional"],
    tip: "Stir gently when grounds first contact the water, and again 30 seconds before removing heat. This creates even extraction.",
    specs: [
      { label: "Heat Source", value: "Beam / spirit lamp" },
      { label: "Filter", value: "Cloth or glass bead" },
      { label: "Chambers", value: "Two-globe glass" },
    ],
  },
  {
    id: "cezve",
    name: "Cezve / Ibrik",
    tagline: "The World's Oldest Brewing Method",
    category: "Unfiltered Boiling",
    origin: "Ottoman Empire — 15th century",
    brewTime: "3–5 minutes",
    difficulty: 3,
    grind: "Powder-Fine",
    ratio: "1 : 12",
    accentColor: "#C07A40",
    description:
      "The cezve (Turkish) or ibrik (Arabic) is a small, long-handled copper or brass pot used to prepare coffee in a method unchanged for over 500 years. Extra-fine ground coffee — ground to a powder finer than espresso — is combined with cold water and often green cardamom pods or sugar, then placed over very low heat. The mixture is brought slowly to a foam three times, with the pot removed from heat before it boils each time, allowing the foam to subside. The coffee is poured unfiltered into small cups; grounds settle over two minutes and are not consumed. The method is the centerpiece of hospitality culture across Turkey, Greece, the Arab world, Ethiopia, and the Balkans — and UNESCO has listed it as Intangible Cultural Heritage.",
    flavourProfile: ["Intense", "Thick", "Spiced", "Bittersweet", "Ceremonial"],
    tip: "Never boil — the moment foam rises to the rim is the pull-from-heat signal. Three foamings build flavour without bitterness.",
    specs: [
      { label: "Material", value: "Copper or brass" },
      { label: "Grind", value: "Powder (ultra-fine)" },
      { label: "Heritage", value: "UNESCO Intangible CH" },
    ],
  },
  {
    id: "burr-grinder",
    name: "Burr Grinder",
    tagline: "The Most Important Tool You Own",
    category: "Grind Equipment",
    origin: "Europe — early 20th century (refined 1990s)",
    brewTime: "30–60 sec",
    difficulty: 1,
    grind: "Fully adjustable",
    ratio: "N/A",
    accentColor: "#6A8A6A",
    description:
      'A burr grinder uses two abrasive rotating discs — flat or conical — set at a precise, adjustable gap. Beans are crushed between the burrs rather than chopped, producing uniformly sized particles across a consistent distribution. Grind uniformity is the single most critical factor in extraction quality: inconsistent particle sizes mean some grounds over-extract (bitter) while others under-extract (sour) simultaneously, masking the coffee\'s true character. Blade grinders, by contrast, chop randomly and generate heat — two qualities that actively harm the cup. Conical burrs (lower RPM, less heat) suit light-roast specialty coffee; flat burrs (higher RPM, "flat" flavour profile) suit espresso. For most home brewers, a quality burr grinder is a better investment than a more expensive brewer.',
    flavourProfile: [
      "Unlocks Consistency",
      "Reduces Bitterness",
      "Clarity",
      "Control",
      "Uniformity",
    ],
    tip: "Buy the best grinder your budget allows before upgrading the brewer. A ₹15,000 grinder with a ₹5,000 brewer beats the reverse every time.",
    specs: [
      { label: "Burr Types", value: "Flat or conical" },
      { label: "Settings", value: "10–80 grind steps" },
      { label: "Key metric", value: "Particle uniformity" },
    ],
  },
  {
    id: "south-indian-filter",
    name: "South Indian Filter",
    tagline: "Decoction Dripped. Froth Poured.",
    category: "Gravity Drip",
    origin: "Tamil Nadu, India — pre-1930s",
    brewTime: "8–10 minutes",
    difficulty: 2,
    grind: "Fine-Medium",
    ratio: "1 : 3 (decoction : milk)",
    accentColor: "#B5692A",
    description:
      'The South Indian coffee filter is a two-chamber stainless steel device at the heart of one of the world\'s most distinctive coffee traditions. Fine-ground coffee — typically a Robusta or Arabica blend with 15–20% roasted chicory — is packed into the upper perforated chamber and pressed gently with a flat disc. Boiling water is poured over the grounds and drips slowly into the lower collection chamber over 8–10 minutes, producing a dense, dark "decoction." This decoction is then combined with hot, frothed whole milk in a 1:3 ratio and aerated by pouring rhythmically between a traditional stainless steel tumbler and its saucer-like dabara until a fine foam builds. The result is "Degree Coffee" — so named because milk quality was once tested at 100 degrees — an aromatic, sweetened brew unlike any other coffee in the world. It is the morning ritual of millions across Tamil Nadu, Karnataka, Kerala, and Andhra Pradesh.',
    flavourProfile: [
      "Chicory-Sweet",
      "Roasty",
      "Creamy",
      "Full Body",
      "Aromatic",
    ],
    tip: "Press the disc firmly so the decoction falls in slow drops, not a stream. Use full-fat milk — thin milk cannot hold the foam when poured.",
    specs: [
      { label: "Blend", value: "Coffee + 15–20% chicory" },
      { label: "Milk Ratio", value: "1 decoction : 3 milk" },
      { label: "Vessel", value: "Dabara-tumbler set" },
    ],
  },
  {
    id: "phin-filter",
    name: "Phin Filter",
    tagline: "Vietnam's Patient, Potent Drip",
    category: "Gravity Drip",
    origin: "Vietnam — early 20th century",
    brewTime: "5–8 minutes",
    difficulty: 1,
    grind: "Medium-Coarse",
    ratio: "1 : 10",
    accentColor: "#8A9A60",
    description:
      "The Phin is a small four-part aluminium or stainless steel filter that sits atop a glass and brews a single, intensely concentrated serving through slow gravity drip. Coffee is placed in the cylindrical chamber, a perforated press is screwed or set loosely on top, and near-boiling water is added in stages. The brew drips unhurriedly over 5–8 minutes, producing a thick, dark liquid with notable sweetness and body. It is most famously served as Cà phê sữa đá — Phin brew poured over a generous measure of sweetened condensed milk and then tumbled over ice — a drink as much about texture and contrast as flavour. Vietnamese Robusta from the Central Highlands (Buôn Ma Thuột) dominates the blend: higher in caffeine, lower in acidity, with a distinctive chocolatey and earthy depth that stands up to condensed milk without disappearing. The Phin requires no electricity, produces no waste, and costs almost nothing — making it both elemental and universal.",
    flavourProfile: ["Strong", "Chocolatey", "Earthy", "Sweet", "Robusta-Rich"],
    tip: "Use a loose press (not screwed tight) and wait 30 seconds after the first pour before adding the remaining water — this mimics a bloom.",
    specs: [
      { label: "Parts", value: "4-piece (base, body, press, lid)" },
      { label: "Water Temp", value: "94–96 °C" },
      { label: "Serve style", value: "Over condensed milk + ice" },
    ],
  },
  {
    id: "kalita-wave",
    name: "Kalita Wave",
    tagline: "Flat Bottom, Even Extraction",
    category: "Filter Brewing",
    origin: "Japan — 2010",
    brewTime: "3–4 minutes",
    difficulty: 2,
    grind: "Medium",
    ratio: "1 : 16",
    accentColor: "#4A6A8A",
    description:
      "Designed by the Kalita Company of Tokyo in 2010, the Wave dripper introduced two innovations that changed pour-over brewing. First, a flat-bottom basket rather than a conical funnel — this creates an even coffee bed that extracts uniformly regardless of pour technique, making it the most forgiving of the precision drippers. Second, a proprietary wave-crimped paper filter whose pleated sides prevent the filter from sealing against the dripper walls, eliminating the channelling and uneven flow that plagued flat-bottomed drippers before. Three small holes at the base (rather than the single large opening of the V60) further regulate flow rate and make the brew less sensitive to grind variation. The result is a consistently sweet, well-balanced cup with good body that forgives imprecision in pouring — making it the ideal gateway dripper for those moving from immersion to filter brewing.",
    flavourProfile: [
      "Balanced",
      "Sweet",
      "Approachable",
      "Medium Body",
      "Consistent",
    ],
    tip: "Aim for a total brew time of 3:00–3:30. Grind slightly coarser than V60 — the flat bed and 3 holes slow flow, so the Wave needs less restriction from the grounds.",
    specs: [
      { label: "Water Temp", value: "91–94 °C" },
      { label: "Filter", value: "Wave-crimped paper" },
      { label: "Drain holes", value: "3 flat-bottom holes" },
    ],
  },
  {
    id: "nel-drip",
    name: "Nel Drip",
    tagline: "Cloth, Patience, and Clarity",
    category: "Cloth Filtration",
    origin: "Japan — 1920s (kissaten tradition)",
    brewTime: "6–10 minutes",
    difficulty: 4,
    grind: "Medium-Coarse",
    ratio: "1 : 12",
    accentColor: "#9A7060",
    description:
      "Nel drip — from the Japanese romanisation of \"flannel\" — uses a cloth filter sewn into a metal ring and suspended from a wooden or stainless stand over a glass server. Unlike paper filters, the flannel retains some oils while still removing grounds, producing a cup that sits between the clarity of pour-over and the body of French press. The cloth must be kept wet at all times: stored in water in the refrigerator between uses and boiled to clean, never dried or it loses permeability. Preparation is slow and deliberate — a long bloom, then water added in small, patient pours over 6–10 minutes. In Japan's kissaten (traditional coffee shops), masters spend decades perfecting their nel technique and the ritual of hand-selecting each bean from individual origin lots. The nel drip is considered by many Japanese coffee purists to be the most nuanced expression of a coffee's terroir, revealing aromatic complexity that neither paper nor metal filtration can match.",
    flavourProfile: [
      "Silky",
      "Complex",
      "Oil-Balanced",
      "Vivid Aroma",
      "Refined",
    ],
    tip: "Never let the cloth dry — store it submerged in cold water in the fridge. Replace it every 3–4 months: a worn cloth over-extracts and tastes musty.",
    specs: [
      { label: "Filter", value: "Flannel cloth (replace 3–4 mo)" },
      { label: "Water Temp", value: "88–93 °C" },
      { label: "Storage", value: "Submerged in water, refrigerated" },
    ],
  },
  {
    id: "channi",
    name: "Channi",
    tagline: "India's Ancient Strainer, Every Kitchen's Secret",
    category: "Strainer Brewing",
    origin: "Indian Subcontinent — centuries-old",
    brewTime: "3–5 minutes",
    difficulty: 1,
    grind: "Coarse to Medium",
    ratio: "1 : 10",
    accentColor: "#C07A40",
    description:
      "The channi (Hindi: छन्नी) is a humble wire-mesh strainer — one of the oldest and most democratic coffee-brewing tools on the Indian subcontinent. Coarsely ground coffee is steeped directly in a small pot or saucepan of hot water for three to five minutes, then poured through the fine-mesh strainer into a cup or tumbler below. The mesh catches the grounds while allowing the brewed liquid — along with a small amount of desirable oils and micro-fines — to pass freely through. In Indian households, the same channi serves tea one morning and coffee the next, making it the most multi-purpose brewer in existence. The technique produces a cup that is bolder and more textured than paper-filtered methods, with a noticeable body and warmth that pairs beautifully with hot milk and sugar in the traditional Indian style. Found in every bazaar across the country for less than fifty rupees, the channi democratises good coffee: no electricity, no consumables, no technique beyond patience. It is the direct ancestor of the South Indian filter decoction method, and in many rural kitchens across Tamil Nadu, Karnataka, and Maharashtra, it remains the only brewer anyone has ever owned.",
    flavourProfile: [
      "Bold",
      "Full Body",
      "Earthy",
      "Milk-Friendly",
      "Rustic",
    ],
    tip: "Steep with the lid on the pot to trap heat and aromatic oils. Pour slowly through the channi — rushing creates turbulence that pushes fine particles through the mesh.",
    specs: [
      { label: "Filter", value: "Fine wire mesh (stainless steel)" },
      { label: "Water Temp", value: "90–96 °C" },
      { label: "Cost", value: "< ₹50 — universal kitchen tool" },
    ],
  },
];

// ── SVG device icons ─────────────────────────────────────────────────────────

function DeviceIcon({ id, color = "#C9A84C" }) {
  const s = {
    stroke: color,
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none",
  };
  const icons = {
    "espresso-machine": (
      <svg viewBox="0 0 64 80" width="100%" height="100%" {...s}>
        <rect x="8" y="28" width="48" height="36" rx="3" />
        <rect x="14" y="20" width="36" height="12" rx="2" />
        <path d="M24 64 L24 72 Q32 76 40 72 L40 64" />
        <ellipse cx="32" cy="44" rx="10" ry="10" />
        <circle cx="32" cy="44" r="5" />
        <rect x="50" y="36" width="8" height="6" rx="1" />
        <path d="M12 64 L52 64" />
        <path d="M22 20 L22 14 Q22 10 26 10 L38 10 Q42 10 42 14 L42 20" />
        <circle cx="16" cy="36" r="2" />
        <circle cx="16" cy="44" r="2" />
      </svg>
    ),
    "french-press": (
      <svg viewBox="0 0 64 80" width="100%" height="100%" {...s}>
        <rect x="16" y="20" width="32" height="48" rx="2" />
        <line x1="16" y1="60" x2="48" y2="60" />
        <line x1="16" y1="32" x2="48" y2="32" />
        <line x1="32" y1="8" x2="32" y2="20" />
        <rect x="26" y="6" width="12" height="5" rx="2" />
        <line x1="10" y1="32" x2="54" y2="32" />
        <line x1="16" y1="32" x2="48" y2="32" />
        <rect x="28" y="8" width="8" height="24" rx="1" />
        <line x1="14" y1="60" x2="50" y2="60" />
        <path d="M20 68 Q32 72 44 68" />
      </svg>
    ),
    v60: (
      <svg viewBox="0 0 64 80" width="100%" height="100%" {...s}>
        <path d="M14 16 L32 70 L50 16 Z" />
        <line x1="14" y1="16" x2="50" y2="16" />
        <line x1="20" y1="28" x2="44" y2="28" strokeOpacity="0.5" />
        <line x1="23" y1="38" x2="41" y2="38" strokeOpacity="0.5" />
        <line x1="26" y1="48" x2="38" y2="48" strokeOpacity="0.5" />
        <path d="M26 70 Q32 76 38 70" />
        <rect x="10" y="72" width="44" height="6" rx="1" />
        <line x1="10" y1="14" x2="54" y2="14" />
        <ellipse cx="32" cy="16" rx="18" ry="3" />
      </svg>
    ),
    aeropress: (
      <svg viewBox="0 0 64 80" width="100%" height="100%" {...s}>
        <rect x="18" y="20" width="28" height="46" rx="14" />
        <rect x="22" y="24" width="20" height="38" rx="10" />
        <line x1="32" y1="8" x2="32" y2="20" />
        <ellipse cx="32" cy="20" rx="14" ry="3" />
        <rect x="26" y="6" width="12" height="5" rx="2" />
        <rect x="24" y="50" width="16" height="14" rx="8" />
        <line x1="18" y1="40" x2="46" y2="40" />
        <circle cx="32" cy="62" r="3" />
        <line x1="26" y1="12" x2="38" y2="12" />
      </svg>
    ),
    chemex: (
      <svg viewBox="0 0 64 80" width="100%" height="100%" {...s}>
        <path d="M20 8 L32 40 L44 8 Z" />
        <ellipse cx="32" cy="8" rx="12" ry="3" />
        <path d="M24 40 Q16 48 16 58 Q16 68 32 70 Q48 68 48 58 Q48 48 40 40 Z" />
        <rect x="22" y="36" width="20" height="6" rx="1" />
        <path d="M20 44 L44 44" />
        <path
          d="M18 50 Q22 48 26 50 Q30 52 34 50 Q38 48 42 50 Q46 52 46 52"
          strokeOpacity="0.5"
        />
        <path d="M24 36 Q24 32 28 30 L36 30 Q40 32 40 36" />
      </svg>
    ),
    "moka-pot": (
      <svg viewBox="0 0 64 80" width="100%" height="100%" {...s}>
        <path d="M20 44 L18 68 Q18 72 32 72 Q46 72 46 68 L44 44 Z" />
        <rect x="20" y="36" width="24" height="10" rx="1" />
        <path d="M22 36 Q20 28 24 20 Q28 12 32 10 Q36 12 40 20 Q44 28 42 36" />
        <path d="M32 10 L32 4" />
        <ellipse cx="32" cy="4" rx="6" ry="2" />
        <line x1="46" y1="52" x2="52" y2="48" />
        <path d="M52 48 Q56 44 54 42" />
        <line x1="18" y1="52" x2="12" y2="48" />
        <path d="M12 48 Q8 44 10 42" />
      </svg>
    ),
    "cold-brew": (
      <svg viewBox="0 0 64 80" width="100%" height="100%" {...s}>
        <rect x="14" y="12" width="36" height="58" rx="6" />
        <line x1="14" y1="32" x2="50" y2="32" />
        <rect x="20" y="6" width="24" height="8" rx="4" />
        <circle cx="26" cy="48" r="2" fill={color} strokeWidth="0" />
        <circle cx="32" cy="54" r="2" fill={color} strokeWidth="0" />
        <circle cx="38" cy="48" r="2" fill={color} strokeWidth="0" />
        <circle cx="32" cy="42" r="2" fill={color} strokeWidth="0" />
        <path d="M22 32 L22 64" strokeOpacity="0.3" />
        <path d="M42 32 L42 64" strokeOpacity="0.3" />
        <path d="M14 56 L50 56" strokeOpacity="0.3" />
      </svg>
    ),
    siphon: (
      <svg viewBox="0 0 64 80" width="100%" height="100%" {...s}>
        <ellipse cx="32" cy="18" rx="16" ry="12" />
        <ellipse cx="32" cy="58" rx="16" ry="14" />
        <line x1="32" y1="30" x2="32" y2="44" />
        <rect x="28" y="29" width="8" height="4" rx="2" />
        <rect x="28" y="42" width="8" height="4" rx="2" />
        <path d="M18 58 Q10 60 10 72 L54 72 Q54 60 46 58" />
        <line x1="16" y1="18" x2="10" y2="18" />
        <line x1="48" y1="18" x2="54" y2="18" />
        <circle cx="32" cy="18" r="6" strokeOpacity="0.5" />
      </svg>
    ),
    cezve: (
      <svg viewBox="0 0 64 80" width="100%" height="100%" {...s}>
        <path d="M18 36 Q18 20 32 18 Q46 20 46 36 L44 56 Q44 62 32 62 Q20 62 20 56 Z" />
        <path d="M46 26 Q56 24 58 30 Q60 36 54 38 L46 38" />
        <path d="M10 36 L18 36" />
        <ellipse cx="32" cy="18" rx="14" ry="4" />
        <path d="M26 12 Q28 8 32 6 Q36 8 38 12" />
        <line x1="18" y1="46" x2="46" y2="46" strokeOpacity="0.4" />
      </svg>
    ),
    "burr-grinder": (
      <svg viewBox="0 0 64 80" width="100%" height="100%" {...s}>
        <rect x="14" y="8" width="36" height="20" rx="4" />
        <rect x="18" y="28" width="28" height="36" rx="3" />
        <ellipse cx="32" cy="18" rx="10" ry="6" />
        <ellipse cx="32" cy="28" rx="12" ry="4" />
        <line x1="18" y1="44" x2="46" y2="44" />
        <rect x="24" y="62" width="16" height="4" rx="2" />
        <path d="M32 8 L32 4" />
        <ellipse cx="32" cy="4" rx="6" ry="2" />
        <circle cx="32" cy="36" r="4" />
        <line x1="28" y1="36" x2="36" y2="36" strokeOpacity="0.5" />
        <line x1="32" y1="32" x2="32" y2="40" strokeOpacity="0.5" />
      </svg>
    ),
    "south-indian-filter": (
      <svg viewBox="0 0 64 80" width="100%" height="100%" {...s}>
        {/* Lower collection chamber (dabara) */}
        <rect x="12" y="50" width="40" height="24" rx="2" />
        <path d="M12 72 Q12 76 32 76 Q52 76 52 72" />
        {/* Upper filter chamber */}
        <rect x="16" y="16" width="32" height="36" rx="2" />
        {/* Pressing disc */}
        <rect x="20" y="26" width="24" height="3" rx="1.5" />
        {/* Press knob and rod */}
        <line x1="32" y1="16" x2="32" y2="26" />
        <circle cx="32" cy="13" r="4" />
        <line x1="28" y1="13" x2="36" y2="13" />
        {/* Perforated base of upper chamber — drip holes */}
        <circle cx="26" cy="50" r="1" fill={color} strokeWidth="0" />
        <circle cx="32" cy="50" r="1" fill={color} strokeWidth="0" />
        <circle cx="38" cy="50" r="1" fill={color} strokeWidth="0" />
        {/* Decoction drip line */}
        <line
          x1="32"
          y1="52"
          x2="32"
          y2="56"
          strokeOpacity="0.4"
          strokeDasharray="2 2"
        />
        {/* Rim of lower chamber */}
        <line x1="10" y1="50" x2="54" y2="50" />
      </svg>
    ),
    "phin-filter": (
      <svg viewBox="0 0 64 80" width="100%" height="100%" {...s}>
        {/* Glass/cup below */}
        <path d="M20 56 L22 74 Q22 78 32 78 Q42 78 42 74 L44 56 Z" />
        <line x1="20" y1="56" x2="44" y2="56" />
        {/* Base plate (sits on cup rim) */}
        <rect x="18" y="50" width="28" height="5" rx="1" />
        {/* Perforations on base plate */}
        <line x1="24" y1="52" x2="24" y2="54" strokeOpacity="0.5" />
        <line x1="32" y1="52" x2="32" y2="54" strokeOpacity="0.5" />
        <line x1="40" y1="52" x2="40" y2="54" strokeOpacity="0.5" />
        {/* Filter body / chamber */}
        <rect x="20" y="22" width="24" height="28" rx="2" />
        {/* Inner press plate */}
        <rect x="24" y="32" width="16" height="2.5" rx="1" />
        <line x1="32" y1="22" x2="32" y2="32" />
        {/* Lid */}
        <ellipse cx="32" cy="22" rx="12" ry="3" />
        <path d="M29 19 Q32 15 35 19" />
        {/* Drip dots */}
        <circle cx="32" cy="58" r="1.2" fill={color} strokeWidth="0" />
        <circle cx="32" cy="64" r="1.2" fill={color} strokeWidth="0" />
      </svg>
    ),
    "kalita-wave": (
      <svg viewBox="0 0 64 80" width="100%" height="100%" {...s}>
        {/* Outer dripper body — trapezoidal */}
        <path d="M12 18 L20 66 L44 66 L52 18 Z" />
        {/* Top rim ellipse */}
        <ellipse cx="32" cy="18" rx="20" ry="4" />
        {/* Flat bottom */}
        <line x1="20" y1="66" x2="44" y2="66" />
        {/* Three drain holes */}
        <circle cx="26" cy="66" r="1.5" fill={color} strokeWidth="0" />
        <circle cx="32" cy="66" r="1.5" fill={color} strokeWidth="0" />
        <circle cx="38" cy="66" r="1.5" fill={color} strokeWidth="0" />
        {/* Wave-crimped filter lines */}
        <path
          d="M18 34 Q22 31 26 34 Q30 37 34 34 Q38 31 42 34"
          strokeOpacity="0.45"
        />
        <path
          d="M20 48 Q24 45 28 48 Q32 51 36 48 Q40 45 44 48"
          strokeOpacity="0.45"
        />
        {/* Server below */}
        <rect x="18" y="70" width="28" height="7" rx="1" />
        <path d="M18 77 Q18 80 32 80 Q46 80 46 77" />
      </svg>
    ),
    "nel-drip": (
      <svg viewBox="0 0 64 80" width="100%" height="100%" {...s}>
        {/* Stand legs */}
        <line x1="18" y1="22" x2="10" y2="76" />
        <line x1="46" y1="22" x2="54" y2="76" />
        <line x1="10" y1="76" x2="54" y2="76" />
        {/* Crossbar */}
        <line x1="14" y1="52" x2="50" y2="52" strokeOpacity="0.4" />
        {/* Hanging rod */}
        <line x1="32" y1="6" x2="32" y2="22" />
        <line x1="18" y1="22" x2="46" y2="22" />
        {/* Flannel cloth filter (teardrop/U-shape) */}
        <path d="M18 22 Q14 38 18 50 Q22 60 32 62 Q42 60 46 50 Q50 38 46 22" />
        {/* Cloth texture lines */}
        <path d="M21 30 Q32 28 43 30" strokeOpacity="0.3" />
        <path d="M19 40 Q32 38 45 40" strokeOpacity="0.3" />
        <path d="M20 50 Q32 48 44 50" strokeOpacity="0.3" />
        {/* Ring at top of cloth */}
        <ellipse cx="32" cy="22" rx="14" ry="3" />
        {/* Hook at top */}
        <path d="M30 6 Q32 2 34 6" />
      </svg>
    ),
    channi: (
      <svg viewBox="0 0 64 80" width="100%" height="100%" {...s}>
        {/* Long handle extending left */}
        <line x1="4" y1="30" x2="22" y2="36" />
        <ellipse cx="4" cy="30" rx="3" ry="2" />
        {/* Strainer bowl — shallow round shape */}
        <path d="M22 24 Q14 28 14 40 Q14 56 32 58 Q50 56 50 40 Q50 28 42 24 Z" />
        {/* Rim ellipse across the top of bowl */}
        <ellipse cx="32" cy="24" rx="10" ry="3" />
        {/* Mesh grid inside bowl — horizontal lines */}
        <line x1="18" y1="34" x2="46" y2="34" strokeOpacity="0.35" strokeDasharray="2 2" />
        <line x1="16" y1="42" x2="48" y2="42" strokeOpacity="0.35" strokeDasharray="2 2" />
        <line x1="17" y1="50" x2="47" y2="50" strokeOpacity="0.35" strokeDasharray="2 2" />
        {/* Mesh grid — vertical lines */}
        <line x1="24" y1="26" x2="22" y2="56" strokeOpacity="0.25" strokeDasharray="2 2" />
        <line x1="32" y1="25" x2="32" y2="57" strokeOpacity="0.25" strokeDasharray="2 2" />
        <line x1="40" y1="26" x2="42" y2="56" strokeOpacity="0.25" strokeDasharray="2 2" />
        {/* Drip drops falling below */}
        <circle cx="28" cy="66" r="1.5" fill={color} strokeWidth="0" />
        <circle cx="36" cy="70" r="1.5" fill={color} strokeWidth="0" />
        <circle cx="32" cy="62" r="1.2" fill={color} strokeWidth="0" opacity="0.6" />
        {/* Cup / tumbler below */}
        <path d="M20 72 L22 80 L42 80 L44 72 Z" strokeOpacity="0.45" />
        <line x1="20" y1="72" x2="44" y2="72" strokeOpacity="0.45" />
      </svg>
    ),
  };
  return icons[id] || null;
}

// ── Sub-components ───────────────────────────────────────────────────────────

function DifficultyDots({ level }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className="block w-1.5 h-1.5 rounded-full"
          style={{ background: n <= level ? "var(--color-accent)" : "rgba(80,120,60,0.3)" }}
        />
      ))}
    </div>
  );
}

function DeviceCard({ device, selected, onClick }) {
  const { theme } = useTheme()
  const isLight = theme === 'light'
  return (
    <motion.button
      onClick={() => onClick(selected ? null : device.id)}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="relative flex flex-col items-center gap-5 px-3 py-7 sm:py-8 text-center w-full transition-all duration-200"
      style={{
        border: `1px solid ${selected ? device.accentColor + "80" : "var(--color-border-strong)"}`,
        background: selected ? `${device.accentColor}0D` : "var(--color-card)",
        boxShadow: selected ? `0 0 28px ${device.accentColor}18` : "none",
        cursor: "pointer",
      }}
    >
      {selected && (
        <motion.div
          layoutId="deviceRing"
          className="absolute inset-0 pointer-events-none"
          style={{ border: `1.5px solid ${device.accentColor}` }}
        />
      )}

      {/* Icon */}
      <div
        className="w-14 h-[72px] sm:w-16 sm:h-20 flex items-center justify-center transition-opacity duration-200"
        style={{ opacity: selected ? 1 : 0.65 }}
      >
        <DeviceIcon
          id={device.id}
          color={selected ? device.accentColor : isLight ? "rgba(60,40,20,0.55)" : "rgba(232,223,208,0.7)"}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span
          className="block text-[8px] uppercase tracking-[0.22em] leading-none"
          style={{
            color: selected ? device.accentColor : "var(--color-accent)",
            fontFamily: "Space Mono, monospace",
          }}
        >
          {device.category}
        </span>
        <span
          className="block font-display text-base sm:text-lg leading-snug"
          style={{ color: "var(--color-text)", fontWeight: 600 }}
        >
          {device.name}
        </span>
      </div>
    </motion.button>
  );
}

function DeviceModal({ device, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const deviceIndex = devices.findIndex((d) => d.id === device.id);
  const specRow = [
    { label: "Grind", value: device.grind },
    { label: "Ratio", value: device.ratio },
    ...device.specs,
  ].slice(0, 3);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6 md:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 cursor-pointer"
        style={{
          background: "rgba(8,16,10,0.9)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
        onClick={onClose}
      />

      {/* Card */}
      <motion.div
        className="relative z-10 w-full overflow-hidden flex flex-col sm:flex-row"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-strong)",
          maxWidth: "60rem",
          maxHeight: "92vh",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
        }}
        initial={{ opacity: 0, y: 48, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 32, scale: 0.96 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* ── Left: Icon panel ─────────────────────────────────── */}
        <div
          className="flex-shrink-0 flex flex-col items-center justify-center px-10 py-12 sm:py-0 sm:w-64 md:w-76 relative"
          style={{
            background: `linear-gradient(155deg, ${device.accentColor}1A 0%, transparent 65%)`,
            borderBottom: "1px solid rgba(80,120,60,0.18)",
          }}
        >
          {/* Origin + brew time — desktop only, top of panel */}
          <div className="hidden sm:flex flex-col gap-6 absolute top-12 left-0 right-0 px-10">
            <div>
              <p
                className="text-[9px] uppercase tracking-[0.24em] mb-2"
                style={{
                  color: "var(--color-text-faint)",
                  fontFamily: "Space Mono, monospace",
                }}
              >
                Origin
              </p>
              <p className="text-sm leading-snug" style={{ color: "var(--color-accent)" }}>
                {device.origin}
              </p>
            </div>
            <div>
              <p
                className="text-[9px] uppercase tracking-[0.24em] mb-2"
                style={{
                  color: "var(--color-text-faint)",
                  fontFamily: "Space Mono, monospace",
                }}
              >
                Brew Time
              </p>
              <p className="text-sm" style={{ color: "var(--color-accent)" }}>
                {device.brewTime}
              </p>
            </div>
          </div>

          {/* Icon — centre of panel */}
          <div className="w-32 h-40 sm:w-36 sm:h-44">
            <DeviceIcon id={device.id} color={device.accentColor} />
          </div>

          {/* Category + difficulty — desktop only, bottom of panel */}
          <div className="hidden sm:flex flex-col items-center gap-4 absolute bottom-12 left-0 right-0 px-10">
            <span
              className="text-[9px] uppercase tracking-[0.28em] text-center"
              style={{
                color: device.accentColor,
                fontFamily: "Space Mono, monospace",
              }}
            >
              {device.category}
            </span>
            <DifficultyDots level={device.difficulty} />
          </div>

          {/* Mobile: category + difficulty inline row */}
          <div className="flex sm:hidden items-center gap-5 mt-6">
            <span
              className="text-[9px] uppercase tracking-[0.22em]"
              style={{
                color: device.accentColor,
                fontFamily: "Space Mono, monospace",
              }}
            >
              {device.category}
            </span>
            <DifficultyDots level={device.difficulty} />
          </div>
        </div>

        {/* ── Right: Content panel (scrollable) ────────────────── */}
        <div
          className="flex-1 overflow-y-auto flex flex-col"
          style={{ borderLeft: "1px solid var(--color-border)" }}
        >
          {/* Sticky top bar: counter + close */}
          <div
            className="sticky top-0 z-10 flex items-center justify-between px-9 py-5 flex-shrink-0"
            style={{
              background: "var(--color-surface)",
              borderBottom: "1px solid var(--color-border)",
              backdropFilter: "blur(6px)",
            }}
          >
            <span className="section-num text-xs">
              {String(deviceIndex + 1).padStart(2, "0")} /{" "}
              {String(devices.length).padStart(2, "0")}
            </span>
            <button
              onClick={onClose}
              className="flex items-center gap-2 transition-opacity duration-150 opacity-45 hover:opacity-100"
              style={{
                color: "var(--color-text)",
                fontFamily: "Space Mono, monospace",
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
              }}
            >
              Close
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="px-9 py-9 sm:px-10 sm:py-10 flex flex-col">
            {/* Name + tagline */}
            <h2 className="font-display text-3xl sm:text-4xl leading-tight mb-3" style={{ color: "var(--color-text)" }}>
              {device.name}
            </h2>
            <p
              className="font-elegant italic text-lg sm:text-xl mb-9"
              style={{ color: "var(--color-text-muted)" }}
            >
              {device.tagline}
            </p>

            {/* Specs row */}
            <div
              className="grid grid-cols-3 gap-6 py-6 mb-9"
              style={{
                borderTop: "1px solid var(--color-border-strong)",
                borderBottom: "1px solid var(--color-border-strong)",
              }}
            >
              {specRow.map((spec, i) => (
                <div key={i}>
                  <p
                    className="text-[9px] uppercase tracking-[0.2em] mb-2"
                    style={{
                      color: "var(--color-text-faint)",
                      fontFamily: "Space Mono, monospace",
                    }}
                  >
                    {spec.label}
                  </p>
                  <p
                    className="text-sm font-medium leading-snug"
                    style={{ color: "var(--color-text)" }}
                  >
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base leading-[2.05] mb-10" style={{ color: 'var(--color-text-muted)' }}>
              {device.description}
            </p>

            {/* Pro tip box */}
            <div
              className="relative px-7 py-8 mb-9"
              style={{
                border: `1px solid ${device.accentColor}28`,
                background: `${device.accentColor}09`,
              }}
            >
              <span
                className="absolute -top-2.5 left-6 px-3 text-[9px] uppercase tracking-[0.2em]"
                style={{
                  background: "var(--color-surface)",
                  color: device.accentColor,
                  fontFamily: "Space Mono, monospace",
                }}
              >
                Pro Tip
              </span>
              <svg
                className="mb-4 opacity-30"
                width="22"
                height="16"
                viewBox="0 0 24 18"
                fill={device.accentColor}
              >
                <path d="M0 18 C0 10 4 4 12 0 L14 3 C9 6 7 10 8 14 L0 18 Z" />
                <path d="M12 18 C12 10 16 4 24 0 L24 3 C19 6 19 10 20 14 L12 18 Z" />
              </svg>
              <p className="text-sm sm:text-base leading-relaxed italic" style={{ color: 'var(--color-text-muted)' }}>
                {device.tip}
              </p>
            </div>

            {/* Flavour profile labels */}
            <div className="pb-4">
              <p
                className="text-[9px] uppercase tracking-[0.24em] mb-5"
                style={{
                  color: "rgba(201,168,76,0.42)",
                  fontFamily: "Space Mono, monospace",
                }}
              >
                — Produces
              </p>
              <div className="flex flex-wrap gap-2.5">
                {device.flavourProfile.map((f) => (
                  <span
                    key={f}
                    className="px-4 py-2 text-[10px] font-medium tracking-[0.16em] uppercase"
                    style={{
                      border: `1px solid ${device.accentColor}40`,
                      color: device.accentColor,
                      background: `${device.accentColor}0C`,
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Tab content placeholders ─────────────────────────────────────────────────

function BrandsTab() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-5">
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgba(201,168,76,0.35)"
        strokeWidth="1.4"
        strokeLinecap="round"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
      <p
        className="font-display text-2xl italic"
        style={{ color: "var(--color-text-faint)" }}
      >
        Brands — coming soon
      </p>
      <p
        className="text-sm uppercase tracking-[0.2em]"
        style={{
          color: "var(--color-accent-border)",
          fontFamily: "Space Mono, monospace",
        }}
      >
        Exploring coffee brands
      </p>
    </div>
  );
}

const LANG_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  PHP: "#777bb4",
  Dart: "#00B4AB",
  Python: "#3572A5",
};

const communityRepos = [
  {
    name: "coffee-shop-website-design",
    owner: "erickdc7",
    desc: "Clean, minimal coffee shop website built with pure HTML & CSS — great starting point for static café sites.",
    stars: 152,
    lang: "HTML",
    url: "https://github.com/erickdc7/coffee-shop-website-design",
  },
  {
    name: "coffee-shop-website",
    owner: "itzzmerov",
    desc: "Full-stack coffee shop site with Add to Cart, AI chatbot, login/register forms — built with HTML, CSS, JS, PHP & MySQL.",
    stars: 63,
    lang: "PHP",
    url: "https://github.com/itzzmerov/coffee-shop-website",
  },
  {
    name: "jokopi-react",
    owner: "k1rana",
    desc: "Open source coffee shop order web app built with Create React App — covers ordering flow end to end.",
    stars: 39,
    lang: "JavaScript",
    url: "https://github.com/k1rana/jokopi-react",
  },
  {
    name: "Starbucks-Frontend-clone",
    owner: "Ratheshan03",
    desc: "Responsive Starbucks frontend clone — elegant UI built with HTML & CSS, pixel-faithful to the real thing.",
    stars: 23,
    lang: "HTML",
    url: "https://github.com/Ratheshan03/Starbucks-Frontend-clone",
  },
  {
    name: "cafe-project",
    owner: "Abhisheksingh0303",
    desc: "PHP-based café management system for efficiently handling orders and day-to-day operations.",
    stars: 18,
    lang: "PHP",
    url: "https://github.com/Abhisheksingh0303/cafe-project",
  },
  {
    name: "Coffee-Shop-Website",
    owner: "lchua2314",
    desc: "Mobile-first coffee shop site using SCSS, Font Awesome & local storage — clean component structure.",
    stars: 18,
    lang: "JavaScript",
    url: "https://github.com/lchua2314/Coffee-Shop-Website",
  },
  {
    name: "impresso-espresso",
    owner: "tessa-woodard",
    desc: "Mock espresso bar site with customer reviews, menu items, product pages and a contact form.",
    stars: 15,
    lang: "JavaScript",
    url: "https://github.com/tessa-woodard/impresso-espresso",
  },
  {
    name: "Brewhub---Coffee-Business-Website",
    owner: "jamesngn",
    desc: "Microservices architecture with gRPC communication, real-time updates, auth and product management.",
    stars: 10,
    lang: "JavaScript",
    url: "https://github.com/jamesngn/Brewhub---Coffee-Business-Website",
  },
  {
    name: "kopi-kount",
    owner: "exzequel",
    desc: "Captivating static promotional business site for a coffee shop — mobile-friendly and polished.",
    stars: 9,
    lang: "HTML",
    url: "https://github.com/exzequel/kopi-kount",
  },
  {
    name: "Revo-Coffee-Website",
    owner: "TetianaKovalchuk",
    desc: "Pixel-perfect implementation of a public Figma coffee shop design in HTML/CSS.",
    stars: 8,
    lang: "HTML",
    url: "https://github.com/TetianaKovalchuk/Revo-Coffee-Website",
  },
  {
    name: "multipage-coffee-shop-site-reactjs",
    owner: "autumnchris",
    desc: "Multi-page React.js coffee shop web app using client-side routing and SCSS — solid structure for React learners.",
    stars: 7,
    lang: "SCSS",
    url: "https://github.com/autumnchris/multipage-coffee-shop-site-reactjs",
  },
  {
    name: "coffee-shop-website",
    owner: "Alphabe1002",
    desc: "Bean Boutique — modern mobile-first coffee e-commerce platform with dynamic products, auth and shopping cart.",
    stars: 6,
    lang: "JavaScript",
    url: "https://github.com/Alphabe1002/coffee-shop-website",
  },
  {
    name: "responsive-coffee-website-3",
    owner: "erickdc7",
    desc: "Responsive coffee landing page using HTML, CSS and vanilla JavaScript with smooth scroll interactions.",
    stars: 4,
    lang: "CSS",
    url: "https://github.com/erickdc7/responsive-coffee-website-3",
  },
  {
    name: "coffee-shop",
    owner: "prabasajee",
    desc: "Premium coffee shop site with interactive features and modern UI — built with HTML5, CSS3 and JavaScript.",
    stars: 4,
    lang: "HTML",
    url: "https://github.com/prabasajee/coffee-shop",
  },
  {
    name: "coffee-shop-project",
    owner: "Yatin-Makwana",
    desc: "Bootstrap 5 coffee site showcasing varieties and brewing techniques — great template for café owners.",
    stars: 2,
    lang: "HTML",
    url: "https://github.com/Yatin-Makwana/coffee-shop-project",
  },
  {
    name: "Coffee-Shop-Beautiful-UI",
    owner: "SChandu7",
    desc: "Flutter UI app offering a curated selection of specialty coffees with an elegant mobile-first design.",
    stars: 2,
    lang: "Dart",
    url: "https://github.com/SChandu7/Coffee-Shop-Beautiful-UI",
  },
];

function RepoCard({ repo, index }) {
  const langColor = LANG_COLORS[repo.lang] || "#C9A84C";
  return (
    <motion.a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      whileHover={{ y: -4 }}
      className="flex flex-col gap-4 p-6 rounded-2xl transition-all duration-200 group"
      style={{
        background: "var(--color-card)",
        border: "1px solid rgba(80,120,60,0.2)",
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(80,120,60,0.2)";
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(201,168,76,0.5)"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="flex-shrink-0"
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
          <span
            className="font-display text-sm leading-snug truncate group-hover:text-ochre transition-colors duration-200"
            style={{ color: "var(--color-text)" }}
          >
            {repo.name}
          </span>
        </div>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-border-strong)"
          strokeWidth="2"
          strokeLinecap="round"
          className="flex-shrink-0 group-hover:stroke-ochre transition-colors duration-200"
          style={{ marginTop: 2 }}
        >
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
      </div>

      {/* Owner */}
      <p
        className="text-[10px] uppercase tracking-[0.16em] -mt-2"
        style={{
          color: "var(--color-accent-border)",
          fontFamily: "Space Mono, monospace",
        }}
      >
        by {repo.owner}
      </p>

      {/* Description */}
      <p
        className="text-xs leading-relaxed flex-1"
        style={{ color: "var(--color-text-muted)", lineHeight: 1.75 }}
      >
        {repo.desc}
      </p>

      {/* Footer */}
      <div
        className="flex items-center justify-between pt-3"
        style={{ borderTop: "1px solid rgba(80,120,60,0.15)" }}
      >
        <div className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ background: langColor }}
          />
          <span
            className="text-[10px]"
            style={{
              color: "var(--color-text-faint)",
              fontFamily: "Space Mono, monospace",
            }}
          >
            {repo.lang}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="rgba(201,168,76,0.45)"
            stroke="none"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span
            className="text-[10px] font-medium"
            style={{
              color: "rgba(201,168,76,0.6)",
              fontFamily: "Space Mono, monospace",
            }}
          >
            {repo.stars}
          </span>
        </div>
      </div>
    </motion.a>
  );
}

function CoffeeNerdsTab() {
  return (
    <div>
      {/* Section intro */}
      <div className="mb-10 max-w-2xl">
        <p
          className="text-[10px] uppercase tracking-[0.22em] mb-3"
          style={{
            color: "rgba(201,168,76,0.5)",
            fontFamily: "Space Mono, monospace",
          }}
        >
          Open Source · GitHub Community
        </p>
        <h2
          className="font-display text-3xl sm:text-4xl mb-4"
          style={{ color: "var(--color-text)" }}
        >
          Built by Coffee Nerds
        </h2>
        <p
          className="text-sm leading-loose"
          style={{ color: "var(--color-text-muted)" }}
        >
          The internet's finest open-source coffee shop websites and apps —
          built by the nerd community and shared freely on GitHub. Explore the
          code, fork a project, or draw inspiration for your own brew-themed
          build.
        </p>
        <a
          href="https://github.com/topics/coffee-shop-website"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-5 text-[10px] uppercase tracking-[0.18em] transition-colors duration-200"
          style={{
            color: "rgba(201,168,76,0.55)",
            fontFamily: "Space Mono, monospace",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--color-accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(201,168,76,0.55)";
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          View all on GitHub →
        </a>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {communityRepos.map((repo, i) => (
          <RepoCard key={`${repo.owner}-${repo.name}`} repo={repo} index={i} />
        ))}
      </div>
    </div>
  );
}

// ── Coffee Types data ────────────────────────────────────────────────────────

const coffeeTypes = [
  // Espresso
  { id: "espresso", name: "Espresso", category: "Espresso", icon: "espresso", description: "A strong concentrated coffee drink typically served in a small espresso cup. Commonly used as a base for lattes, cappuccinos, and macchiatos." },
  { id: "ristretto", name: "Ristretto", category: "Espresso", icon: "espresso", description: "More concentrated than espresso, using half the water and a shorter extraction time. Thicker, richer in flavour, and less bitter." },
  { id: "doppio", name: "Doppio", category: "Espresso", icon: "espresso", description: "A double-shot espresso served in a small cup, popular among enthusiasts who prefer stronger, bolder flavours." },
  { id: "lungo", name: "Lungo", category: "Espresso", icon: "espresso", description: "A single shot brewed longer with more water. Less strong but more bitter than a regular espresso." },
  { id: "long-black", name: "Long Black", category: "Espresso", icon: "tall", description: "Made by pouring a double shot of espresso over hot water. Features a frothy crema layer on top." },
  { id: "espresso-romano", name: "Espresso Romano", category: "Espresso", icon: "espresso", description: "A single shot of espresso served with a slice of lemon. The lemon softens the bitterness and can be squeezed in or eaten between sips." },
  { id: "guillermo", name: "Guillermo", category: "Espresso", icon: "espresso", description: "Two shots of espresso poured into a glass with two slices of lime. Can be served hot or over ice." },
  // Black Coffee
  { id: "americano", name: "Americano", category: "Black Coffee", icon: "mug", description: "Equal parts espresso and hot water. Enjoyed black or with a small amount of cream — strong flavour with less bitterness than espresso." },
  { id: "red-eye", name: "Red-Eye Coffee", category: "Black Coffee", icon: "mug", description: "Regular drip coffee combined with espresso. Highly caffeinated and made for those who need a guaranteed energy boost." },
  { id: "black-eye", name: "Black-Eye Coffee", category: "Black Coffee", icon: "mug", description: "Regular hot coffee with a double shot of espresso. High caffeine content with an intense, stronger flavour." },
  { id: "black-coffee", name: "Black Coffee", category: "Black Coffee", icon: "mug", description: "Simply brewed ground coffee with no sugar or milk. Can be made with a variety of beans for different flavours and aromas." },
  // Cold Brew
  { id: "cold-brew-drink", name: "Cold Brew", category: "Cold Brew", icon: "iced", description: "Ground coffee steeped in cold water for 12–24 hours, then filtered. Less bitter and acidic than hot coffee." },
  { id: "nitro-cold-brew", name: "Nitro Cold Brew", category: "Cold Brew", icon: "iced", description: "Nitrogen-infused cold brew — a thicker, creamier version of cold brew. Bold coffee with a smooth and creamy texture." },
  // Cappuccino & Mocha
  { id: "cappuccino", name: "Cappuccino", category: "Milk-Based", icon: "foam", description: "Equal parts espresso, steamed milk, and milk foam. Known for its creamy texture and smooth, balanced flavour." },
  { id: "mocha", name: "Mocha", category: "Milk-Based", icon: "foam", description: "Made with steamed milk, chocolate syrup, and espresso, topped with foam. Chocolatey, sweet, rich, and indulgent — can be enjoyed hot or cold." },
  // Iced Coffees
  { id: "frappe", name: "Frappé", category: "Iced Coffee", icon: "iced", description: "Instant coffee, ice, sugar, and water mixed in a shaker or blender. Sometimes topped with cream or ice cream for a creamy dessert-like treat." },
  { id: "iced-coffee", name: "Iced Coffee", category: "Iced Coffee", icon: "iced", description: "Regular coffee poured over ice, customisable with milk, cream, or flavoured syrups. A refreshing cold alternative to hot coffee." },
  { id: "mazagran", name: "Mazagran", category: "Iced Coffee", icon: "iced", description: "Coffee or double espresso mixed with fresh lemon juice, sugar, and ice. A refreshing alternative during warmer weather." },
  // Lattes
  { id: "latte", name: "Latte", category: "Latte", icon: "foam", description: "Steamed milk and espresso with a layer of foam. Known for its mild and creamy taste — can be served hot or cold." },
  { id: "flat-white", name: "Flat White", category: "Latte", icon: "foam", description: "Steamed milk poured over espresso with a higher espresso-to-milk ratio. Rich, bold flavour with a velvety texture." },
  { id: "breve", name: "Breve", category: "Latte", icon: "foam", description: "Equal parts espresso and steamed half-and-half. Creamy, rich, and heavier textured — popular hot or over ice." },
  // Macchiatos
  { id: "macchiato", name: "Macchiato", category: "Macchiato", icon: "espresso", description: "Espresso with a small amount of steamed milk or foam on top. Strong and bold — can be served hot or over ice." },
  { id: "long-macchiato", name: "Long Macchiato", category: "Macchiato", icon: "espresso", description: "A double espresso with a small amount of steamed milk on top. Stronger than a traditional macchiato with a small amount of creamy texture." },
  // Specialty
  { id: "cortado", name: "Cortado", category: "Specialty", icon: "espresso", description: "Two ounces of espresso diluted with two ounces of steamed milk. The less-foamy milk balances out the espresso's bitterness." },
  { id: "dirty-chai", name: "Dirty Chai", category: "Specialty", icon: "mug", description: "Espresso combined with chai tea. Darker than regular chai with optional spices or sugar — served hot or cold." },
  { id: "dalgona", name: "Dalgona Coffee", category: "Specialty", icon: "foam", description: "Whipped instant coffee, hot water, and sugar poured over cold or hot milk. Also known as 'whipped coffee'." },
  // Dessert
  { id: "irish-coffee", name: "Irish Coffee", category: "Dessert", icon: "mug", description: "Hot coffee, sugar, and Irish whiskey topped with cream or whipped cream. Served warm as an after-dinner drink." },
  { id: "cafe-au-lait", name: "Café au Lait", category: "Dessert", icon: "mug", description: "Half hot coffee and half steamed milk with no froth. Served in a larger bowl or mug — known for simplicity and rich flavour." },
  { id: "affogato", name: "Affogato", category: "Dessert", icon: "iced", description: "A scoop of ice cream or gelato drowned in hot espresso. A simple, tasty dessert combining espresso and gelato flavours." },
  { id: "espresso-con-panna", name: "Espresso Con Panna", category: "Dessert", icon: "espresso", description: "A single or double shot of espresso topped with whipped cream. Strong, dessert-like, and indulgent." },
  { id: "vienna-coffee", name: "Vienna Coffee", category: "Dessert", icon: "foam", description: "Double espresso topped with whisked whipped cream, dusted with cocoa powder or chocolate shavings." },
  // Cultural / Regional
  { id: "turkish-coffee", name: "Turkish Coffee", category: "Cultural", icon: "mug", description: "Fine ground coffee brewed in a copper cezve on a stovetop. Unfiltered, thick in texture, and rich in flavour — served with or without sugar." },
  { id: "cuban-coffee", name: "Cuban Coffee", category: "Cultural", icon: "espresso", description: "Sweetened espresso (Cafecito) brewed in a moka pot, poured over 'espuma' — a sweet froth of whipped espresso and sugar." },
  { id: "galao", name: "Galão", category: "Cultural", icon: "foam", description: "Portuguese coffee with one part espresso and three parts frothed steamed milk. Popular for breakfast or as an afternoon boost." },
  { id: "antoccino", name: "Antoccino", category: "Cultural", icon: "foam", description: "Equal parts espresso and steamed milk. Served hot with a creamy, strong, and rich taste." },
];

const COFFEE_CATEGORIES = ["All", "Espresso", "Black Coffee", "Cold Brew", "Milk-Based", "Iced Coffee", "Latte", "Macchiato", "Specialty", "Dessert", "Cultural"];

const CATEGORY_COLORS = {
  "Espresso":    "#C9A84C",
  "Black Coffee":"#6B8A5E",
  "Cold Brew":   "#4A7A8A",
  "Milk-Based":  "#9A7A5A",
  "Iced Coffee": "#5A7A9A",
  "Latte":       "#A07A5A",
  "Macchiato":   "#8A6A4A",
  "Specialty":   "#7A6A9A",
  "Dessert":     "#9A5A6A",
  "Cultural":    "#7A8A5A",
};

// Minimal SVG icons per cup type
function CupIcon({ type = "mug", color = "#C9A84C" }) {
  const s = { stroke: color, strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", fill: "none" };
  if (type === "espresso") return (
    <svg viewBox="0 0 40 40" width="36" height="36" {...s}>
      <path d="M8 14 Q8 30 20 30 Q32 30 32 14"/>
      <rect x="7" y="12" width="26" height="4" rx="2"/>
      <path d="M32 16 Q38 16 38 20 Q38 24 32 24"/>
      <line x1="7" y1="32" x2="33" y2="32"/>
      <path d="M14 12 Q15 9 14 7" strokeOpacity="0.55"/>
      <path d="M22 12 Q23 9 22 7" strokeOpacity="0.55"/>
    </svg>
  );
  if (type === "tall") return (
    <svg viewBox="0 0 40 40" width="36" height="36" {...s}>
      <path d="M10 6 L12 36 Q12 38 20 38 Q28 38 28 36 L30 6 Z"/>
      <line x1="10" y1="6" x2="30" y2="6"/>
      <line x1="11" y1="16" x2="29" y2="16" strokeOpacity="0.4"/>
      <ellipse cx="20" cy="5" rx="10" ry="2.5" strokeOpacity="0.55"/>
    </svg>
  );
  if (type === "iced") return (
    <svg viewBox="0 0 40 40" width="36" height="36" {...s}>
      <path d="M10 6 L12 36 Q12 38 20 38 Q28 38 28 36 L30 6 Z"/>
      <line x1="10" y1="6" x2="30" y2="6"/>
      <ellipse cx="20" cy="5" rx="10" ry="2.5" strokeOpacity="0.55"/>
      <line x1="20" y1="2" x2="20" y2="6"/>
      <circle cx="16" cy="22" r="2" fill={color} strokeWidth="0"/>
      <circle cx="24" cy="18" r="2" fill={color} strokeWidth="0"/>
      <circle cx="20" cy="26" r="2" fill={color} strokeWidth="0"/>
    </svg>
  );
  if (type === "foam") return (
    <svg viewBox="0 0 40 40" width="36" height="36" {...s}>
      <path d="M6 16 Q6 34 20 34 Q34 34 34 16"/>
      <ellipse cx="20" cy="14" rx="14" ry="4"/>
      <path d="M9 14 Q11 8 15 8 Q17 10 20 8 Q23 10 25 8 Q29 8 31 14" strokeOpacity="0.45"/>
      <path d="M34 20 Q40 20 40 24 Q40 28 34 28"/>
      <line x1="5" y1="34" x2="35" y2="34"/>
    </svg>
  );
  // default: mug
  return (
    <svg viewBox="0 0 40 40" width="36" height="36" {...s}>
      <rect x="5" y="12" width="24" height="22" rx="3"/>
      <path d="M29 16 Q37 16 37 22 Q37 28 29 28"/>
      <line x1="5" y1="28" x2="29" y2="28"/>
      <path d="M11 12 Q12 9 11 6" strokeOpacity="0.6"/>
      <path d="M18 12 Q19 9 18 6" strokeOpacity="0.6"/>
    </svg>
  );
}

function CoffeeTypeCard({ item, index }) {
  const catColor = CATEGORY_COLORS[item.category] || "#C9A84C";
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.035, duration: 0.35 }}
      whileHover={{ y: -4 }}
      className="flex flex-col gap-4 p-6 rounded-2xl transition-all duration-200 group"
      style={{ background: "var(--color-card)", border: "1px solid rgba(80,120,60,0.2)" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${catColor}50` }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(80,120,60,0.2)" }}
    >
      {/* Icon + category */}
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 flex items-center justify-center rounded-xl" style={{ background: `${catColor}12`, border: `1px solid ${catColor}25` }}>
          <CupIcon type={item.icon} color={catColor} />
        </div>
        <span
          className="text-[9px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-full"
          style={{ background: `${catColor}14`, color: catColor, border: `1px solid ${catColor}30`, fontFamily: "Space Mono, monospace" }}
        >
          {item.category}
        </span>
      </div>
      {/* Name */}
      <h3 className="font-display text-base leading-snug" style={{ color: "var(--color-text)" }}>
        {item.name}
      </h3>
      {/* Description */}
      <p className="text-xs leading-relaxed flex-1" style={{ color: "var(--color-text-muted)", lineHeight: 1.8 }}>
        {item.description}
      </p>
    </motion.div>
  );
}

function CoffeeTypesTab() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = coffeeTypes.filter(t =>
    (activeCategory === "All" || t.category === activeCategory) &&
    (t.name.toLowerCase().includes(search.toLowerCase()) ||
     t.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      {/* Intro */}
      <div className="mb-8 max-w-2xl">
        <p className="text-[10px] uppercase tracking-[0.22em] mb-3" style={{ color: "rgba(201,168,76,0.5)", fontFamily: "Space Mono, monospace" }}>
          The Complete Guide
        </p>
        <h2 className="font-display text-3xl sm:text-4xl mb-4" style={{ color: "var(--color-text)" }}>
          Every Coffee You Need to Know
        </h2>
        <p className="text-sm leading-loose" style={{ color: "var(--color-text-muted)" }}>
          From the humble black coffee to the theatrical Irish whiskey pour — a complete visual directory of 35+ coffee drinks across every style and tradition.
        </p>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative max-w-xs">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.45)" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search drinks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl outline-none"
            style={{ background: "var(--color-surface)", border: "1px solid rgba(80,120,60,0.3)", color: "var(--color-text)", fontFamily: "Inter, sans-serif" }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {COFFEE_CATEGORIES.map(cat => {
            const isActive = activeCategory === cat;
            const catColor = CATEGORY_COLORS[cat] || "#C9A84C";
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-3.5 py-1.5 rounded-full text-[10px] uppercase tracking-[0.14em] transition-all duration-200"
                style={{
                  fontFamily: "Space Mono, monospace",
                  background: isActive ? (cat === "All" ? "var(--color-accent)" : catColor) : "transparent",
                  color: isActive ? "var(--color-bg)" : "var(--color-text-muted)",
                  border: `1px solid ${isActive ? (cat === "All" ? "var(--color-accent)" : catColor) : "rgba(80,120,60,0.25)"}`,
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Count */}
      <p className="text-[10px] uppercase tracking-[0.2em] mb-6" style={{ color: "rgba(201,168,76,0.35)", fontFamily: "Space Mono, monospace" }}>
        {filtered.length} drink{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="rgba(201,168,76,0.25)" strokeWidth="1.4" strokeLinecap="round">
            <rect x="5" y="12" width="24" height="22" rx="3"/>
            <path d="M29 16 Q37 16 37 22 Q37 28 29 28"/>
            <line x1="5" y1="28" x2="29" y2="28"/>
          </svg>
          <p className="font-display text-xl italic" style={{ color: "var(--color-text-faint)" }}>No drinks found</p>
          <button onClick={() => { setSearch(""); setActiveCategory("All"); }} className="text-xs" style={{ color: "rgba(201,168,76,0.5)", fontFamily: "Space Mono, monospace" }}>
            Clear filter →
          </button>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + search}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            {filtered.map((item, i) => (
              <CoffeeTypeCard key={item.id} item={item} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

// ── Tab definitions ───────────────────────────────────────────────────────────

const TABS = [
  { id: "brewing-devices", label: "Brewing Devices" },
  { id: "brands", label: "Brands" },
  { id: "coffee-types", label: "Coffee Types" },
  { id: "coffee-nerds", label: "Coffee Nerds" },
];

const TAB_HERO = {
  "brewing-devices": {
    eyebrow: "The Equipment Room",
    titleLine1: "Brewing",
    titleLine2: "Guides",
    desc: "From the Ottoman cezve to the Japanese siphon — every major coffee brewer in history, with the science, story, and technique behind each one.",
  },
  brands: {
    eyebrow: "The Roaster's Directory",
    titleLine1: "Coffee",
    titleLine2: "Brands",
    desc: "Explore the world's finest roasters, cafés, and coffee labels — from century-old Italian houses to micro-lot specialty roasters rewriting the rulebook.",
  },
  "coffee-types": {
    eyebrow: "The Coffee Menu",
    titleLine1: "Coffee",
    titleLine2: "Types",
    desc: "From the humble black coffee to the theatrical Irish whiskey pour — a complete visual directory of 35+ coffee drinks across every style and cultural tradition.",
  },
  "coffee-nerds": {
    eyebrow: "Open Source Community",
    titleLine1: "Coffee",
    titleLine2: "Nerds",
    desc: "The internet's finest open-source coffee shop websites and apps — built by developers who can't separate their passion for code from their love of coffee.",
  },
};

// ── Devices tab with grouped TOC ─────────────────────────────────────────────

function slugCat(cat) {
  return cat.toLowerCase().replace(/\s+/g, '-').replace(/[+]/g, 'plus')
}

function DevicesTab({ selectedId, handleOpen }) {
  const uniqueCategories = useMemo(
    () => [...new Set(devices.map(d => d.category))],
    []
  )

  const jumpTo = (cat) => {
    const el = document.getElementById(`dev-section-${slugCat(cat)}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <motion.section
      key="brewing-devices"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28 }}
      className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 xl:px-16 pb-24"
    >
      {/* Sticky jump-to strip */}
      <div
        className="sticky z-30 py-3 mb-8 mt-6"
        style={{
          top: '5rem',
          background: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <span
            className="flex-shrink-0 text-[9px] uppercase tracking-[0.2em] mr-1"
            style={{ fontFamily: 'Space Mono, monospace', color: 'var(--color-text-faint)' }}
          >
            Jump to
          </span>
          {uniqueCategories.map(cat => (
            <button
              key={cat}
              onClick={() => jumpTo(cat)}
              className="flex-shrink-0 px-3 py-1 rounded-full text-[9px] uppercase tracking-[0.14em] transition-all duration-150"
              style={{
                fontFamily: 'Space Mono, monospace',
                background: 'var(--color-surface)',
                color: 'var(--color-text-muted)',
                border: '1px solid var(--color-border)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-accent-dim)'
                e.currentTarget.style.color = 'var(--color-accent)'
                e.currentTarget.style.borderColor = 'var(--color-accent-border)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--color-surface)'
                e.currentTarget.style.color = 'var(--color-text-muted)'
                e.currentTarget.style.borderColor = 'var(--color-border)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grouped device grid */}
      {uniqueCategories.map((cat) => {
        const catDevices = devices.filter(d => d.category === cat)
        return (
          <div
            key={cat}
            id={`dev-section-${slugCat(cat)}`}
            style={{ scrollMarginTop: '8rem', marginBottom: '3rem' }}
          >
            <div className="flex items-center gap-4 mb-5">
              <h2
                className="text-[10px] uppercase tracking-[0.22em]"
                style={{ fontFamily: 'Space Mono, monospace', color: 'var(--color-accent)' }}
              >
                {cat}
              </h2>
              <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
              <span
                className="text-[9px] uppercase tracking-[0.14em]"
                style={{ fontFamily: 'Space Mono, monospace', color: 'var(--color-text-faint)' }}
              >
                {catDevices.length} {catDevices.length === 1 ? 'device' : 'devices'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {catDevices.map((device, i) => (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                >
                  <DeviceCard
                    device={device}
                    selected={selectedId === device.id}
                    onClick={handleOpen}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )
      })}
    </motion.section>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function BrewingGuides() {
  const [activeTab, setActiveTab] = useState("brewing-devices");
  const [selectedId, setSelectedId] = useState(null);
  const selectedDevice = devices.find((d) => d.id === selectedId);
  const triggerRef = useRef(null);

  const handleOpen = (id) => {
    if (id) triggerRef.current = document.activeElement;
    setSelectedId(id);
  };

  const handleClose = () => {
    setSelectedId(null);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  return (
    <div className="min-h-screen pt-24">
      <BackButton to="/" label="Home" />
      <SEO title="Brewing Guides" description="From AeroPress to siphon — every major coffee brewing device, brand, and technique in one place." />
      {/* ── Modal overlay ────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedDevice && (
          <DeviceModal
            key={selectedDevice.id}
            device={selectedDevice}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>

      {/* ── Page header ──────────────────────────────────────────────── */}
      <section
        className="py-20 md:py-28 px-6 sm:px-10 xl:px-16 relative"
        style={{
          background: "linear-gradient(180deg, #1C2B14 0%, transparent 100%)",
        }}
      >
        <div className="max-w-[1600px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="label-ornate mb-6">{TAB_HERO[activeTab].eyebrow}</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
                <div>
                  <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-parchment leading-tight">
                    {TAB_HERO[activeTab].titleLine1}
                    <br />
                    <span className="font-display italic" style={{ color: "var(--color-accent)" }}>
                      {TAB_HERO[activeTab].titleLine2}
                    </span>
                  </h1>
                </div>
                <div>
                  <div className="w-10 h-px mb-6" style={{ background: "rgba(201,168,76,0.4)" }} />
                  <p className="text-parchment/55 text-base md:text-lg leading-loose">
                    {TAB_HERO[activeTab].desc}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Pill tab bar ─────────────────────────────────────────────── */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 xl:px-16 mb-10">
        <div
          className="flex items-center gap-2 overflow-x-auto pb-1"
          style={{ scrollbarWidth: "none" }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex-shrink-0 px-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-200 focus:outline-none rounded-full"
                style={{
                  color: isActive ? "var(--color-bg)" : "var(--color-text-muted)",
                  fontFamily: "Inter, sans-serif",
                  zIndex: 0,
                }}
              >
                {isActive && (
                  <motion.span
                    layoutId="guidePill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: "var(--color-accent)", zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {tab.label}
              </motion.button>
            );
          })}
        </div>
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, rgba(201,168,76,0.2), transparent)",
            marginTop: "12px",
          }}
        />
      </div>

      {/* ── Tab content ──────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {activeTab === "brewing-devices" && (
          <DevicesTab selectedId={selectedId} handleOpen={handleOpen} />
        )}

        {activeTab === "brands" && (
          <motion.section
            key="brands"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
            className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 xl:px-16 pb-24"
          >
            <BrandsTab />
          </motion.section>
        )}

        {activeTab === "coffee-types" && (
          <motion.section
            key="coffee-types"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
            className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 xl:px-16 pb-24"
          >
            <CoffeeTypesTab />
          </motion.section>
        )}

        {activeTab === "coffee-nerds" && (
          <motion.section
            key="coffee-nerds"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
            className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 xl:px-16 pb-24"
          >
            <CoffeeNerdsTab />
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
