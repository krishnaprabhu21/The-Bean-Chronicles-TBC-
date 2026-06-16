import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SEO } from '../components/ui/SEO'
import { useTheme } from '../contexts/ThemeContext'

// ── Shared helpers ─────────────────────────────────────────────────────────────

const BADGE_STYLE = {
  Bestseller: { bg: 'rgba(201,168,76,0.16)', color: '#C9A84C',  border: 'rgba(201,168,76,0.3)'  },
  New:        { bg: 'rgba(74,222,128,0.12)', color: '#4ade80',  border: 'rgba(74,222,128,0.22)' },
  Sale:       { bg: 'rgba(248,113,113,0.12)',color: '#f87171',  border: 'rgba(248,113,113,0.22)'},
  Limited:    { bg: 'rgba(196,181,253,0.12)',color: '#c4b5fd',  border: 'rgba(196,181,253,0.22)'},
}

const COLOR_HEX = {
  Espresso: '#2D1B14', Forest: '#1C2B14', Cream: '#E8DFD0', 'Dark Roast': '#1A0900',
  Mist: '#C9D4C0', Black: '#111', Natural: '#D4C4A8', Slate: '#64748B',
  Copper: '#B87333', Sage: '#6B8F71', Earth: '#7C5C42', 'Matte Black': '#222',
  'Ceramic White': '#F0EDE8', Mocha: '#6B4226', 'Gold / Enamel': '#C9A84C',
}

// ── "Brewed by the World" data ─────────────────────────────────────────────────

const WORLD_PRODUCTS = [
  {
    id: 'w1',
    name: 'Hario V60 Drip Set',
    subtitle: 'Pour over glass dripper + server',
    description: 'The classic pour-over used by specialty cafés worldwide. Glass dripper, 700 ml server, 40 paper filters.',
    price: '₹2,499',
    priceUSD: '$29',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
    retailers: [
      { name: 'Amazon', url: 'https://www.amazon.in/s?k=hario+v60', color: '#FF9900' },
      { name: 'Flipkart', url: 'https://www.flipkart.com/search?q=hario+v60', color: '#2874F0' },
    ],
  },
  {
    id: 'w2',
    name: 'Fellow Stagg EKG Kettle',
    subtitle: 'Variable-temp gooseneck electric kettle',
    description: 'Precision pour with ±1°C temperature control. Brew-ready hold for 60 min. Matte black.',
    price: '₹14,999',
    priceUSD: '$179',
    image: 'https://images.unsplash.com/photo-1551830820-330a71b99659?w=600&q=80',
    retailers: [
      { name: 'Amazon', url: 'https://www.amazon.in/s?k=fellow+stagg+kettle', color: '#FF9900' },
    ],
  },
  {
    id: 'w3',
    name: 'Baratza Encore Grinder',
    subtitle: '40 grind settings, conical burr',
    description: 'The entry-level grinder recommended by every barista. 40 grind settings from fine espresso to coarse French press.',
    price: '₹18,500',
    priceUSD: '$219',
    image: 'https://images.unsplash.com/photo-1457301353672-324d6d14f471?w=600&q=80',
    retailers: [
      { name: 'Amazon', url: 'https://www.amazon.in/s?k=baratza+encore', color: '#FF9900' },
    ],
  },
  {
    id: 'w4',
    name: 'AeroPress Coffee Maker',
    subtitle: 'Versatile immersion brewer',
    description: 'Brew espresso-style concentrate or smooth American coffee. Takes under 2 minutes. Travel-friendly.',
    price: '₹3,999',
    priceUSD: '$49',
    image: 'https://images.unsplash.com/photo-1567177602943-ee18e00e6fc4?w=600&q=80',
    retailers: [
      { name: 'Amazon', url: 'https://www.amazon.in/s?k=aeropress', color: '#FF9900' },
      { name: 'Flipkart', url: 'https://www.flipkart.com/search?q=aeropress', color: '#2874F0' },
    ],
  },
  {
    id: 'w5',
    name: 'Blue Bottle Subscription',
    subtitle: 'Monthly freshly roasted single origins',
    description: 'Hand-selected single-origin beans shipped within 48h of roasting. Customize grind, frequency, and quantity.',
    price: 'From $17/mo',
    priceUSD: 'From $17/mo',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80',
    retailers: [
      { name: 'Official Site', url: 'https://bluebottlecoffee.com', color: '#C9A84C' },
    ],
  },
  {
    id: 'w6',
    name: 'Acaia Pearl Scale',
    subtitle: 'Bluetooth coffee scale, 0.1g precision',
    description: 'Real-time flow rate display. Connects to the Acaia app for guided brewing. Waterproof, tare-ready.',
    price: '₹16,999',
    priceUSD: '$199',
    image: 'https://images.unsplash.com/photo-1521302200778-33500d22fa68?w=600&q=80',
    retailers: [
      { name: 'Amazon', url: 'https://www.amazon.in/s?k=acaia+pearl+scale', color: '#FF9900' },
    ],
  },
  {
    id: 'w7',
    name: 'Chemex Classic 6-Cup',
    subtitle: 'Pour-over carafe with wood collar',
    description: 'Brew 900 ml of exceptionally clean, sediment-free coffee. Bonded paper filters sold separately.',
    price: '₹5,499',
    priceUSD: '$65',
    image: 'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=600&q=80',
    retailers: [
      { name: 'Amazon', url: 'https://www.amazon.in/s?k=chemex', color: '#FF9900' },
      { name: 'Flipkart', url: 'https://www.flipkart.com/search?q=chemex', color: '#2874F0' },
    ],
  },
  {
    id: 'w8',
    name: 'Nespresso Vertuo Pop',
    subtitle: 'Centrifusion capsule machine',
    description: 'Barcode-reads every capsule for perfect brewing. 4 cup sizes from espresso to alto. 27-second heat-up.',
    price: '₹8,999',
    priceUSD: '$109',
    image: 'https://images.unsplash.com/photo-1557858310-9052820906f7?w=600&q=80',
    retailers: [
      { name: 'Amazon', url: 'https://www.amazon.in/s?k=nespresso+vertuo', color: '#FF9900' },
      { name: 'Flipkart', url: 'https://www.flipkart.com/search?q=nespresso+vertuo', color: '#2874F0' },
    ],
  },
]

// ── "Brewed by TBC Barista" data ───────────────────────────────────────────────

const TBC_CATEGORIES = ['All', 'Apparel', 'Drinkware', 'Accessories']

const TBC_PRODUCTS = [
  {
    id: 't1', category: 'Apparel',
    name: 'The Chronicles Tee',
    tagline: '100% organic cotton · Classic fit',
    price: 29.99, originalPrice: null,
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80',
    badge: 'Bestseller', colors: ['Espresso', 'Forest', 'Cream'],
    description: 'Hand-embroidered TBC crest. GOTS-certified organic cotton. Pre-shrunk. Unisex sizing S–3XL.',
  },
  {
    id: 't2', category: 'Apparel',
    name: 'Single Origin Hoodie',
    tagline: '380gsm fleece · Origin map back print',
    price: 64.99, originalPrice: null,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80',
    badge: 'New', colors: ['Dark Roast', 'Mist'],
    description: 'Heavyweight brushed fleece. Screen-printed world origin map across the full back. Kangaroo pocket.',
  },
  {
    id: 't3', category: 'Apparel',
    name: 'Pour Over Pilgrim Cap',
    tagline: 'Unstructured 5-panel · Brass adjuster',
    price: 24.99, originalPrice: 32.99,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80',
    badge: 'Sale', colors: ['Cream', 'Black'],
    description: 'Tonal embroidered logo front. Woven leather TBC patch rear. Low-profile, one size fits most.',
  },
  {
    id: 't4', category: 'Drinkware',
    name: 'The Daily Ritual Mug',
    tagline: 'Handcrafted stoneware · 12 oz',
    price: 22.99, originalPrice: null,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80',
    badge: 'Bestseller', colors: ['Matte Black', 'Ceramic White'],
    description: 'Wheel-thrown, fired at 1280°C. Weighted base, thumb-rest handle. Dishwasher & microwave safe.',
  },
  {
    id: 't5', category: 'Drinkware',
    name: 'Origin Collection Cup',
    tagline: 'Hand-thrown stoneware · 14 oz · Each unique',
    price: 28.99, originalPrice: null,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
    badge: null, colors: ['Earth', 'Sage'],
    description: 'Reactive glaze means no two cups are identical. Pairs with a matching saucer. Made in Portugal.',
  },
  {
    id: 't6', category: 'Drinkware',
    name: 'TBC Travel Tumbler',
    tagline: 'Double-wall vacuum insulated · 16 oz',
    price: 38.99, originalPrice: null,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80',
    badge: 'New', colors: ['Slate', 'Copper', 'Forest'],
    description: 'Hot 8h / Cold 24h. Leak-proof twist lid. Powder-coat finish. BPA-free. Fits most cup holders.',
  },
  {
    id: 't7', category: 'Accessories',
    name: 'Bean Chronicles Tote',
    tagline: '14 oz canvas · Screen printed',
    price: 21.99, originalPrice: null,
    image: 'https://images.unsplash.com/photo-1544816565-aa8c1166648f?w=600&q=80',
    badge: null, colors: ['Natural', 'Black'],
    description: 'Reinforced stitching. Screen-printed world-origin map. Internal zip pocket. Holds up to 15 kg.',
  },
  {
    id: 't8', category: 'Accessories',
    name: 'The Brew Journal',
    tagline: '200-page hardcover · Guided tasting notes',
    price: 24.99, originalPrice: null,
    image: 'https://images.unsplash.com/photo-1517971129774-8a2b38fa128e?w=600&q=80',
    badge: null, colors: ['Mocha'],
    description: 'Lay-flat binding. Sections for ratio, grind, bloom, flavour notes, and origin. Gilded page edges.',
  },
  {
    id: 't9', category: 'Accessories',
    name: 'Enamel Pin Set',
    tagline: 'Set of 4 hard enamel · Gold plating',
    price: 15.99, originalPrice: null,
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80',
    badge: 'Limited', colors: ['Gold / Enamel'],
    description: 'Four pins: coffee bean, pour-over drip, aeropress, espresso cup. Rubber butterfly clutch back.',
  },
]

// ── World product card ──────────────────────────────────────────────────────────

function WorldCard({ product, index }) {
  const [hovered, setHovered] = useState(false)
  const { theme } = useTheme()
  const isLight = theme === 'light'

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.48, delay: index * 0.06, ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '1.25rem',
        overflow: 'hidden',
        background: isLight
          ? '#FFFFFF'
          : 'linear-gradient(155deg, #283C1B 0%, #1E2E13 100%)',
        border: `1.5px solid ${hovered
          ? (isLight ? 'rgba(122,80,0,0.45)' : 'rgba(201,168,76,0.5)')
          : (isLight ? 'rgba(122,80,0,0.18)' : 'rgba(80,120,60,0.38)')}`,
        transition: 'border-color 0.25s, box-shadow 0.25s',
        boxShadow: hovered
          ? (isLight ? '0 8px 36px rgba(80,40,0,0.14)' : '0 10px 48px rgba(0,0,0,0.7), 0 0 24px rgba(201,168,76,0.08)')
          : (isLight ? '0 2px 16px rgba(80,40,0,0.08), 0 1px 4px rgba(80,40,0,0.04)' : '0 4px 28px rgba(0,0,0,0.55)'),
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '3/2' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.55s ease',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,16,10,0.72) 0%, transparent 55%)' }} />

        {/* Retailer badges over image */}
        <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {product.retailers.map((r) => (
            <span
              key={r.name}
              style={{
                padding: '2px 8px',
                borderRadius: '999px',
                fontSize: '0.6rem',
                fontFamily: '"Space Mono", monospace',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                background: 'rgba(8,16,10,0.82)',
                color: r.color,
                border: `1px solid ${r.color}44`,
                backdropFilter: 'blur(4px)',
              }}
            >
              {r.name}
            </span>
          ))}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.6rem' }}>
        <div>
          <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.3rem' }}>
            {product.subtitle}
          </p>
          <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.2rem', color: 'var(--color-text)', lineHeight: 1.25, margin: 0 }}>
            {product.name}
          </h3>
        </div>

        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', lineHeight: 1.6, margin: 0, flex: 1 }}>
          {product.description}
        </p>

        {/* Price + CTA row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.4rem', gap: '0.75rem' }}>
          <div>
            <p style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.15rem', color: 'var(--color-accent)', margin: 0, lineHeight: 1 }}>
              {product.price}
            </p>
            {product.priceUSD !== product.price && (
              <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.6rem', color: 'var(--color-text-faint)', margin: '2px 0 0' }}>
                ~{product.priceUSD}
              </p>
            )}
          </div>

          {/* Shop Now buttons */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {product.retailers.map((r) => (
              <a
                key={r.name}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '999px',
                  fontSize: '0.65rem',
                  fontFamily: '"Space Mono", monospace',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  background: 'transparent',
                  border: `1px solid ${r.color}66`,
                  color: r.color,
                  transition: 'background 0.18s, border-color 0.18s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = `${r.color}18`; e.currentTarget.style.borderColor = r.color }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = `${r.color}66` }}
              >
                {r.name} →
              </a>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── TBC product card ────────────────────────────────────────────────────────────

function TBCCard({ product, index }) {
  const [hovered, setHovered] = useState(false)
  const [notified, setNotified] = useState(false)
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const bs = product.badge ? BADGE_STYLE[product.badge] : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.48, delay: index * 0.06, ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '1.25rem',
        overflow: 'hidden',
        background: isLight
          ? '#FFFFFF'
          : 'linear-gradient(155deg, #283C1B 0%, #1E2E13 100%)',
        border: `1.5px solid ${hovered
          ? (isLight ? 'rgba(122,80,0,0.45)' : 'rgba(201,168,76,0.5)')
          : (isLight ? 'rgba(122,80,0,0.18)' : 'rgba(80,120,60,0.38)')}`,
        transition: 'border-color 0.25s, box-shadow 0.25s',
        boxShadow: hovered
          ? (isLight ? '0 8px 36px rgba(80,40,0,0.14)' : '0 10px 48px rgba(0,0,0,0.7), 0 0 24px rgba(201,168,76,0.08)')
          : (isLight ? '0 2px 16px rgba(80,40,0,0.08), 0 1px 4px rgba(80,40,0,0.04)' : '0 4px 28px rgba(0,0,0,0.55)'),
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/5' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.55s ease',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,16,10,0.6) 0%, transparent 50%)' }} />

        {/* Badge */}
        {bs && (
          <span style={{
            position: 'absolute', top: '0.75rem', left: '0.75rem',
            padding: '3px 10px', borderRadius: '999px',
            fontSize: '0.58rem', fontFamily: '"Space Mono", monospace', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            background: bs.bg, color: bs.color, border: `1px solid ${bs.border}`,
            backdropFilter: 'blur(6px)',
          }}>
            {product.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.55rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.58rem', letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--color-accent)', margin: 0 }}>
            {product.category}
          </p>
          <p style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.05rem', color: 'var(--color-text)', margin: 0 }}>
            {product.originalPrice ? (
              <>
                <span style={{ textDecoration: 'line-through', color: 'var(--color-text-faint)', fontSize: '0.85rem', marginRight: '0.35rem' }}>${product.originalPrice}</span>
                ${product.price}
              </>
            ) : `$${product.price}`}
          </p>
        </div>

        <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.2rem', color: 'var(--color-text)', lineHeight: 1.25, margin: 0 }}>
          {product.name}
        </h3>

        <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.62rem', letterSpacing: '0.07em', color: 'var(--color-text-muted)', margin: 0 }}>
          {product.tagline}
        </p>

        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', lineHeight: 1.6, margin: 0, flex: 1 }}>
          {product.description}
        </p>

        {/* Color swatches */}
        {product.colors.length > 0 && (
          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
            {product.colors.map((c) => (
              <span
                key={c}
                title={c}
                style={{
                  width: 14, height: 14, borderRadius: '50%',
                  background: COLOR_HEX[c] || '#888',
                  border: '1.5px solid rgba(201,168,76,0.25)',
                  flexShrink: 0,
                }}
              />
            ))}
            <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.55rem', color: 'var(--color-text-faint)', letterSpacing: '0.06em', marginLeft: '0.15rem' }}>
              {product.colors.join(' · ')}
            </span>
          </div>
        )}

        {/* CTA */}
        <motion.button
          onClick={() => setNotified(true)}
          whileTap={{ scale: 0.95 }}
          disabled={notified}
          style={{
            marginTop: '0.4rem',
            padding: '0.65rem 1.25rem',
            borderRadius: '999px',
            fontSize: '0.65rem',
            fontFamily: '"Space Mono", monospace',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            cursor: notified ? 'default' : 'pointer',
            transition: 'background 0.2s, border-color 0.2s, color 0.2s',
            background: notified ? 'var(--color-accent-dim)' : 'transparent',
            border: `1px solid ${notified
              ? 'var(--color-accent-border)'
              : (isLight ? 'rgba(122,80,0,0.28)' : 'rgba(80,120,60,0.42)')}`,
            color: notified ? 'var(--color-accent)' : 'var(--color-text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
          }}
        >
          {notified ? (
            <><span>✓</span> On the List</>
          ) : (
            <><span>☕</span> Notify Me</>
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}

// ── Tab header ─────────────────────────────────────────────────────────────────

function TabHeader({ activeTab, setActiveTab }) {
  const { theme } = useTheme()
  const isLight = theme === 'light'
  const tabs = [
    {
      id: 'world',
      icon: '🌍',
      title: 'Brewed by the World',
      subtitle: 'Community picks · Editor curated',
    },
    {
      id: 'tbc',
      icon: '☕',
      title: 'Brewed by TBC Barista',
      subtitle: 'Original · Exclusively ours',
    },
  ]

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        maxWidth: '820px',
        margin: '0 auto',
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: '1.5rem 1.25rem',
              borderRadius: '1.25rem',
              border: `1.5px solid ${isActive
                ? 'var(--color-accent-border)'
                : (isLight ? 'rgba(122,80,0,0.18)' : 'rgba(80,120,60,0.38)')}`,
              background: isActive
                ? 'var(--color-accent-dim)'
                : (isLight ? '#FFFFFF' : 'linear-gradient(155deg, #283C1B 0%, #1E2E13 100%)'),
              boxShadow: isActive
                ? 'none'
                : (isLight ? '0 2px 16px rgba(80,40,0,0.07)' : '0 4px 24px rgba(0,0,0,0.45)'),
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'border-color 0.25s, background 0.25s, box-shadow 0.25s',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {isActive && (
              <motion.div
                layoutId="tabActiveLine"
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)',
                }}
              />
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{tab.icon}</span>
              <h3 style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
                color: isActive ? 'var(--color-accent)' : 'var(--color-text)',
                margin: 0, lineHeight: 1.2,
              }}>
                {tab.title}
              </h3>
            </div>
            <p style={{
              fontFamily: '"Space Mono", monospace',
              fontSize: '0.58rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: isActive ? 'var(--color-accent-border)' : 'var(--color-text-faint)',
              margin: 0,
            }}>
              {tab.subtitle}
            </p>
          </motion.button>
        )
      })}
    </div>
  )
}

// ── Steaming cup SVG ───────────────────────────────────────────────────────────

function BrewingCup() {
  return (
    <svg
      width="80" height="88" viewBox="0 0 80 88" fill="none"
      style={{ color: 'var(--color-accent)' }}
      aria-hidden="true"
    >
      <motion.path
        d="M28 18 Q24 12 28 6 Q32 0 28 -6"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
        animate={{ opacity: [0.2, 0.9, 0.2], y: [0, -6, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d="M40 16 Q36 10 40 4 Q44 -2 40 -8"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
        animate={{ opacity: [0.2, 0.9, 0.2], y: [0, -6, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
      />
      <motion.path
        d="M52 18 Q48 12 52 6 Q56 0 52 -6"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
        animate={{ opacity: [0.2, 0.9, 0.2], y: [0, -6, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
      />
      <rect x="10" y="28" width="48" height="6" rx="3" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.9" />
      <path d="M12 34 L16 76 Q16 80 20 80 L60 80 Q64 80 64 76 L68 34Z" stroke="currentColor" strokeWidth="2" fill="var(--color-accent-dim)" />
      <path d="M68 44 Q80 44 80 56 Q80 68 68 68" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
      <ellipse cx="40" cy="82" rx="30" ry="5" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" />
    </svg>
  )
}

// ── Coming Soon page ────────────────────────────────────────────────────────────

export default function Shop() {
  const { theme } = useTheme()

  const upcomingTabs = [
    {
      icon: '🌍',
      title: 'Brewed by the World',
      desc: 'Editor-curated gear — grinders, kettles, pour-overs & subscriptions from the world\'s top makers.',
    },
    {
      icon: '☕',
      title: 'Brewed by TBC Barista',
      desc: 'Original TBC merchandise — apparel, stoneware mugs, travel tumblers, journals & enamel pins.',
    },
  ]

  const heroBg = theme === 'light'
    ? 'radial-gradient(ellipse 72% 52% at 50% 30%, rgba(220,196,148,0.65) 0%, var(--color-bg) 100%)'
    : 'radial-gradient(ellipse 72% 52% at 50% 30%, rgba(45,27,20,0.88) 0%, var(--color-bg) 100%)'

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
      <SEO title="The Bean Store — Coming Soon" description="The TBC shop is brewing. Coffee gear and original merchandise, coming soon." />

      <div
        className="flex-1 flex flex-col items-center justify-center text-center"
        style={{
          paddingTop: '7rem',
          paddingBottom: '5rem',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          background: heroBg,
        }}
      >
        {/* Animated cup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: '2.5rem' }}
        >
          <BrewingCup />
        </motion.div>

        {/* Eyebrow label */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          style={{
            fontFamily: '"Space Mono", monospace',
            fontSize: '0.7rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
            marginBottom: '1.1rem',
          }}
        >
          ✦ The Bean Store ✦
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(2.6rem, 7vw, 4.4rem)',
            fontWeight: 700,
            color: 'var(--color-text)',
            lineHeight: 1.08,
            letterSpacing: '-0.01em',
            marginBottom: '1.4rem',
          }}
        >
          Something Good Is{' '}
          <em style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontStyle: 'italic',
            fontWeight: 600,
            color: 'var(--color-accent)',
          }}>
            Brewing
          </em>
        </motion.h1>

        {/* Sub-heading */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.38 }}
          style={{
            fontFamily: '"Inter", sans-serif',
            fontWeight: 300,
            color: 'var(--color-text-muted)',
            fontSize: '1.05rem',
            maxWidth: '480px',
            lineHeight: 1.82,
            letterSpacing: '0.01em',
            marginBottom: '2.75rem',
          }}
        >
          Our shop is in the roaster. Carefully curated coffee gear and original
          TBC merchandise — arriving when it's perfectly done.
        </motion.p>

        {/* Ornament divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.46 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            width: '100%',
            maxWidth: '460px',
            marginBottom: '2rem',
          }}
        >
          <span style={{ flex: 1, height: 1, background: 'var(--color-accent-border)' }} />
          <span style={{
            fontFamily: '"Space Mono", monospace',
            fontSize: '0.58rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--color-text-faint)',
          }}>
            Coming Soon
          </span>
          <span style={{ flex: 1, height: 1, background: 'var(--color-accent-border)' }} />
        </motion.div>

        {/* Preview cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.52 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 268px), 1fr))',
            gap: '0.875rem',
            width: '100%',
            maxWidth: '620px',
            marginBottom: '3rem',
          }}
        >
          {upcomingTabs.map((tab, i) => (
            <motion.div
              key={tab.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58 + i * 0.11, duration: 0.42 }}
              style={{
                padding: '1.5rem 1.4rem',
                borderRadius: '1.25rem',
                background: theme === 'light'
                  ? '#FFFFFF'
                  : 'linear-gradient(155deg, #283C1B 0%, #1E2E13 100%)',
                border: `1.5px solid ${theme === 'light' ? 'rgba(122,80,0,0.18)' : 'rgba(80,120,60,0.38)'}`,
                boxShadow: theme === 'light'
                  ? '0 2px 16px rgba(80,40,0,0.09), 0 1px 4px rgba(80,40,0,0.05)'
                  : '0 4px 28px rgba(0,0,0,0.55)',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: '1.4rem', display: 'block', marginBottom: '0.8rem', lineHeight: 1 }}>
                {tab.icon}
              </span>
              <p style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: '1.12rem',
                fontWeight: 700,
                color: 'var(--color-text)',
                marginBottom: '0.55rem',
                lineHeight: 1.25,
              }}>
                {tab.title}
              </p>
              <p style={{
                fontFamily: '"Inter", sans-serif',
                fontWeight: 400,
                color: 'var(--color-text-muted)',
                fontSize: '0.86rem',
                lineHeight: 1.72,
                margin: 0,
              }}>
                {tab.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Status pill */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.82, duration: 0.5 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.6rem 1.4rem',
            borderRadius: '999px',
            background: 'var(--color-accent-dim)',
            border: '1px solid var(--color-accent-border)',
          }}
        >
          <motion.span
            animate={{ scale: [1, 1.45, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: 7, height: 7, borderRadius: '50%',
              background: 'var(--color-accent)',
              display: 'block', flexShrink: 0,
            }}
          />
          <span style={{
            fontFamily: '"Space Mono", monospace',
            fontSize: '0.64rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
          }}>
            Currently roasting — check back soon
          </span>
        </motion.div>
      </div>
    </div>
  )
}
