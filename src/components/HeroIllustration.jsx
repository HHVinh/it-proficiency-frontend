export default function HeroIllustration() {
  return (
    <div className="relative w-full flex items-center justify-center select-none pointer-events-none" style={{ height: 320 }}>
      <svg viewBox="0 0 420 320" className="w-full max-w-sm md:max-w-md" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="hBlob1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.35"/>
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="hBlob2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="#10B981" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="hBlob3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.18"/>
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="screenG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C7D2FE"/>
            <stop offset="100%" stopColor="#4F46E5"/>
          </linearGradient>
          <linearGradient id="bezelG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E0E7FF"/>
            <stop offset="100%" stopColor="#A5B4FC"/>
          </linearGradient>
          <linearGradient id="baseG" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C7D2FE"/>
            <stop offset="100%" stopColor="#818CF8"/>
          </linearGradient>
          <filter id="hShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="#4F46E5" floodOpacity="0.22"/>
          </filter>
          <filter id="softSh" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000000" floodOpacity="0.1"/>
          </filter>
          <filter id="cardSh" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#4F46E5" floodOpacity="0.15"/>
          </filter>
        </defs>

        <ellipse cx="210" cy="160" rx="190" ry="135" fill="url(#hBlob1)"/>
        <ellipse cx="330" cy="75" rx="85" ry="65" fill="url(#hBlob2)"/>
        <ellipse cx="70" cy="220" rx="70" ry="55" fill="url(#hBlob3)"/>

        <g filter="url(#hShadow)">
          <rect x="95" y="65" width="230" height="148" rx="14" fill="url(#bezelG)"/>
          <rect x="104" y="74" width="212" height="130" rx="9" fill="url(#screenG)"/>
          <rect x="116" y="90" width="90" height="9" rx="4.5" fill="white" fillOpacity="0.65"/>
          <rect x="116" y="108" width="130" height="7" rx="3.5" fill="white" fillOpacity="0.4"/>
          <rect x="116" y="122" width="100" height="7" rx="3.5" fill="white" fillOpacity="0.35"/>
          <rect x="116" y="136" width="70" height="7" rx="3.5" fill="white" fillOpacity="0.28"/>
          <circle cx="262" cy="130" r="24" fill="white" fillOpacity="0.2"/>
          <circle cx="262" cy="130" r="18" fill="white" fillOpacity="0.25"/>
          <polygon points="255,121 255,139 273,130" fill="white" fillOpacity="0.9"/>
        </g>

        <rect x="80" y="211" width="260" height="15" rx="7.5" fill="url(#baseG)"/>
        <ellipse cx="210" cy="228" rx="120" ry="6" fill="#4F46E5" fillOpacity="0.2"/>

        <g filter="url(#cardSh)" transform="rotate(-9 58 125)">
          <rect x="20" y="95" width="82" height="58" rx="12" fill="white" fillOpacity="0.95"/>
          <rect x="28" y="107" width="46" height="7" rx="3.5" fill="#4F46E5" fillOpacity="0.75"/>
          <rect x="28" y="121" width="30" height="5" rx="2.5" fill="#4F46E5" fillOpacity="0.4"/>
          <rect x="28" y="132" width="38" height="5" rx="2.5" fill="#4F46E5" fillOpacity="0.3"/>
          <rect x="28" y="143" width="24" height="5" rx="2.5" fill="#4F46E5" fillOpacity="0.2"/>
        </g>

        <g filter="url(#cardSh)" transform="rotate(7 330 148)">
          <rect x="298" y="115" width="82" height="58" rx="12" fill="white" fillOpacity="0.95"/>
          <rect x="306" y="127" width="46" height="7" rx="3.5" fill="#F59E0B" fillOpacity="0.85"/>
          <rect x="306" y="141" width="30" height="5" rx="2.5" fill="#F59E0B" fillOpacity="0.45"/>
          <rect x="306" y="152" width="38" height="5" rx="2.5" fill="#F59E0B" fillOpacity="0.3"/>
          <rect x="306" y="163" width="24" height="5" rx="2.5" fill="#F59E0B" fillOpacity="0.2"/>
        </g>

        <g filter="url(#softSh)">
          <rect x="165" y="28" width="90" height="30" rx="15" fill="white" fillOpacity="0.95"/>
          <circle cx="182" cy="43" r="7" fill="#10B981" fillOpacity="0.9"/>
          <rect x="196" y="38" width="45" height="5" rx="2.5" fill="#0F172A" fillOpacity="0.5"/>
          <rect x="196" y="47" width="30" height="4" rx="2" fill="#0F172A" fillOpacity="0.28"/>
        </g>

        <circle cx="78" cy="58" r="5.5" fill="#F59E0B" fillOpacity="0.85"/>
        <circle cx="345" cy="82" r="4.5" fill="#10B981" fillOpacity="0.85"/>
        <circle cx="360" cy="210" r="6" fill="#818CF8" fillOpacity="0.75"/>
        <circle cx="42" cy="210" r="4" fill="#F59E0B" fillOpacity="0.65"/>
        <circle cx="318" cy="46" r="3.5" fill="#A5B4FC" fillOpacity="0.9"/>
        <circle cx="142" cy="52" r="3" fill="#818CF8" fillOpacity="0.65"/>
        <circle cx="278" cy="258" r="4.5" fill="#10B981" fillOpacity="0.5"/>
        <circle cx="58" cy="170" r="3" fill="#F59E0B" fillOpacity="0.75"/>
        <path d="M385 135 L387 130 L389 135 L394 137 L389 139 L387 144 L385 139 L380 137 Z" fill="#818CF8" fillOpacity="0.8"/>
        <path d="M32 85 L33.5 81 L35 85 L39 86.5 L35 88 L33.5 92 L32 88 L28 86.5 Z" fill="#F59E0B" fillOpacity="0.7"/>
      </svg>
    </div>
  );
}
