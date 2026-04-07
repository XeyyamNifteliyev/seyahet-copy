const fs = require('fs');

const content = `'use client';

import { Plane } from 'lucide-react';

const flags = ['🇦🇿', '🇹🇷', '🇵🇰', '🇷🇺', '🇬🇪', '🇦🇪', '🇯🇵', '🇫🇷', '🇮🇹', '🇪🇸', '🇬🇧', '🇺🇸', '🇩🇪', '🇰🇷', '🇮🇷'];

export function GlobeHero() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-6 opacity-[0.06] blur-[1px]">
          {flags.map((flag, i) => (
            <span key={i} className="text-5xl md:text-6xl select-none" style={{ animation: \`flagFloat \${8 + i * 0.5}s ease-in-out infinite\` }}>
              {flag}
            </span>
          ))}
        </div>
      </div>
      <div className="relative">
        <svg viewBox="0 0 280 280" className="w-70 h-70">
          <circle cx="140" cy="140" r="130" fill="#0a1628" stroke="rgba(59,130,246,0.2)" strokeWidth="1"/>
          <circle cx="140" cy="140" r="100" fill="none" stroke="rgba(59,130,246,0.1)" strokeWidth="0.5"/>
          <circle cx="140" cy="140" r="130" fill="none" stroke="rgba(59,130,246,0.2)" strokeWidth="1"/>
        </svg>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Plane className="w-6 h-6 text-blue-400" style={{ filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.6))', animation: 'orbit1 15s linear infinite', transform: 'rotate(-45deg)' }}/>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/home/globe-hero.tsx', content, 'utf8');
console.log('File created successfully');
fs.unlinkSync('fix-globe.js');