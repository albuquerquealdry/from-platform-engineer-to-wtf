/**
 * Regenerates public/og.png from the site identity.
 * Run with `npm run og`; only needed if the title or colours change.
 * Uses sharp, which Astro already ships for image optimisation.
 */
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { SITE, STATUS } from '../src/config.mjs';

const W = 1200;
const H = 630;
const PAPER = '#f7f5f0';
const INK = '#1a1917';
const MUTED = '#8b877e';
const RULE = '#dedad0';
const ACCENT = '#ab4326';
const MONO = 'IBM Plex Mono, Menlo, DejaVu Sans Mono, monospace';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Leleu, same drawing as src/components/Leleu.astro. */
const leleu = (x, y, w) => `
  <svg x="${x}" y="${y}" width="${w}" height="${(w * 148) / 208}" viewBox="14 4 208 148">
    <g fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M72 114 C 68 126 70 133 76 136"/>
      <path d="M76 136 l -6 3 M76 136 l 0 5 M76 136 l 5 3"/>
      <path d="M126 112 C 123 123 125 130 131 132"/>
      <path d="M131 132 l -6 3 M131 132 l 0 5 M131 132 l 5 2"/>
      <g stroke="${ACCENT}" stroke-width="2">
        <path d="M92 52 C 85 37 78 28 70 23"/>
        <path d="M87 41 l -7 -3 M82 33 l -7 -2"/>
        <path d="M106 48 C 104 32 102 21 99 13"/>
        <path d="M105 35 l -7 -3 M103 24 l -6 -3 M104 30 l 7 -4"/>
        <path d="M119 50 C 124 35 127 24 128 15"/>
        <path d="M122 37 l 7 -4 M125 27 l 7 -4"/>
      </g>
      <path d="M26 84 C 26 58 44 44 74 44 C 112 44 156 56 186 72
               C 197 77 197 91 186 96 C 156 112 112 124 74 122
               C 44 120 26 106 26 84 Z" fill="${PAPER}"/>
      <path d="M42 92 C 54 103 74 101 84 90" stroke-width="2.2"/>
      <circle cx="48" cy="74" r="3.4" fill="${INK}" stroke="none"/>
      <circle cx="73" cy="71" r="3.4" fill="${INK}" stroke="none"/>
      <circle cx="39" cy="86" r="5.5" fill="${ACCENT}" opacity="0.2" stroke="none"/>
      <circle cx="86" cy="82" r="5" fill="${ACCENT}" opacity="0.16" stroke="none"/>
    </g>
  </svg>`;

const bars = [
  ['PLATFORM ENGINEERING', 10],
  ['MLOPS', 6],
  ['AI', 4],
  ['WTF', 10],
];

const barRows = bars
  .map(([label, filled], i) => {
    const y = 452 + i * 30;
    const glyphs = '█'.repeat(filled) + '░'.repeat(10 - filled);
    return `
      <text x="80" y="${y}" font-family="${MONO}" font-size="15" letter-spacing="2" fill="${MUTED}">${label}</text>
      <text x="470" y="${y}" font-family="${MONO}" font-size="17" fill="${label === 'WTF' ? ACCENT : INK}">${glyphs}</text>`;
  })
  .join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${PAPER}"/>

  <text x="80" y="110" font-family="${MONO}" font-size="17" letter-spacing="4" fill="${MUTED}">ENGINEERING JOURNAL</text>
  <line x1="80" y1="140" x2="720" y2="140" stroke="${RULE}" stroke-width="1"/>

  <text x="80" y="232" font-family="${MONO}" font-size="62" font-weight="600" letter-spacing="-1" fill="${INK}">FROM PLATFORM</text>
  <text x="80" y="304" font-family="${MONO}" font-size="62" font-weight="600" letter-spacing="-1" fill="${INK}">ENGINEER TO <tspan fill="${ACCENT}">WTF</tspan></text>

  <text x="80" y="366" font-family="${MONO}" font-size="21" fill="${MUTED}">A Platform Engineer’s journey into MLOps, AI</text>
  <text x="80" y="394" font-family="${MONO}" font-size="21" fill="${MUTED}">and questionable decisions.</text>

  <line x1="80" y1="424" x2="720" y2="424" stroke="${RULE}" stroke-width="1"/>
  ${barRows}

  ${leleu(752, 206, 392)}

  <circle cx="86" cy="${H - 62}" r="6" fill="${ACCENT}"/>
  <text x="104" y="${H - 56}" font-family="${MONO}" font-size="16" letter-spacing="3" fill="${MUTED}">STATUS: ${STATUS.state} · CURRENTLY: ${STATUS.currently}</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png().toBuffer();
await writeFile(new URL('../public/og.png', import.meta.url), png);
console.log(`og.png written: ${(png.length / 1024).toFixed(1)} KB`);
