function CoffeeMugIcon() {
  return (
    <svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Background disc */}
      <circle cx="55" cy="55" r="55" fill="#1C2B14" />

      {/* Steam */}
      <path d="M37 30 Q35 22 37 15" stroke="#C9A84C" strokeWidth="2.2" strokeLinecap="round" opacity="0.65"/>
      <path d="M55 27 Q57 18 55 10" stroke="#C9A84C" strokeWidth="2.2" strokeLinecap="round" opacity="0.85"/>
      <path d="M73 30 Q75 22 73 15" stroke="#C9A84C" strokeWidth="2.2" strokeLinecap="round" opacity="0.65"/>

      {/* Mug body */}
      <rect x="17" y="34" width="72" height="52" rx="10" fill="#0D1810" stroke="#C9A84C" strokeWidth="2"/>

      {/* Subtle decorative band */}
      <rect x="17" y="48" width="72" height="7" fill="#C9A84C" opacity="0.1"/>

      {/* Handle */}
      <path d="M89 46 Q105 46 105 60 Q105 74 89 74" stroke="#C9A84C" strokeWidth="2.3" strokeLinecap="round" fill="none"/>

      {/* Bottom rim */}
      <line x1="17" y1="85" x2="89" y2="85" stroke="#C9A84C" strokeWidth="1.5" opacity="0.35"/>

      {/* Left eye */}
      <circle cx="38" cy="61" r="9"   fill="#162210" stroke="#C9A84C" strokeWidth="1.8"/>
      <circle cx="38" cy="61" r="5"   fill="#C9A84C"/>
      <circle cx="40.5" cy="58.5" r="1.8" fill="#E8DFD0"/>

      {/* Right eye */}
      <circle cx="72" cy="61" r="9"   fill="#162210" stroke="#C9A84C" strokeWidth="1.8"/>
      <circle cx="72" cy="61" r="5"   fill="#C9A84C"/>
      <circle cx="74.5" cy="58.5" r="1.8" fill="#E8DFD0"/>

      {/* Eyebrows */}
      <path d="M29 49 Q38 45 47 49" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M63 49 Q72 45 81 49" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" fill="none"/>

      {/* Moustache — two curling halves meeting at centre */}
      <path d="M30 76 Q36 84 44 79 Q55 84 55 76" stroke="#C9A84C" strokeWidth="2.6" strokeLinecap="round" fill="none"/>
      <path d="M55 76 Q55 84 66 79 Q74 84 80 76" stroke="#C9A84C" strokeWidth="2.6" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

function ChicoryRootIcon() {
  return (
    <svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* ── Leaves / hair — behind root body ── */}

      {/* Far-left leaf */}
      <path d="M42 46 Q20 32 14 18 Q12 10 20 15 Q28 21 44 46" fill="#234B1A" stroke="#356028" strokeWidth="0.9"/>
      {/* Mid-left leaf */}
      <path d="M47 42 Q33 22 31 11 Q30 4 38 8 Q46 14 49 42" fill="#3A6828" stroke="#4C8038" strokeWidth="0.9"/>
      {/* Centre leaf (tallest) */}
      <path d="M52 39 Q50 19 53 8 Q55 3 57 8 Q60 19 58 39" fill="#2E5E24" stroke="#407830" strokeWidth="0.9"/>
      {/* Mid-right leaf */}
      <path d="M63 42 Q77 22 79 11 Q80 4 72 8 Q64 14 61 42" fill="#3A6828" stroke="#4C8038" strokeWidth="0.9"/>
      {/* Far-right leaf */}
      <path d="M68 46 Q90 32 96 18 Q98 10 90 15 Q82 21 66 46" fill="#234B1A" stroke="#356028" strokeWidth="0.9"/>

      {/* Small chicory flower tucked in left hair */}
      <g transform="translate(16,18)">
        <circle cx="0"  cy="0"  r="3.5" fill="#89A8CC" opacity="0.8"/>
        <circle cx="5"  cy="-3" r="3.5" fill="#89A8CC" opacity="0.75"/>
        <circle cx="2"  cy="-6" r="3.5" fill="#89A8CC" opacity="0.75"/>
        <circle cx="-3" cy="-6" r="3.5" fill="#89A8CC" opacity="0.7"/>
        <circle cx="-6" cy="-1" r="3.5" fill="#89A8CC" opacity="0.7"/>
        <circle cx="0"  cy="0"  r="2"   fill="#E8DFD0"/>
      </g>

      {/* ── Root body ── */}
      <path
        d="M38 46 Q15 80 55 110 Q95 80 72 46 Q63 36 55 38 Q47 36 38 46 Z"
        fill="#C9A84C"
        stroke="#9B7A2A"
        strokeWidth="1.5"
      />

      {/* Horizontal root texture rings */}
      <path d="M37 63 Q55 58 73 63" stroke="#9B7A2A" strokeWidth="0.9" opacity="0.4" strokeLinecap="round"/>
      <path d="M36 75 Q55 70 74 75" stroke="#9B7A2A" strokeWidth="0.9" opacity="0.4" strokeLinecap="round"/>
      <path d="M38 87 Q55 82 72 87" stroke="#9B7A2A" strokeWidth="0.9" opacity="0.3" strokeLinecap="round"/>

      {/* ── Eyes (large, oval, feminine) ── */}
      {/* Left eye */}
      <ellipse cx="41" cy="64" rx="9"   ry="10"  fill="#E8DFD0"/>
      <ellipse cx="41" cy="65" rx="6"   ry="7"   fill="#0D1810"/>
      <ellipse cx="41" cy="64" rx="3"   ry="3.5" fill="#4E7838"/>
      <circle  cx="43" cy="62" r="1.5"            fill="#E8DFD0"/>

      {/* Right eye */}
      <ellipse cx="69" cy="64" rx="9"   ry="10"  fill="#E8DFD0"/>
      <ellipse cx="69" cy="65" rx="6"   ry="7"   fill="#0D1810"/>
      <ellipse cx="69" cy="64" rx="3"   ry="3.5" fill="#4E7838"/>
      <circle  cx="71" cy="62" r="1.5"            fill="#E8DFD0"/>

      {/* Upper eyelashes — left eye */}
      <path d="M36 56 Q35 51 34 48" stroke="#0D1810" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M39 54 Q39 49 39 46" stroke="#0D1810" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M43 53 Q43 48 43 45" stroke="#0D1810" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M47 54 Q48 49 49 46" stroke="#0D1810" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M50 57 Q52 52 54 49" stroke="#0D1810" strokeWidth="1.3" strokeLinecap="round"/>

      {/* Upper eyelashes — right eye */}
      <path d="M56 57 Q58 52 60 49" stroke="#0D1810" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M63 54 Q64 49 65 46" stroke="#0D1810" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M69 53 Q69 48 69 45" stroke="#0D1810" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M75 54 Q76 49 77 46" stroke="#0D1810" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M78 57 Q80 52 82 49" stroke="#0D1810" strokeWidth="1.3" strokeLinecap="round"/>

      {/* Eyebrows — softly arched */}
      <path d="M32 51 Q41 45 51 50" stroke="#7B5C1A" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      <path d="M59 50 Q69 45 78 51" stroke="#7B5C1A" strokeWidth="2.2" strokeLinecap="round" fill="none"/>

      {/* Tiny nose */}
      <circle cx="52" cy="78" r="1.2" fill="#8B6520" opacity="0.6"/>
      <circle cx="58" cy="78" r="1.2" fill="#8B6520" opacity="0.6"/>

      {/* Gentle smile */}
      <path d="M44 88 Q55 97 66 88" stroke="#7B5C1A" strokeWidth="2.2" strokeLinecap="round" fill="none"/>

      {/* Soft cheek blush */}
      <ellipse cx="33" cy="80" rx="7" ry="4" fill="#D4896A" opacity="0.2"/>
      <ellipse cx="77" cy="80" rx="7" ry="4" fill="#D4896A" opacity="0.2"/>
    </svg>
  )
}

export function AuthorIcon({ type }) {
  return type === 'coffee-mug' ? <CoffeeMugIcon /> : <ChicoryRootIcon />
}
