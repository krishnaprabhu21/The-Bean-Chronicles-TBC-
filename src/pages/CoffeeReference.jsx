import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BackButton } from '../components/ui/BackButton'
import { SEO } from '../components/ui/SEO'

// ── Data ──────────────────────────────────────────────────────────────────────

const GRIND_SIZES = [
  {
    id: 'turkish',
    name: 'Turkish',
    microns: '<200μm',
    fineness: 1,
    dialPos: '1–2',
    particle: 'Powder-fine, like talcum',
    waterTemp: '70–80°C',
    brewers: ['Turkish Coffee', 'Cezve'],
    color: '#C9A84C',
    dotR: 1.4,
    desc: 'Finer than espresso. Brewed unfiltered — grounds settle to the bottom. No filter means grind precision is everything.',
  },
  {
    id: 'espresso',
    name: 'Espresso',
    microns: '200–400μm',
    fineness: 2,
    dialPos: '2–4',
    particle: 'Fine, like table salt',
    waterTemp: '91–96°C',
    brewers: ['Espresso Machine', 'Moka Pot'],
    color: '#C9A84C',
    dotR: 2.4,
    desc: 'The benchmark for fine grinding. Resistance at this grind is what lets 9-bar pressure build. A 0.5-division grinder change shifts shot time by 5 seconds.',
  },
  {
    id: 'aeropress',
    name: 'AeroPress',
    microns: '400–600μm',
    fineness: 3,
    dialPos: '4–6',
    particle: 'Medium-fine, like coarse sand',
    waterTemp: '80–96°C',
    brewers: ['AeroPress'],
    color: '#A08040',
    dotR: 3.6,
    desc: 'Tolerates a wide range — fine to medium depending on recipe and brew time. Inverted method prefers finer; standard prefers medium-fine.',
  },
  {
    id: 'pourover',
    name: 'Pour Over',
    microns: '500–750μm',
    fineness: 4,
    dialPos: '5–7',
    particle: 'Medium, like coarse sand',
    waterTemp: '90–96°C',
    brewers: ['V60', 'Chemex', 'Kalita Wave'],
    color: '#7A9E6A',
    dotR: 4.8,
    desc: 'The sweet spot for clarity. Too fine chokes the bed; too coarse speeds water through. Chemex runs slightly coarser due to its thicker filter paper.',
  },
  {
    id: 'drip',
    name: 'Drip',
    microns: '600–900μm',
    fineness: 5,
    dialPos: '6–8',
    particle: 'Medium-coarse',
    waterTemp: '91–96°C',
    brewers: ['Batch Brewer', 'Drip Machine'],
    color: '#6B8FAB',
    dotR: 6,
    desc: 'Batch brewers have fixed flow rates so grind compensates. Medium is the safe default; dialling finer increases extraction without adjusting dose.',
  },
  {
    id: 'frenchpress',
    name: 'French Press',
    microns: '800–1200μm',
    fineness: 6,
    dialPos: '7–9',
    particle: 'Coarse, like rough sea salt',
    waterTemp: '93–96°C',
    brewers: ['French Press', 'Siphon'],
    color: '#9E7A6A',
    dotR: 7.2,
    desc: 'Metal mesh gaps let fine particles through, muddying the cup. Coarse grind keeps the brew clean. Finer makes the plunger difficult to press.',
  },
  {
    id: 'coldbrew',
    name: 'Cold Brew',
    microns: '1000–1500μm',
    fineness: 7,
    dialPos: '9–10',
    particle: 'Extra coarse, like gravel',
    waterTemp: 'Cold/Room temp',
    brewers: ['Cold Brew Pitcher', 'Mason Jar'],
    color: '#6B8FAB',
    dotR: 8.4,
    desc: 'Extended 12–24h cold contact means ultra-coarse is necessary to avoid over-extraction. Coarser = cleaner, sweeter concentrate.',
  },
]

const FLAVOUR_CATEGORIES = [
  {
    id: 'fruity',
    name: 'Fruity',
    color: '#E8624A',
    startDeg: 0,
    endDeg: 40,
    desc: 'Bright, complex flavours found in washed African coffees and natural-processed beans. The most prized category in specialty coffee.',
    origins: ['Ethiopia Yirgacheffe', 'Kenya AA', 'Panama Geisha'],
    subs: [
      { name: 'Berry', words: ['Blueberry', 'Strawberry', 'Blackberry', 'Raspberry'] },
      { name: 'Citrus', words: ['Lemon', 'Orange', 'Grapefruit', 'Lime'] },
      { name: 'Stone Fruit', words: ['Peach', 'Apricot', 'Cherry', 'Plum'] },
      { name: 'Tropical', words: ['Mango', 'Pineapple', 'Passionfruit'] },
    ],
  },
  {
    id: 'floral',
    name: 'Floral',
    color: '#C084B8',
    startDeg: 40,
    endDeg: 80,
    desc: 'Delicate perfume-like notes that evaporate quickly. Most prominent in light-roast washed Ethiopians brewed at lower temperatures.',
    origins: ['Ethiopia Guji', 'Yemen Haraaz', 'Colombia Huila'],
    subs: [
      { name: 'Rose', words: ['Rose', 'Rose Hip', 'Rose Water'] },
      { name: 'Jasmine', words: ['Jasmine', 'Orange Blossom', 'Elderflower'] },
      { name: 'Herbal', words: ['Chamomile', 'Lavender', 'Black Tea'] },
    ],
  },
  {
    id: 'sweet',
    name: 'Sweet',
    color: '#F0A04B',
    startDeg: 80,
    endDeg: 120,
    desc: 'Caramelised sugars and honey-like notes from the Maillard reaction. Strongest in medium-roast Central American and Brazilian coffees.',
    origins: ['Guatemala Antigua', 'Honduras Copan', 'Brazil Cerrado'],
    subs: [
      { name: 'Caramel', words: ['Caramel', 'Toffee', 'Brown Sugar', 'Molasses'] },
      { name: 'Vanilla', words: ['Vanilla', 'Cream', 'Butterscotch'] },
      { name: 'Honey', words: ['Honey', 'Maple Syrup', 'Dried Fruit'] },
    ],
  },
  {
    id: 'nutty',
    name: 'Nutty/Cocoa',
    color: '#8B5E3C',
    startDeg: 120,
    endDeg: 160,
    desc: 'Rich, comforting notes in medium and medium-dark roasts. Common in Brazilian and Colombian beans approaching second crack.',
    origins: ['Brazil Santos', 'Colombia Nariño', 'Peru Chanchamayo'],
    subs: [
      { name: 'Nutty', words: ['Almond', 'Hazelnut', 'Walnut', 'Peanut'] },
      { name: 'Chocolate', words: ['Dark Chocolate', 'Milk Chocolate', 'Cocoa'] },
      { name: 'Malt', words: ['Malt', 'Grain', 'Toast'] },
    ],
  },
  {
    id: 'spices',
    name: 'Spices',
    color: '#D4823A',
    startDeg: 160,
    endDeg: 200,
    desc: 'Warm aromatic notes prominent in Indonesian, Yemeni, and Indian coffees with distinctive terroir or wet-hulling processing.',
    origins: ['Indonesia Sumatra', 'Yemen Mocha', 'India Monsoon Malabar'],
    subs: [
      { name: 'Warm Spice', words: ['Cinnamon', 'Clove', 'Cardamom', 'Nutmeg'] },
      { name: 'Pepper', words: ['Black Pepper', 'Anise', 'Pungent'] },
      { name: 'Herbal', words: ['Tarragon', 'Sage', 'Thyme'] },
    ],
  },
  {
    id: 'roasted',
    name: 'Roasted',
    color: '#4A3728',
    startDeg: 200,
    endDeg: 240,
    desc: 'Deep smoky notes from pyrolysis in darker roasts. Classic territory of Italian espresso tradition and French café culture.',
    origins: ['Italian Blends', 'French Roast', 'Dark Sumatra'],
    subs: [
      { name: 'Smoky', words: ['Smoky', 'Ashy', 'Charred', 'Tobacco'] },
      { name: 'Burnt', words: ['Burnt', 'Carbon', 'Tar'] },
      { name: 'Brown Roast', words: ['Toast', 'Cereal', 'Grain'] },
    ],
  },
  {
    id: 'vegetal',
    name: 'Vegetal',
    color: '#5A8A40',
    startDeg: 240,
    endDeg: 280,
    desc: 'Grassy, raw notes indicating under-roasting or very fresh green coffee. Often present in first-crack light roasts or processing defects.',
    origins: ['Light Roast Defects', 'Under-developed Roasts'],
    subs: [
      { name: 'Green', words: ['Raw', 'Beany', 'Fresh Grass', 'Straw'] },
      { name: 'Olive', words: ['Olive Oil', 'Hay', 'Herbal'] },
      { name: 'Vegetal', words: ['Pepper Leaf', 'Basil', 'Dried Herb'] },
    ],
  },
  {
    id: 'sour',
    name: 'Sour/Fermented',
    color: '#A8C44A',
    startDeg: 280,
    endDeg: 320,
    desc: 'Bright acidity and fermentation notes. At low levels, desirable complexity; at high levels indicates over-fermentation during processing.',
    origins: ['Natural Process Ethiopia', 'Honey Process Costa Rica', 'Anaerobic Fermentation'],
    subs: [
      { name: 'Sour', words: ['Citric', 'Malic Acid', 'Acetic Acid'] },
      { name: 'Fermented', words: ['Winey', 'Vinegar', 'Fermented Fruit'] },
      { name: 'Lactic', words: ['Yoghurt', 'Buttermilk', 'Kefir'] },
    ],
  },
  {
    id: 'earthy',
    name: 'Earthy',
    color: '#7A6B52',
    startDeg: 320,
    endDeg: 360,
    desc: 'Deep mineral and soil-like notes. Characteristic of Indonesian coffees processed by wet-hulling (Giling Basah), which imparts distinctive mustiness.',
    origins: ['Sumatra Mandheling', 'Indonesia Sulawesi', 'India Coorg'],
    subs: [
      { name: 'Earthy', words: ['Soil', 'Mushroom', 'Truffle', 'Wet Earth'] },
      { name: 'Musty', words: ['Musty', 'Mildew', 'Papery'] },
      { name: 'Mineral', words: ['Mineral', 'Chalky', 'Limestone'] },
    ],
  },
]

const FOOD_PAIRINGS = [
  {
    id: 'eth-natural',
    coffee: 'Ethiopian Natural',
    origin: 'Yirgacheffe / Sidama',
    profile: 'Fruity',
    flavor: 'Blueberry, dark chocolate, rose',
    color: '#E8624A',
    pairings: [
      { food: 'Dark Chocolate', note: 'Cocoa bitterness bridges the berry notes', emoji: '🍫' },
      { food: 'Fresh Strawberries', note: 'Amplifies the berry intensity in both', emoji: '🍓' },
      { food: 'Honey Cake', note: 'Sweetness lifts the floral aromatics', emoji: '🍯' },
      { food: 'Soft Goat Cheese', note: 'Tangy contrast to the sweet fruit', emoji: '🧀' },
    ],
  },
  {
    id: 'eth-washed',
    coffee: 'Ethiopian Washed',
    origin: 'Yirgacheffe, Ethiopia',
    profile: 'Floral',
    flavor: 'Lemon, jasmine, bergamot, tea-like',
    color: '#C084B8',
    pairings: [
      { food: 'Lemon Tart', note: 'Citric acidity in both creates a bright pairing', emoji: '🍋' },
      { food: 'Earl Grey Shortbread', note: 'Bergamot in the tea echoes the floral notes', emoji: '🍪' },
      { food: 'Fresh Raspberries', note: 'Light fruit that does not overpower the delicacy', emoji: '🫐' },
      { food: 'Soft Brie', note: 'Mild cream softens the tea-like finish', emoji: '🧀' },
    ],
  },
  {
    id: 'kenyan',
    coffee: 'Kenyan AA',
    origin: 'Nyeri / Kirinyaga, Kenya',
    profile: 'Fruity',
    flavor: 'Blackcurrant, tomato, bright acidity',
    color: '#E8624A',
    pairings: [
      { food: 'Blackcurrant Jam on Toast', note: "Mirrors the cup's signature flavour note", emoji: '🫙' },
      { food: 'Aged Cheddar', note: 'Savory umami balances the high acidity', emoji: '🧀' },
      { food: 'Dark Cherry Chocolate', note: 'Deep fruit amplifies the wine-like body', emoji: '🍒' },
      { food: 'Tomato Bruschetta', note: 'Surprising savory match — the tomato note is real', emoji: '🍅' },
    ],
  },
  {
    id: 'colombian',
    coffee: 'Colombian Huila',
    origin: 'Huila, Colombia',
    profile: 'Sweet',
    flavor: 'Caramel, red apple, milk chocolate',
    color: '#F0A04B',
    pairings: [
      { food: 'Milk Chocolate', note: 'A classic — the caramel notes reinforce each other', emoji: '🍫' },
      { food: 'Caramel Apple', note: 'The red apple note in the cup is direct and real', emoji: '🍎' },
      { food: 'Banana Bread', note: 'Warm sweetness complements the medium body', emoji: '🍌' },
      { food: 'Granola & Yoghurt', note: 'Mild dairy-based breakfast pairing', emoji: '🥣' },
    ],
  },
  {
    id: 'brazilian',
    coffee: 'Brazil Cerrado',
    origin: 'Cerrado, Minas Gerais',
    profile: 'Nutty',
    flavor: 'Hazelnut, dark chocolate, low acidity',
    color: '#8B5E3C',
    pairings: [
      { food: 'Hazelnut Praline', note: 'Direct flavour echo — the nut note is prominent', emoji: '🌰' },
      { food: 'Peanut Butter Cookie', note: 'The nutty base of both aligns naturally', emoji: '🥜' },
      { food: 'Almond Croissant', note: 'Marzipan sweetness with buttery pastry', emoji: '🥐' },
      { food: 'Tiramisu', note: 'Coffee-on-coffee — the low acidity does not clash', emoji: '🍰' },
    ],
  },
  {
    id: 'guatemalan',
    coffee: 'Guatemalan Antigua',
    origin: 'Antigua, Guatemala',
    profile: 'Sweet',
    flavor: 'Brown sugar, cinnamon, dried fruit',
    color: '#D4823A',
    pairings: [
      { food: 'Cinnamon Roll', note: 'The warm spice in the coffee meets its match', emoji: '🍞' },
      { food: 'Dried Apricot', note: 'Stone fruit echoes the dried fruit complexity', emoji: '🍑' },
      { food: 'Gingerbread', note: 'Spiced warmth on both sides of the pairing', emoji: '🍪' },
      { food: 'Walnut Brownie', note: 'Rich sweetness with nutty contrast', emoji: '🍫' },
    ],
  },
  {
    id: 'sumatran',
    coffee: 'Sumatra Mandheling',
    origin: 'North Sumatra, Indonesia',
    profile: 'Earthy',
    flavor: 'Dark earth, cedar, dark chocolate, low acidity',
    color: '#7A6B52',
    pairings: [
      { food: 'Blue Cheese', note: 'Earthy pungency of both is bold and complementary', emoji: '🧀' },
      { food: 'Smoked Meat', note: 'Umami depth matches the forest-floor complexity', emoji: '🥩' },
      { food: 'Dark Rye Bread', note: 'Dense earthy bread is a natural companion', emoji: '🍞' },
      { food: '85% Dark Chocolate', note: 'Both are intense and non-apologetically deep', emoji: '🍫' },
    ],
  },
  {
    id: 'yemeni',
    coffee: 'Yemen Haraaz',
    origin: 'Haraaz Mountains, Yemen',
    profile: 'Spices',
    flavor: 'Cardamom, dried fruit, wine-like, wild',
    color: '#D4823A',
    pairings: [
      { food: 'Cardamom Dates', note: 'The spice note is directly mirrored', emoji: '🌴' },
      { food: 'Baklava', note: 'Honey and nut pastry with spiced coffee — a Middle Eastern classic', emoji: '🍯' },
      { food: 'Dried Figs', note: 'The wine-like depth in both aligns beautifully', emoji: '🫐' },
      { food: 'Rosewater Loukoum', note: 'Floral sweetness against the wild complexity', emoji: '🌹' },
    ],
  },
]

const ROAST_LEVELS = [
  {
    id: 'light',
    name: 'Light Roast',
    temp: '180–205°C',
    agtron: '60–80',
    stage: 'First crack begins, ends before completion',
    beanColor: '#C4875A',
    flavors: ['Floral', 'Fruity', 'Bright Acidity', 'Tea-like', 'Juicy'],
    loses: ['Heavy body', 'Chocolate notes', 'Bitterness'],
    bestBrewing: ['Pour Over', 'AeroPress', 'Siphon'],
    caffeine: 'Slightly higher',
    origins: ['Ethiopia Yirgacheffe', 'Kenya AA', 'Panama Geisha'],
    roasterNote: 'The most demanding to roast consistently. Even 5 seconds too long fundamentally changes the cup.',
    desc: "The lightest roasts prioritise origin expression above all. Every characteristic of the bean — terroir, varietal, and processing — is preserved in the cup. These are the wines of the coffee world: complex, variable, and polarising.",
  },
  {
    id: 'medium',
    name: 'Medium Roast',
    temp: '210–220°C',
    agtron: '50–60',
    stage: 'First crack complete, before second crack',
    beanColor: '#8B4A2C',
    flavors: ['Caramel', 'Stone Fruit', 'Balanced Acidity', 'Chocolate', 'Nutty'],
    loses: ['Some fruity brightness', 'Very delicate florals'],
    bestBrewing: ['Pour Over', 'Drip', 'AeroPress', 'French Press', 'Espresso'],
    caffeine: 'Standard',
    origins: ['Colombia Huila', 'Guatemala Antigua', 'Honduras Copan'],
    roasterNote: 'The benchmark. Most specialty cafés centre their filter menu here.',
    desc: "The most versatile and accessible roast. Medium sits at the crossroads of origin character and roast development — you taste both the bean and the roaster's craft. The roast level that wins the most barista competitions.",
  },
  {
    id: 'medium-dark',
    name: 'Medium-Dark',
    temp: '225–230°C',
    agtron: '35–50',
    stage: 'Second crack begins',
    beanColor: '#5C2E18',
    flavors: ['Bittersweet Chocolate', 'Molasses', 'Roasted Nuts', 'Low Acidity', 'Earthy'],
    loses: ['Fruit notes', 'Origin brightness', 'Delicacy'],
    bestBrewing: ['Espresso', 'Moka Pot', 'French Press', 'Cold Brew'],
    caffeine: 'Standard to slightly lower',
    origins: ['Brazil Santos', 'Sumatra Blends', 'Italian Espresso Blends'],
    roasterNote: 'The second crack sounds like Rice Krispies. Pull just after it begins for best results.',
    desc: "The workhorse of espresso. Bittersweet depth cuts through milk — which is why the world's most popular café drinks (lattes, cappuccinos, flat whites) are built on medium-dark espresso.",
  },
  {
    id: 'dark',
    name: 'Dark Roast',
    temp: '240–250°C',
    agtron: '25–35',
    stage: 'Deep into second crack',
    beanColor: '#2E160A',
    flavors: ['Smoky', 'Tobacco', 'Dark Chocolate', 'Charcoal'],
    loses: ['Origin character', 'Acidity', 'Fruit', 'Sweetness', 'Complexity'],
    bestBrewing: ['Espresso (Italian)', 'Moka Pot', 'French Press'],
    caffeine: 'Slightly lower',
    origins: ['French Roast Blends', 'Italian Roast', 'Dark Indonesian'],
    roasterNote: 'Push even slightly further and the bean becomes carbon. Very little margin here.',
    desc: "The traditional roast of Italian espresso houses and French café culture. Origin is largely obliterated — what you taste is the roast itself. The beans' oils have migrated to the surface, giving them a characteristic sheen.",
  },
]

// ── Tabs config ───────────────────────────────────────────────────────────────

const TABS = [
  { id: 'grind-size', label: 'Grind Size Guide' },
  { id: 'flavour-wheel', label: 'Flavour Wheel' },
  { id: 'food-pairings', label: 'Food Pairings' },
  { id: 'roast-levels', label: 'Roast Levels' },
]

const TAB_HERO = {
  'grind-size': {
    eyebrow: "The Grinder's Reference",
    titleLine1: 'Grind',
    titleLine2: 'Size Guide',
    desc: 'A visual reference for every grind size — from Turkish powder to cold brew gravel. Dial in with confidence.',
  },
  'flavour-wheel': {
    eyebrow: 'Sensory Lexicon',
    titleLine1: 'Flavour',
    titleLine2: 'Wheel',
    desc: 'An interactive SCA-inspired wheel mapping every flavour category found in specialty coffee — from fruity and floral to earthy and roasted.',
  },
  'food-pairings': {
    eyebrow: 'Beyond the Cup',
    titleLine1: 'Coffee &',
    titleLine2: 'Food',
    desc: 'A pairing guide for eight renowned coffees — matching each cup to the foods that amplify, contrast, and complete its flavour profile.',
  },
  'roast-levels': {
    eyebrow: 'From Green Bean to Cup',
    titleLine1: 'Roast',
    titleLine2: 'Levels',
    desc: 'The transformation of coffee through heat — what is gained, what is lost, and how each roast level shapes the brew.',
  },
}

// ── SVG helpers ───────────────────────────────────────────────────────────────

function polarToXY(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function segPath(cx, cy, r1, r2, a1, a2) {
  const GAP = 1.5
  const p1 = polarToXY(cx, cy, r1, a1 + GAP)
  const p2 = polarToXY(cx, cy, r1, a2 - GAP)
  const p3 = polarToXY(cx, cy, r2, a2 - GAP)
  const p4 = polarToXY(cx, cy, r2, a1 + GAP)
  const large = (a2 - a1 - 2 * GAP) > 180 ? 1 : 0
  return `M${p1.x.toFixed(1)},${p1.y.toFixed(1)} A${r1},${r1} 0 ${large},1 ${p2.x.toFixed(1)},${p2.y.toFixed(1)} L${p3.x.toFixed(1)},${p3.y.toFixed(1)} A${r2},${r2} 0 ${large},0 ${p4.x.toFixed(1)},${p4.y.toFixed(1)}Z`
}

// ── Tab 1: Grind Size ─────────────────────────────────────────────────────────

function ParticleDots({ r, color }) {
  const spacing = r * 2.5
  const cx = 12
  const cy = 12
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx={cx - spacing * 0.8} cy={cy} r={r} fill={color} opacity={0.85} />
      <circle cx={cx} cy={cy} r={r} fill={color} />
      <circle cx={cx + spacing * 0.8} cy={cy} r={r} fill={color} opacity={0.85} />
    </svg>
  )
}

// ── GrinderDial ───────────────────────────────────────────────────────────────

function GrinderDial({ selected, onChange }) {
  const CX = 150
  const CY = 150
  const START_DEG = -135
  const SWEEP = 270

  const idxToAngle = (i) => START_DEG + (i / 6) * SWEEP

  const selectedIdx = GRIND_SIZES.findIndex((g) => g.id === selected)
  const [liveAngle, setLiveAngle] = useState(() => idxToAngle(selectedIdx < 0 ? 0 : selectedIdx))
  const dragging = useRef(false)
  const svgRef = useRef(null)

  // Sync liveAngle when selected changes externally (e.g. snap on release)
  useEffect(() => {
    if (!dragging.current) {
      const idx = GRIND_SIZES.findIndex((g) => g.id === selected)
      if (idx >= 0) setLiveAngle(idxToAngle(idx))
    }
  }, [selected])

  const getAngleFromEvent = (e) => {
    const svg = svgRef.current
    if (!svg) return 0
    const rect = svg.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const dx = clientX - cx
    const dy = clientY - cy
    // Angle from 12-o'clock, clockwise positive
    const angleDeg = (Math.atan2(dx, -dy) * 180) / Math.PI
    return angleDeg
  }

  const clampToSweep = (angleDeg) => {
    const clamped = Math.max(START_DEG, Math.min(START_DEG + SWEEP, angleDeg))
    return clamped
  }

  const angleToNearestIdx = (angleDeg) => {
    let nearestIdx = 0
    let minDist = Infinity
    GRIND_SIZES.forEach((_, i) => {
      const dist = Math.abs(angleDeg - idxToAngle(i))
      if (dist < minDist) {
        minDist = dist
        nearestIdx = i
      }
    })
    return nearestIdx
  }

  const handleMouseDown = (e) => {
    e.preventDefault()
    dragging.current = true
    const angle = clampToSweep(getAngleFromEvent(e))
    setLiveAngle(angle)
    const idx = angleToNearestIdx(angle)
    onChange(GRIND_SIZES[idx].id)
  }

  const handleTouchStart = (e) => {
    dragging.current = true
    const angle = clampToSweep(getAngleFromEvent(e))
    setLiveAngle(angle)
    const idx = angleToNearestIdx(angle)
    onChange(GRIND_SIZES[idx].id)
  }

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return
      const angle = clampToSweep(getAngleFromEvent(e))
      setLiveAngle(angle)
      const idx = angleToNearestIdx(angle)
      onChange(GRIND_SIZES[idx].id)
    }
    const onUp = () => {
      if (!dragging.current) return
      dragging.current = false
      setLiveAngle((prev) => {
        const idx = angleToNearestIdx(prev)
        return idxToAngle(idx)
      })
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [onChange])

  const grind = GRIND_SIZES.find((g) => g.id === selected) || GRIND_SIZES[0]

  // Build 36 ridge lines around knob body
  const ridges = Array.from({ length: 36 }, (_, i) => {
    const angle = (i / 36) * 360
    const rad = ((angle - 90) * Math.PI) / 180
    const x1 = CX + 88 * Math.cos(rad)
    const y1 = CY + 88 * Math.sin(rad)
    const x2 = CX + 95 * Math.cos(rad)
    const y2 = CY + 95 * Math.sin(rad)
    return { x1, y1, x2, y2 }
  })

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 300 300"
      className="w-full max-w-[320px] mx-auto select-none"
      style={{ cursor: 'grab', touchAction: 'none' }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Outer background disc */}
      <circle cx={CX} cy={CY} r={145} fill="var(--color-surface)" />
      {/* Outer ring */}
      <circle cx={CX} cy={CY} r={145} fill="none" stroke="var(--color-border)" strokeWidth={1} />

      {/* Colored arc segments between adjacent ticks */}
      {GRIND_SIZES.map((g, i) => {
        if (i === GRIND_SIZES.length - 1) return null
        const a1 = idxToAngle(i)
        const a2 = idxToAngle(i + 1)
        const rad1 = ((a1 - 90) * Math.PI) / 180
        const rad2 = ((a2 - 90) * Math.PI) / 180
        const x1 = CX + 120 * Math.cos(rad1)
        const y1 = CY + 120 * Math.sin(rad1)
        const x2 = CX + 120 * Math.cos(rad2)
        const y2 = CY + 120 * Math.sin(rad2)
        const large = (a2 - a1) > 180 ? 1 : 0
        return (
          <path
            key={g.id}
            d={`M${x1.toFixed(1)},${y1.toFixed(1)} A120,120 0 ${large},1 ${x2.toFixed(1)},${y2.toFixed(1)}`}
            fill="none"
            stroke={g.color}
            strokeWidth={4}
            opacity={0.4}
            strokeLinecap="round"
          />
        )
      })}

      {/* Tick marks and labels */}
      {GRIND_SIZES.map((g, i) => {
        const angle = idxToAngle(i)
        const rad = ((angle - 90) * Math.PI) / 180
        const isActive = g.id === selected
        // Tick inner/outer
        const x1 = CX + 108 * Math.cos(rad)
        const y1 = CY + 108 * Math.sin(rad)
        const x2 = CX + 122 * Math.cos(rad)
        const y2 = CY + 122 * Math.sin(rad)
        // Label position
        const lx = CX + 140 * Math.cos(rad)
        const ly = CY + 140 * Math.sin(rad)
        return (
          <g key={g.id}>
            <line
              x1={x1.toFixed(1)} y1={y1.toFixed(1)}
              x2={x2.toFixed(1)} y2={y2.toFixed(1)}
              stroke={isActive ? g.color : 'var(--color-text-faint)'}
              strokeWidth={isActive ? 3 : 1.5}
              opacity={isActive ? 1 : 0.5}
              strokeLinecap="round"
            />
            <text
              x={lx.toFixed(1)}
              y={ly.toFixed(1)}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={7.5}
              fontFamily="Space Mono, monospace"
              fontWeight={isActive ? 700 : 400}
              fill={isActive ? g.color : 'var(--color-text-faint)'}
              opacity={isActive ? 1 : 0.7}
            >
              {g.name}
            </text>
          </g>
        )
      })}

      {/* Knob body */}
      <circle cx={CX} cy={CY} r={95} fill="var(--color-card)" />
      {/* Ridge lines */}
      {ridges.map((r, i) => (
        <line
          key={i}
          x1={r.x1.toFixed(1)} y1={r.y1.toFixed(1)}
          x2={r.x2.toFixed(1)} y2={r.y2.toFixed(1)}
          stroke="var(--color-border)"
          strokeWidth={1}
          opacity={0.35}
        />
      ))}
      {/* Inner disc */}
      <circle cx={CX} cy={CY} r={82} fill="var(--color-surface)" />

      {/* Indicator — rotates with liveAngle */}
      <g
        style={{
          transform: `rotate(${liveAngle}deg)`,
          transformOrigin: `${CX}px ${CY}px`,
          transition: dragging.current ? 'none' : 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Indicator line */}
        <line
          x1={CX} y1={CY - 15}
          x2={CX} y2={CY - 65}
          stroke={grind.color}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        {/* Triangle tip */}
        <polygon
          points={`${CX},${CY - 78} ${CX - 5},${CY - 63} ${CX + 5},${CY - 63}`}
          fill={grind.color}
          stroke={grind.color}
          strokeWidth={1}
        />
      </g>

      {/* Center cap */}
      <circle cx={CX} cy={CY} r={30} fill="var(--color-card)" stroke={grind.color} strokeWidth={1.5} />
      <text
        x={CX} y={CY - 7}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={8}
        fontFamily="Space Mono, monospace"
        fontWeight={700}
        fill={grind.color}
      >
        GRIND
      </text>
      <text
        x={CX} y={CY + 8}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={8}
        fontFamily="Space Mono, monospace"
        fontWeight={700}
        fill={grind.color}
      >
        SIZE
      </text>

      {/* Footer text */}
      <text
        x={CX} y={288}
        textAnchor="middle"
        fontSize={7}
        fontFamily="Space Mono, monospace"
        fill="var(--color-text-faint)"
        opacity={0.5}
      >
        ← Finer · · · · Coarser →
      </text>
    </svg>
  )
}

function GrindSizeTab() {
  const [selected, setSelected] = useState('espresso')
  const grind = GRIND_SIZES.find((g) => g.id === selected)

  return (
    <motion.section
      key="grind-size"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28 }}
      className="w-full max-w-[1200px] mx-auto px-4 sm:px-8 xl:px-16 pb-24"
    >
      {/* Grinder Dial */}
      <div className="mb-10 flex flex-col items-center gap-2">
        <p className="label-ornate">Rotate to Dial In</p>
        <GrinderDial selected={selected} onChange={setSelected} />
      </div>

      {/* Detail card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl overflow-hidden"
          style={{
            border: `1.5px solid ${grind.color}40`,
            background: 'var(--color-card)',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Left accent panel */}
            <div
              className="p-8 flex flex-col justify-between"
              style={{ background: `${grind.color}18`, borderRight: `1px solid ${grind.color}30` }}
            >
              <div>
                <p className="label-ornate mb-3" style={{ color: grind.color }}>Grind Profile</p>
                <h2 className="font-display text-4xl mb-2" style={{ color: 'var(--color-text)' }}>{grind.name}</h2>
                <p className="text-2xl font-bold mb-6" style={{ fontFamily: 'Space Mono, monospace', color: grind.color }}>{grind.microns}</p>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.18em] mb-1" style={{ fontFamily: 'Space Mono, monospace', color: 'var(--color-text-faint)' }}>Dial Position</p>
                  <p className="text-base font-medium" style={{ color: 'var(--color-text)' }}>{grind.dialPos}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.18em] mb-1" style={{ fontFamily: 'Space Mono, monospace', color: 'var(--color-text-faint)' }}>Water Temp</p>
                  <p className="text-base font-medium" style={{ color: 'var(--color-text)' }}>{grind.waterTemp}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.18em] mb-1" style={{ fontFamily: 'Space Mono, monospace', color: 'var(--color-text-faint)' }}>Texture</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{grind.particle}</p>
                </div>
              </div>
            </div>

            {/* Right content */}
            <div className="p-8 md:col-span-2 flex flex-col justify-between gap-6">
              <p className="text-base leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{grind.desc}</p>
              <div>
                <p className="text-[9px] uppercase tracking-[0.18em] mb-3" style={{ fontFamily: 'Space Mono, monospace', color: 'var(--color-text-faint)' }}>Brewers</p>
                <div className="flex flex-wrap gap-2">
                  {grind.brewers.map((b) => (
                    <span
                      key={b}
                      className="px-3 py-1.5 rounded-full text-[11px] font-medium"
                      style={{
                        background: `${grind.color}20`,
                        color: grind.color,
                        border: `1px solid ${grind.color}40`,
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.section>
  )
}

// ── Tab 2: Flavour Wheel ──────────────────────────────────────────────────────

function FlavourWheelTab() {
  const [selectedId, setSelectedId] = useState('fruity')
  const cat = FLAVOUR_CATEGORIES.find((c) => c.id === selectedId)
  const cx = 190
  const cy = 190
  const r1 = 62
  const r2 = 125
  const r3 = 185

  return (
    <motion.section
      key="flavour-wheel"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28 }}
      className="w-full max-w-[1200px] mx-auto px-4 sm:px-8 xl:px-16 pb-24"
    >
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* SVG Wheel */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <svg
            viewBox="0 0 380 380"
            className="max-w-[380px] w-full mx-auto"
            style={{ filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.28))' }}
          >
            {/* Inner ring segments */}
            {FLAVOUR_CATEGORIES.map((c) => {
              const isActive = selectedId === c.id
              const midAngle = (c.startDeg + c.endDeg) / 2
              const labelPos = polarToXY(cx, cy, 93, midAngle)
              return (
                <g key={c.id}>
                  <motion.path
                    d={segPath(cx, cy, r1, r2, c.startDeg, c.endDeg)}
                    fill={c.color}
                    opacity={isActive ? 1 : 0.72}
                    onClick={() => setSelectedId(c.id)}
                    style={{ cursor: 'pointer' }}
                    whileHover={{ opacity: 1 }}
                    animate={{ opacity: isActive ? 1 : 0.72 }}
                    transition={{ duration: 0.2 }}
                  />
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="7"
                    fill="white"
                    fontFamily="Inter, sans-serif"
                    fontWeight="600"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {c.name.length > 10 ? c.name.split('/')[0] : c.name}
                  </text>
                </g>
              )
            })}

            {/* Outer ring — only for selected category */}
            <AnimatePresence>
              {cat && cat.subs.map((sub, i) => {
                const arcSize = (cat.endDeg - cat.startDeg) / cat.subs.length
                const a1 = cat.startDeg + i * arcSize
                const a2 = a1 + arcSize
                const midAngle = (a1 + a2) / 2
                const labelPos = polarToXY(cx, cy, (r2 + r3) / 2, midAngle)
                return (
                  <motion.g
                    key={`${cat.id}-${sub.name}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.22, delay: i * 0.05 }}
                    style={{ transformOrigin: `${cx}px ${cy}px` }}
                  >
                    <path
                      d={segPath(cx, cy, r2, r3, a1, a2)}
                      fill={cat.color}
                      opacity={0.45}
                    />
                    <text
                      x={labelPos.x}
                      y={labelPos.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="6.5"
                      fill="white"
                      fontFamily="Inter, sans-serif"
                      fontWeight="600"
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >
                      {sub.name}
                    </text>
                  </motion.g>
                )
              })}
            </AnimatePresence>

            {/* Center circle */}
            <circle cx={cx} cy={cy} r={r1 - 2} fill="var(--color-card)" />
            <text
              x={cx}
              y={cy - 7}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="9"
              fill={cat ? cat.color : 'var(--color-text-muted)'}
              fontFamily="Space Mono, monospace"
              fontWeight="700"
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {cat ? cat.name.split('/')[0].toUpperCase() : 'FLAVOUR'}
            </text>
            <text
              x={cx}
              y={cy + 8}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="9"
              fill="var(--color-text-faint)"
              fontFamily="Space Mono, monospace"
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {cat ? '' : 'WHEEL'}
            </text>
          </svg>
        </div>

        {/* Detail panel */}
        <div className="w-full lg:w-1/2">
          <AnimatePresence mode="wait">
            {cat && (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.28 }}
              >
                <div className="mb-6">
                  <p className="label-ornate mb-2">Category</p>
                  <h2
                    className="font-display text-4xl mb-4"
                    style={{ color: cat.color }}
                  >
                    {cat.name}
                  </h2>
                  <p className="text-base leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                    {cat.desc}
                  </p>
                </div>

                <div className="mb-6">
                  <p className="text-[9px] uppercase tracking-[0.18em] mb-2" style={{ fontFamily: 'Space Mono, monospace', color: 'var(--color-text-faint)' }}>
                    Origin Examples
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cat.origins.map((o) => (
                      <span
                        key={o}
                        className="px-2.5 py-1 rounded-full text-[10px]"
                        style={{
                          background: `${cat.color}18`,
                          color: cat.color,
                          border: `1px solid ${cat.color}30`,
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        {o}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[9px] uppercase tracking-[0.18em]" style={{ fontFamily: 'Space Mono, monospace', color: 'var(--color-text-faint)' }}>
                    Subcategories
                  </p>
                  {cat.subs.map((sub) => (
                    <div
                      key={sub.name}
                      className="rounded-xl p-4"
                      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                    >
                      <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: cat.color, fontFamily: 'Space Mono, monospace' }}>
                        {sub.name}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {sub.words.map((w) => (
                          <span
                            key={w}
                            className="px-2.5 py-1 rounded-full text-[11px]"
                            style={{
                              background: 'var(--color-card)',
                              color: 'var(--color-text-muted)',
                              border: '1px solid var(--color-border)',
                              fontFamily: 'Inter, sans-serif',
                            }}
                          >
                            {w}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  )
}

// ── Tab 3: Food Pairings ──────────────────────────────────────────────────────

const PROFILE_FILTERS = ['All', 'Fruity', 'Floral', 'Sweet', 'Nutty', 'Earthy', 'Spices']

function FoodPairingsTab() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = activeFilter === 'All'
    ? FOOD_PAIRINGS
    : FOOD_PAIRINGS.filter((p) => p.profile === activeFilter)

  return (
    <motion.section
      key="food-pairings"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28 }}
      className="w-full max-w-[1200px] mx-auto px-4 sm:px-8 xl:px-16 pb-24"
    >
      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-10">
        {PROFILE_FILTERS.map((f) => {
          const isActive = activeFilter === f
          return (
            <motion.button
              key={f}
              onClick={() => setActiveFilter(f)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="relative px-5 py-2 rounded-full text-[11px] uppercase tracking-[0.16em] font-medium transition-colors duration-200 focus:outline-none"
              style={{
                fontFamily: 'Inter, sans-serif',
                color: isActive ? 'var(--color-bg)' : 'var(--color-text-muted)',
                zIndex: 0,
              }}
            >
              {isActive && (
                <motion.span
                  layoutId="pairingPill"
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'var(--color-accent)', zIndex: -1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              {f}
            </motion.button>
          )
        })}
      </div>

      {/* Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="space-y-5"
        >
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              className="rounded-2xl overflow-hidden flex flex-col md:flex-row"
              style={{
                border: `1.5px solid ${item.color}40`,
                background: 'var(--color-card)',
              }}
            >
              {/* Left panel */}
              <div
                className="md:w-1/3 p-6 flex flex-col justify-between gap-4"
                style={{
                  background: `${item.color}18`,
                  borderRight: `1px solid ${item.color}30`,
                }}
              >
                <div>
                  <h3 className="font-display text-xl mb-1" style={{ color: 'var(--color-text)' }}>{item.coffee}</h3>
                  <p className="text-[11px] mb-3" style={{ color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace' }}>{item.origin}</p>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-muted)' }}>{item.flavor}</p>
                </div>
                <span
                  className="self-start px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                  style={{
                    background: `${item.color}30`,
                    color: item.color,
                    border: `1px solid ${item.color}50`,
                    fontFamily: 'Space Mono, monospace',
                  }}
                >
                  {item.profile}
                </span>
              </div>

              {/* Right panel */}
              <div className="md:w-2/3 p-6">
                <div className="space-y-3">
                  {item.pairings.map((p) => (
                    <div key={p.food} className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0">{p.emoji}</span>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{p.food}</p>
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)', fontFamily: 'Inter, sans-serif' }}>{p.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.section>
  )
}

// ── RoastGauge ────────────────────────────────────────────────────────────────

const ZONES = [
  { id: 'light',       tempStart: 175, tempEnd: 207, color: '#C4875A', label: 'Light' },
  { id: 'medium',      tempStart: 207, tempEnd: 222, color: '#8B4A2C', label: 'Medium' },
  { id: 'medium-dark', tempStart: 222, tempEnd: 235, color: '#5C2E18', label: 'Med-Dark' },
  { id: 'dark',        tempStart: 235, tempEnd: 255, color: '#2E160A', label: 'Dark' },
]

const TEMP_MIN = 175
const TEMP_MAX = 255
const ANG_START = -130
const ANG_END = 130
const ROAST_SNAP = { light: -97.5, medium: -1.6, 'medium-dark': 43.9, dark: 97.5 }

function tempToAngle(temp) {
  return ANG_START + ((temp - TEMP_MIN) / (TEMP_MAX - TEMP_MIN)) * (ANG_END - ANG_START)
}

function angleToTemp(deg) {
  return TEMP_MIN + ((deg - ANG_START) / (ANG_END - ANG_START)) * (TEMP_MAX - TEMP_MIN)
}

function angleToZone(deg) {
  const temp = angleToTemp(deg)
  for (const z of ZONES) {
    if (temp >= z.tempStart && temp < z.tempEnd) return z
  }
  return temp < ZONES[0].tempStart ? ZONES[0] : ZONES[ZONES.length - 1]
}

function RoastGauge({ selected, onSelect }) {
  const CX = 200
  const CY = 150
  const OUTER_R = 120
  const INNER_R = 85

  const snapAngle = ROAST_SNAP[selected] ?? tempToAngle((ZONES.find(z => z.id === selected)?.tempStart ?? TEMP_MIN + (TEMP_MAX - TEMP_MIN) / 2))
  const [needleAngle, setNeedleAngle] = useState(snapAngle)
  const dragging = useRef(false)
  const svgRef = useRef(null)

  // Sync needle when selected changes externally
  useEffect(() => {
    if (!dragging.current && ROAST_SNAP[selected] !== undefined) {
      setNeedleAngle(ROAST_SNAP[selected])
    }
  }, [selected])

  const currentZone = angleToZone(needleAngle)
  const currentTemp = Math.round(angleToTemp(needleAngle))

  const getAngleFromEvent = (e) => {
    const svg = svgRef.current
    if (!svg) return 0
    const rect = svg.getBoundingClientRect()
    const cx = rect.left + (CX / 400) * rect.width
    const cy = rect.top + (CY / 230) * rect.height
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const dx = clientX - cx
    const dy = clientY - cy
    const angleDeg = (Math.atan2(dx, -dy) * 180) / Math.PI
    // Clamp to sweep range
    return Math.max(ANG_START, Math.min(ANG_END, angleDeg))
  }

  const handleMouseDown = (e) => {
    e.preventDefault()
    dragging.current = true
    const angle = getAngleFromEvent(e)
    setNeedleAngle(angle)
    const zone = angleToZone(angle)
    onSelect(zone.id)
  }

  const handleTouchStart = (e) => {
    dragging.current = true
    const angle = getAngleFromEvent(e)
    setNeedleAngle(angle)
    const zone = angleToZone(angle)
    onSelect(zone.id)
  }

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return
      const angle = getAngleFromEvent(e)
      setNeedleAngle(angle)
      const zone = angleToZone(angle)
      onSelect(zone.id)
    }
    const onUp = () => {
      if (!dragging.current) return
      dragging.current = false
      // Snap to zone midpoint angle
      setNeedleAngle((prev) => {
        const zone = angleToZone(prev)
        return ROAST_SNAP[zone.id] ?? prev
      })
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [onSelect])

  // Temperature ticks every 10°C from 180–250
  const tempTicks = []
  for (let t = 180; t <= 250; t += 10) {
    const angle = tempToAngle(t)
    const rad = ((angle - 90) * Math.PI) / 180
    const x1 = CX + (INNER_R - 2) * Math.cos(rad)
    const y1 = CY + (INNER_R - 2) * Math.sin(rad)
    const x2 = CX + INNER_R * Math.cos(rad)
    const y2 = CY + INNER_R * Math.sin(rad)
    tempTicks.push({ x1, y1, x2, y2, key: t })
  }

  // Needle elements drawn at 0° (pointing up), then rotated by needleAngle
  const needleEndX = CX
  const needleEndY = CY - (INNER_R - 6)

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 230"
      className="w-full max-w-[440px] mx-auto select-none"
      style={{ cursor: 'grab', touchAction: 'none', overflow: 'visible' }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Zone arc segments */}
      {ZONES.map((zone) => {
        const a1 = tempToAngle(zone.tempStart)
        const a2 = tempToAngle(zone.tempEnd)
        const isActive = zone.id === selected
        return (
          <path
            key={zone.id}
            d={segPath(CX, CY, INNER_R, OUTER_R, a1, a2)}
            fill={zone.color}
            opacity={isActive ? 1 : 0.4}
            style={{ transition: 'opacity 0.3s' }}
          />
        )
      })}

      {/* Zone labels */}
      {ZONES.map((zone) => {
        const midAngle = (tempToAngle(zone.tempStart) + tempToAngle(zone.tempEnd)) / 2
        const rad = ((midAngle - 90) * Math.PI) / 180
        const lx = CX + (OUTER_R + 16) * Math.cos(rad)
        const ly = CY + (OUTER_R + 16) * Math.sin(rad)
        const isActive = zone.id === selected
        return (
          <text
            key={zone.id}
            x={lx.toFixed(1)}
            y={ly.toFixed(1)}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={8}
            fontFamily="Space Mono, monospace"
            fontWeight={isActive ? 700 : 400}
            fill={isActive ? zone.color : 'var(--color-text-faint)'}
          >
            {zone.label}
          </text>
        )
      })}

      {/* Temperature ticks */}
      {tempTicks.map((tick) => (
        <line
          key={tick.key}
          x1={tick.x1.toFixed(1)} y1={tick.y1.toFixed(1)}
          x2={tick.x2.toFixed(1)} y2={tick.y2.toFixed(1)}
          stroke="rgba(255,255,255,0.25)"
          strokeWidth={1}
        />
      ))}

      {/* Needle group — rotated by needleAngle */}
      <g
        style={{
          transform: `rotate(${needleAngle}deg)`,
          transformOrigin: `${CX}px ${CY}px`,
          transition: dragging.current ? 'none' : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <line
          x1={CX} y1={CY}
          x2={needleEndX} y2={needleEndY}
          stroke={currentZone.color}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <circle
          cx={needleEndX}
          cy={needleEndY}
          r={5}
          fill={currentZone.color}
        />
      </g>

      {/* Center pivot */}
      <circle cx={CX} cy={CY} r={10} fill="var(--color-card)" stroke={currentZone.color} strokeWidth={2} />

      {/* Temperature display */}
      <text
        x={CX} y={CY + 25}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={20}
        fontFamily="Space Mono, monospace"
        fontWeight={700}
        fill="var(--color-text)"
      >
        {currentTemp}°C
      </text>
      <text
        x={CX} y={CY + 40}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={9}
        fontFamily="Space Mono, monospace"
        fill="var(--color-text-faint)"
      >
        {currentZone.label} Roast
      </text>
    </svg>
  )
}

// ── Tab 4: Roast Levels ───────────────────────────────────────────────────────

function RoastLevelsTab() {
  const [expanded, setExpanded] = useState(null)
  const [selected, setSelected] = useState(null)

  return (
    <motion.section
      key="roast-levels"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28 }}
      className="w-full max-w-[1200px] mx-auto px-4 sm:px-8 xl:px-16 pb-24"
    >
      {/* Roast Gauge */}
      <div className="mb-10 flex flex-col items-center gap-3">
        <p className="label-ornate">Drag the Needle</p>
        <RoastGauge selected={selected || 'medium'} onSelect={setSelected} />
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ROAST_LEVELS.map((roast) => {
          const isExpanded = expanded === roast.id
          const agtronLow = parseInt(roast.agtron)
          const barWidth = Math.max(20, Math.min(100, 100 - ((agtronLow / 80) * 80)))
          return (
            <motion.div
              key={roast.id}
              layout
              onClick={() => setExpanded(isExpanded ? null : roast.id)}
              className="rounded-2xl overflow-hidden cursor-pointer"
              style={{
                border: selected === roast.id || expanded === roast.id ? `1.5px solid ${roast.beanColor}cc` : `1.5px solid ${roast.beanColor}50`,
                background: 'var(--color-card)',
              }}
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            >
              {/* Card header */}
              <div className="p-5" style={{ borderBottom: `1px solid ${roast.beanColor}25` }}>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-full flex-shrink-0"
                    style={{
                      background: roast.beanColor,
                      boxShadow: `0 4px 16px ${roast.beanColor}50`,
                    }}
                  />
                  <div>
                    <h3 className="font-display text-lg leading-tight" style={{ color: 'var(--color-text)' }}>{roast.name}</h3>
                    <p className="text-[10px]" style={{ color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace' }}>{roast.temp}</p>
                  </div>
                </div>

                {/* Agtron bar */}
                <div className="mb-3">
                  <p className="text-[8px] uppercase tracking-[0.16em] mb-1" style={{ fontFamily: 'Space Mono, monospace', color: 'var(--color-text-faint)' }}>
                    Agtron {roast.agtron}
                  </p>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${barWidth}%`,
                        background: roast.beanColor,
                      }}
                    />
                  </div>
                </div>

                <p
                  className="text-[10px] italic"
                  style={{ fontFamily: 'Space Mono, monospace', color: 'var(--color-text-faint)' }}
                >
                  {roast.stage}
                </p>
              </div>

              {/* Card body */}
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-[8px] uppercase tracking-[0.16em] mb-2 flex items-center gap-1.5" style={{ fontFamily: 'Space Mono, monospace', color: 'var(--color-text-faint)' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5A9E6A', display: 'inline-block' }} />
                    Flavours Gained
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {roast.flavors.map((f) => (
                      <span
                        key={f}
                        className="px-2 py-0.5 rounded-full text-[9px]"
                        style={{
                          background: '#5A9E6A18',
                          color: '#5A9E6A',
                          border: '1px solid #5A9E6A30',
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[8px] uppercase tracking-[0.16em] mb-2 flex items-center gap-1.5" style={{ fontFamily: 'Space Mono, monospace', color: 'var(--color-text-faint)' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C45A5A', display: 'inline-block' }} />
                    {"What's Lost"}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {roast.loses.map((l) => (
                      <span
                        key={l}
                        className="px-2 py-0.5 rounded-full text-[9px]"
                        style={{
                          background: '#C45A5A18',
                          color: '#C45A5A',
                          border: '1px solid #C45A5A30',
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[8px] uppercase tracking-[0.16em] mb-2" style={{ fontFamily: 'Space Mono, monospace', color: 'var(--color-text-faint)' }}>Best Brewing</p>
                  <div className="flex flex-wrap gap-1">
                    {roast.bestBrewing.map((b) => (
                      <span
                        key={b}
                        className="px-2 py-0.5 rounded-full text-[9px]"
                        style={{
                          background: 'var(--color-surface)',
                          color: 'var(--color-text-muted)',
                          border: '1px solid var(--color-border)',
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[8px] uppercase tracking-[0.16em] mb-1" style={{ fontFamily: 'Space Mono, monospace', color: 'var(--color-text-faint)' }}>Caffeine</p>
                  <p className="text-[11px]" style={{ color: 'var(--color-text-muted)', fontFamily: 'Inter, sans-serif' }}>{roast.caffeine}</p>
                </div>

                {/* Roaster's note */}
                <blockquote
                  className="pl-3 italic text-[11px] leading-relaxed"
                  style={{
                    borderLeft: `3px solid ${roast.beanColor}`,
                    color: 'var(--color-text-muted)',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {roast.roasterNote}
                </blockquote>

                {/* Expanded content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.28 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="pt-4 border-t space-y-3"
                        style={{ borderColor: `${roast.beanColor}30` }}
                      >
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{roast.desc}</p>
                        <div>
                          <p className="text-[8px] uppercase tracking-[0.16em] mb-2" style={{ fontFamily: 'Space Mono, monospace', color: 'var(--color-text-faint)' }}>Origins</p>
                          <div className="flex flex-wrap gap-1">
                            {roast.origins.map((o) => (
                              <span
                                key={o}
                                className="px-2 py-0.5 rounded-full text-[9px]"
                                style={{
                                  background: `${roast.beanColor}18`,
                                  color: roast.beanColor,
                                  border: `1px solid ${roast.beanColor}30`,
                                  fontFamily: 'Inter, sans-serif',
                                }}
                              >
                                {o}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <p
                  className="text-[9px] uppercase tracking-[0.14em] text-center pt-1"
                  style={{ color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace' }}
                >
                  {isExpanded ? 'Click to collapse' : 'Click to expand'}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.section>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function CoffeeReference() {
  const [activeTab, setActiveTab] = useState('grind-size')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <SEO
        title="Coffee Reference"
        description="Your complete coffee reference — grind size guide, interactive flavour wheel, food pairings, and roast levels explained in depth."
      />
      <BackButton to="/" label="Home" />

      {/* Hero */}
      <section
        className="py-20 md:py-28 px-6 sm:px-10 xl:px-16 relative"
        style={{
          background: 'linear-gradient(180deg, #1C2B14 0%, transparent 100%)',
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
                    <span className="font-display italic" style={{ color: 'var(--color-accent)' }}>
                      {TAB_HERO[activeTab].titleLine2}
                    </span>
                  </h1>
                </div>
                <div>
                  <div className="w-10 h-px mb-6" style={{ background: 'rgba(201,168,76,0.4)' }} />
                  <p className="text-parchment/55 text-base md:text-lg leading-loose">
                    {TAB_HERO[activeTab].desc}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Pill tab bar */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 xl:px-16 mb-10">
        <div
          className="flex items-center gap-2 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none' }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex-shrink-0 px-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-200 focus:outline-none rounded-full"
                style={{
                  color: isActive ? 'var(--color-bg)' : 'var(--color-text-muted)',
                  fontFamily: 'Inter, sans-serif',
                  zIndex: 0,
                }}
              >
                {isActive && (
                  <motion.span
                    layoutId="refPill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'var(--color-accent)', zIndex: -1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                {tab.label}
              </motion.button>
            )
          })}
        </div>
        <div
          style={{
            height: 1,
            background: 'linear-gradient(90deg, rgba(201,168,76,0.2), transparent)',
            marginTop: '12px',
          }}
        />
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === 'grind-size' && <GrindSizeTab key="grind-size" />}
        {activeTab === 'flavour-wheel' && <FlavourWheelTab key="flavour-wheel" />}
        {activeTab === 'food-pairings' && <FoodPairingsTab key="food-pairings" />}
        {activeTab === 'roast-levels' && <RoastLevelsTab key="roast-levels" />}
      </AnimatePresence>
    </div>
  )
}
