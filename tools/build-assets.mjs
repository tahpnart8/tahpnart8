/**
 * Sinh toàn bộ SVG cho README, mỗi hình 2 bản: light + dark.
 *
 * Vì sao có script này thay vì viết tay từng file:
 * bản sáng và bản tối phải giống hệt nhau về hình khối, chỉ khác bảng màu.
 * Viết tay 2 file thì sớm muộn cũng lệch nhau. Ở đây hình vẽ khai báo một lần,
 * màu lấy từ THEMES, nên sửa layout là cả hai bản đổi theo.
 *
 * Chạy:  node tools/build-assets.mjs
 */

import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'assets')

const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace"

const THEMES = {
  light: {
    bg: '#FAFAF8',
    panel: '#FFFFFF',
    panelOpacity: 0.75,
    text: '#0A0A0B',
    sub: '#52525B',
    muted: '#A1A1AA',
    accent: '#16A34A',
    accentDeep: '#15803D',
    accent2: '#06B6D4',
    gridOpacity: 0.08,
    glowOpacity: 0.2,
    trackOpacity: 0.16,
  },
  dark: {
    bg: '#0B0D10',
    panel: '#161B21',
    panelOpacity: 0.9,
    text: '#EDF0F2',
    sub: '#9BA5B1',
    muted: '#78818E',
    accent: '#4ADE80',
    accentDeep: '#86EFAC',
    accent2: '#22D3EE',
    gridOpacity: 0.1,
    glowOpacity: 0.24,
    trackOpacity: 0.2,
  },
}

/** Nền chung: màu nền + lưới blueprint mờ dần + quầng sáng dưới đáy */
const backdrop = (t, w, h, glowY = h) => `
  <rect width="${w}" height="${h}" fill="${t.bg}"/>
  <rect width="${w}" height="${h}" fill="url(#grid)" mask="url(#gridmask)"/>
  <ellipse cx="${w / 2}" cy="${glowY}" rx="${w * 0.55}" ry="${h * 0.7}" fill="url(#glow)"/>`

const defs = (t, w, h) => `
  <defs>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${t.accent}"/>
      <stop offset="55%" stop-color="${t.accent}"/>
      <stop offset="100%" stop-color="${t.accent2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="100%" r="65%">
      <stop offset="0%" stop-color="${t.accent}" stop-opacity="${t.glowOpacity}"/>
      <stop offset="60%" stop-color="${t.accent2}" stop-opacity="${t.glowOpacity * 0.3}"/>
      <stop offset="100%" stop-color="${t.accent}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="26" height="26" patternUnits="userSpaceOnUse">
      <path d="M26 0H0V26" fill="none" stroke="${t.accent}" stroke-opacity="${t.gridOpacity}" stroke-width="1"/>
    </pattern>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <mask id="gridmask"><rect width="${w}" height="${h}" fill="url(#fade)"/></mask>
    <linearGradient id="scan" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${t.accent}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${t.accent}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${t.accent}" stop-opacity="0"/>
    </linearGradient>
  </defs>`

const svg = (w, h, label, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">${body}\n</svg>\n`

/* ─────────────────────────── 1. BANNER ─────────────────────────── */

function banner(t) {
  const W = 1200, H = 300

  // Hạt trôi lơ lửng, vị trí cố định sẵn để mỗi lần build ra file y hệt nhau
  const motes = [
    [150, 210, 2.4, 0], [268, 106, 1.8, 1.3], [388, 246, 2.0, 2.6],
    [905, 118, 2.2, 0.7], [1024, 222, 1.7, 1.9], [1092, 96, 2.5, 3.1],
    [96, 140, 1.6, 2.2], [1140, 168, 1.9, 1.1],
  ].map(([x, y, r, delay]) => `
    <circle cx="${x}" cy="${y}" r="${r}" fill="${t.accent}" opacity="0.35">
      <animate attributeName="opacity" values="0.12;0.5;0.12" dur="4.5s" begin="${delay}s" repeatCount="indefinite"/>
      <animate attributeName="cy" values="${y};${y - 10};${y}" dur="6s" begin="${delay}s" repeatCount="indefinite"/>
    </circle>`).join('')

  return svg(W, H, 'Tran Duc Phat - Applied AI, Data Engineering, AIOps', `
  ${defs(t, W, H)}
  ${backdrop(t, W, H, H + 10)}
  ${motes}

  <path d="M42 42h36M42 42v36" fill="none" stroke="${t.accent}" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round"/>
  <path d="M1158 258h-36M1158 258v-36" fill="none" stroke="${t.accent}" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round"/>

  <g font-family="${MONO}">
    <text x="600" y="88" text-anchor="middle" font-size="16" font-weight="600" letter-spacing="4.5" fill="${t.accent}">&gt;_ tahpnart8 --whoami</text>
    <text x="600" y="166" text-anchor="middle" font-size="60" font-weight="700" letter-spacing="6" fill="${t.text}">TRAN DUC PHAT</text>
    <text x="600" y="208" text-anchor="middle" font-size="18" letter-spacing="2.5" fill="${t.sub}">Applied AI &#183; Data Engineering &#183; AIOps</text>

    <g>
      <rect x="450" y="234" width="300" height="34" rx="17" fill="${t.accent}" fill-opacity="0.1" stroke="${t.accent}" stroke-opacity="0.32"/>
      <circle cx="477" cy="251" r="4.5" fill="${t.accent}">
        <animate attributeName="opacity" values="1;0.2;1" dur="2.4s" repeatCount="indefinite"/>
      </circle>
      <text x="493" y="256" font-size="13" font-weight="600" letter-spacing="0.5" fill="${t.accentDeep}">Open to Applied AI Internship</text>
    </g>
  </g>

  <rect x="-400" y="0" width="400" height="300" fill="url(#scan)" opacity="0.22">
    <animate attributeName="x" values="-400;1200" dur="7s" repeatCount="indefinite"/>
  </rect>
  <rect x="0" y="295" width="1200" height="5" fill="url(#accent)"/>`)
}

/* ─────────────────── 2. PIPELINE "HOW I BUILD" ─────────────────── */

function pipeline(t) {
  const W = 1200, H = 290
  const NODE_W = 150, NODE_H = 66, GAP = 36, X0 = 60, TOP = 96
  const MID = TOP + NODE_H / 2

  const nodes = [
    ['SOURCES', 'csv · api · pdf'],
    ['STREAM', 'Redpanda'],
    ['SERVICE', 'FastAPI'],
    ['VECTOR', 'Milvus'],
    ['MODEL', 'Gemini · LLaMA'],
    ['PRODUCT', 'React · PWA'],
  ]

  const x = (i) => X0 + i * (NODE_W + GAP)

  const boxes = nodes.map(([title, sub], i) => `
    <g>
      <rect x="${x(i)}" y="${TOP}" width="${NODE_W}" height="${NODE_H}" rx="14"
            fill="${t.panel}" fill-opacity="${t.panelOpacity}" stroke="${t.accent}" stroke-opacity="0.28"/>
      <rect x="${x(i)}" y="${TOP}" width="${NODE_W}" height="${NODE_H}" rx="14"
            fill="none" stroke="${t.accent}" stroke-opacity="0.5" stroke-width="1.5">
        <animate attributeName="stroke-opacity" values="0.12;0.65;0.12" dur="4s" begin="${i * 0.55}s" repeatCount="indefinite"/>
      </rect>
      <text x="${x(i) + NODE_W / 2}" y="${TOP + 27}" text-anchor="middle" font-size="13" font-weight="700" letter-spacing="1.6" fill="${t.accent}">${title}</text>
      <text x="${x(i) + NODE_W / 2}" y="${TOP + 48}" text-anchor="middle" font-size="11.5" fill="${t.sub}">${sub}</text>
    </g>`).join('')

  // Đường nối có nét đứt chạy -> cảm giác dữ liệu đang chảy qua từng chặng
  const links = nodes.slice(1).map((_, i) => {
    const from = x(i) + NODE_W
    return `
    <g>
      <line x1="${from}" y1="${MID}" x2="${from + GAP}" y2="${MID}" stroke="${t.accent}" stroke-opacity="${t.trackOpacity}" stroke-width="2"/>
      <line x1="${from}" y1="${MID}" x2="${from + GAP}" y2="${MID}" stroke="${t.accent}" stroke-width="2" stroke-linecap="round" stroke-dasharray="5 9">
        <animate attributeName="stroke-dashoffset" values="14;0" dur="0.9s" repeatCount="indefinite"/>
      </line>
      <path d="M${from + GAP - 7} ${MID - 4.5}L${from + GAP} ${MID}L${from + GAP - 7} ${MID + 4.5}" fill="none" stroke="${t.accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.8"/>
    </g>`
  }).join('')

  const PLAT_Y = 206
  const platform = `
    <rect x="${X0}" y="${PLAT_Y}" width="${W - X0 * 2}" height="52" rx="16"
          fill="${t.accent}" fill-opacity="0.05" stroke="${t.accent}" stroke-opacity="0.2" stroke-dasharray="7 6"/>
    <text x="${X0 + 24}" y="${PLAT_Y + 31}" font-size="11.5" font-weight="700" letter-spacing="2" fill="${t.accent}">RUNS ON</text>
    <text x="${X0 + 118}" y="${PLAT_Y + 31}" font-size="12.5" fill="${t.sub}">Kubernetes &#183; Docker &#183; Terraform &#183; Prometheus / Grafana &#183; CI/CD</text>
    <text x="${W - X0 - 24}" y="${PLAT_Y + 31}" text-anchor="end" font-size="11.5" letter-spacing="1" fill="${t.muted}">observability by default</text>`

  return svg(W, H, 'How I build: from raw sources through streaming, vector search and LLMs to a shipped product', `
  ${defs(t, W, H)}
  ${backdrop(t, W, H, H + 40)}

  <g font-family="${MONO}">
    <text x="${X0}" y="52" font-size="15" font-weight="600" letter-spacing="3.5" fill="${t.accent}">&gt;_ how i build</text>
    <text x="${W - X0}" y="52" text-anchor="end" font-size="12" letter-spacing="1" fill="${t.muted}">raw data in &#8594; product out</text>
    ${links}
    ${boxes}
    ${platform}
  </g>`)
}

/* ───────────────────── 3. TIMELINE HÀNH TRÌNH ───────────────────── */

function timeline(t) {
  const W = 1200, H = 250
  const AX = 90, AW = 1020, AY = 142
  const at = (yearFraction) => AX + (yearFraction - 2024) * (AW / 4)

  const years = [2024, 2025, 2026, 2027, 2028]

  const ticks = years.map((y) => `
    <line x1="${at(y)}" y1="${AY - 7}" x2="${at(y)}" y2="${AY + 7}" stroke="${t.muted}" stroke-opacity="0.55" stroke-width="1.5"/>
    <text x="${at(y)}" y="${AY + 30}" text-anchor="middle" font-size="12" font-weight="600" letter-spacing="1.5" fill="${t.muted}">${y}</text>`).join('')

  // [vị trí theo năm, nhãn, phụ đề, trên/dưới trục]
  const marks = [
    [2024.75, 'BSc IT @ UEH', 'enrolled', 'down'],
    [2025.4, 'First 3-tier apps', 'C# · WinForms', 'up'],
    [2025.95, 'Research Award', 'Prize C · UEH', 'down'],
    [2026.2, 'DoSCI 2026', 'Zero Trust', 'up'],
    [2026.5, 'Cloud-native + LLM', 'K8s · Gemini', 'down'],
    [2028.0, 'Graduation', 'target', 'up'],
  ]

  const NOW = 2026.7

  const milestones = marks.map(([yf, label, sub, dir]) => {
    const cx = at(yf)
    const up = dir === 'up'
    const stemEnd = up ? AY - 34 : AY + 44
    const labelY = up ? AY - 48 : AY + 60
    const anchor = yf >= 2027.9 ? 'end' : 'middle'
    const tx = yf >= 2027.9 ? cx + 6 : cx
    return `
    <g>
      <line x1="${cx}" y1="${AY}" x2="${cx}" y2="${stemEnd}" stroke="${t.accent}" stroke-opacity="0.35" stroke-width="1.5" stroke-dasharray="3 3"/>
      <circle cx="${cx}" cy="${AY}" r="6" fill="${t.bg}" stroke="${t.accent}" stroke-width="2.5"/>
      <text x="${tx}" y="${labelY}" text-anchor="${anchor}" font-size="13" font-weight="700" fill="${t.text}">${label}</text>
      <text x="${tx}" y="${labelY + 17}" text-anchor="${anchor}" font-size="11.5" fill="${t.sub}">${sub}</text>
    </g>`
  }).join('')

  return svg(W, H, 'Journey timeline from starting the BSc in 2024 to graduation in 2028', `
  ${defs(t, W, H)}
  ${backdrop(t, W, H, H + 40)}

  <g font-family="${MONO}">
    <text x="${AX}" y="46" font-size="15" font-weight="600" letter-spacing="3.5" fill="${t.accent}">&gt;_ git log --graph --since=2024</text>

    <line x1="${AX}" y1="${AY}" x2="${AX + AW}" y2="${AY}" stroke="${t.muted}" stroke-opacity="0.28" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="${AX}" y1="${AY}" x2="${at(NOW)}" y2="${AY}" stroke="url(#accent)" stroke-width="3" stroke-linecap="round"
          stroke-dasharray="${at(NOW) - AX}" stroke-dashoffset="${at(NOW) - AX}">
      <animate attributeName="stroke-dashoffset" from="${at(NOW) - AX}" to="0" dur="2.2s" fill="freeze"/>
    </line>
    ${ticks}
    ${milestones}

    <g>
      <circle cx="${at(NOW)}" cy="${AY}" r="7" fill="${t.accent}"/>
      <circle cx="${at(NOW)}" cy="${AY}" r="7" fill="none" stroke="${t.accent}" stroke-width="2">
        <animate attributeName="r" values="7;18;7" dur="2.6s" repeatCount="indefinite"/>
        <animate attributeName="stroke-opacity" values="0.75;0;0.75" dur="2.6s" repeatCount="indefinite"/>
      </circle>
      <text x="${at(NOW)}" y="${AY - 92}" text-anchor="middle" font-size="11" font-weight="700" letter-spacing="2" fill="${t.accent}">YOU ARE HERE</text>
      <line x1="${at(NOW)}" y1="${AY - 84}" x2="${at(NOW)}" y2="${AY - 62}" stroke="${t.accent}" stroke-opacity="0.5" stroke-width="1.5"/>
    </g>
  </g>`)
}

/* ─────────────────────── 4. DIVIDER (dùng chung) ─────────────────────── */

// Trung tính với cả hai theme: chỉ là một vệt gradient mờ dần hai đầu,
// không có mảng nền nào nên đặt trên nền sáng hay tối đều hợp.
function divider() {
  const W = 1200, H = 26
  return svg(W, H, '', `
  <defs>
    <linearGradient id="d" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#16A34A" stop-opacity="0"/>
      <stop offset="25%" stop-color="#16A34A" stop-opacity="0.5"/>
      <stop offset="50%" stop-color="#22C55E" stop-opacity="0.75"/>
      <stop offset="75%" stop-color="#06B6D4" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#06B6D4" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect x="0" y="12" width="1200" height="2" fill="url(#d)"/>
  <circle cx="600" cy="13" r="4" fill="#22C55E">
    <animate attributeName="opacity" values="0.35;1;0.35" dur="3s" repeatCount="indefinite"/>
  </circle>`)
}

/* ───────────────────────────── BUILD ───────────────────────────── */

mkdirSync(OUT, { recursive: true })

const generators = { banner, pipeline, timeline }
const written = []

for (const [name, make] of Object.entries(generators)) {
  for (const [themeName, tokens] of Object.entries(THEMES)) {
    const file = join(OUT, `${name}-${themeName}.svg`)
    writeFileSync(file, make(tokens), 'utf8')
    written.push(`${name}-${themeName}.svg`)
  }
}

writeFileSync(join(OUT, 'divider.svg'), divider(), 'utf8')
written.push('divider.svg')

console.log(`Đã sinh ${written.length} file trong assets/:`)
written.forEach((f) => console.log('  ' + f))
