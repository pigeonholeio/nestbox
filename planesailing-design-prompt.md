# Landing Page Design Prompt — Plane Sailing / Cloudyard Design System

Use the following design system to create a new landing page consistent with the Plane Sailing and Cloudyard product family. Follow every section precisely.

---

## Design Philosophy

This is an **enterprise-grade, dark-mode, developer-native design system** built for DevSecOps, platform engineering, and infrastructure tooling audiences. The aesthetic sits at the intersection of:

- **Grafana / HashiCorp** — trusted, operational, data-dense
- **Vercel / Linear** — refined dark UI, tight spacing, purposeful typography
- **Terminal culture** — monospace accents, status indicators, real-looking mockups

The goal is to feel **serious, credible, and technical without being cold or clinical**. Every element should look like it was built by engineers who care about craft. Avoid: consumer startup aesthetics, purple gradient "AI product" clichés, bouncy illustrations, or anything that feels like a SaaS marketing template.

**The single most important rule:** build realistic-looking UI mockups — Backstage portals, terminal sessions, log feeds, scan dashboards — directly in CSS/HTML rather than using placeholder images. These in-page mockups are the centrepiece of each hero section and the primary credibility signal.

---

## Colour System

### Background Layers (dark-to-darker scale)
```
--bg:   #07090d   ← page background (almost black, very slight blue tint)
--bg2:  #0b0e14   ← card backgrounds, nav
--bg3:  #0f1219   ← elevated surfaces, sidebar backgrounds, tab bars
--bg4:  #131720   ← deepest inset areas
```

### Primary Accent (choose ONE per product — never mix accents within a single page)

| Product / Context | Accent      | Hex       | Dim (8% alpha)            |
|-------------------|-------------|-----------|---------------------------|
| Cloudyard         | Teal        | `#5ecfbb` | `rgba(94,207,187,0.08)`   |
| CloudGate         | Amber       | `#f59e0b` | `rgba(245,158,11,0.08)`   |
| PigeonHole        | Violet      | `#a78bfa` | `rgba(167,139,250,0.08)`  |
| Plane Sailing Co  | Steel Blue  | `#4f9cf9` | `rgba(79,156,249,0.07)`   |

### Semantic Colours (consistent across all products)
```
--green:  #22c55e / rgba(34,197,94,0.1)    ← success, healthy, PASS
--amber:  #f59e0b / rgba(245,158,11,0.1)   ← warning, scanning, pending
--red:    #ef4444 / rgba(239,68,68,0.1)    ← error, blocked, threat
--blue:   #3b82f6 / rgba(59,130,246,0.1)   ← info, secondary action
```

### Text Scale
```
--text:   #dde6f0   ← primary text (cool off-white, slight blue)
--text2:  #6b7f96   ← secondary / body copy
--text3:  #2e3d52   ← tertiary / labels / watermarks
```

### Borders
```
--border:  rgba([accent-rgb], 0.1)   ← primary border (tinted by accent)
--border2: rgba(255,255,255, 0.06)   ← neutral border (white at 6%)
```

---

## Typography

Use **three font families** — each with a distinct role. Never swap them.

### Display / Headings
**Cloudyard style:** `Syne` (weight 700–800) — geometric, modern, tight letter-spacing (`letter-spacing: -0.03em`). Used for H1 hero headings.

**Plane Sailing / enterprise style:** `Barlow Condensed` (weight 300–800) — condensed, authoritative, ALL CAPS. Used when you want military-precision and gravitas over friendliness.

Choose one heading font per project. Do not mix them.

### Body Copy
**Cloudyard:** `Inter` (weight 300–500) — reliable, developer-familiar, clean.
**Plane Sailing:** `Source Serif 4` (weight 300–400, italic available) — unexpected serif choice that signals premium and editorial. Use for body paragraphs and lead copy.

The serif choice is deliberate and distinctive — it reads as "considered" rather than "generic SaaS". Use it for longer-form explanatory paragraphs, not for UI chrome.

### Monospace / Code / Labels
**Cloudyard:** `JetBrains Mono` — for code blocks, terminal mockups, UI labels, status indicators.
**Plane Sailing:** `Fira Code` — slightly narrower, good for dense log feeds and scan readouts.

Monospace fonts are used heavily throughout: section labels, status chips, all terminal/log mockups, small technical labels on cards (`// section title` convention). This is a key part of the visual identity.

### Type Scale
```
H1 hero:       clamp(2.8rem, 6.5vw, 6rem) — tight line-height 0.92–1.0
H2 section:    clamp(1.8rem, 3.5vw, 3rem) — line-height 1.05
Section kicker: 0.68rem monospace, ALL CAPS, letter-spacing 0.15em, accent colour
Body lead:     1.0–1.1rem, line-height 1.8, --text2
Card body:     0.875rem, line-height 1.65–1.7, --text2
Micro labels:  0.6–0.68rem monospace, ALL CAPS, --text3
```

---

## Layout System

### Container
```
max-width: 1180–1200px; margin: 0 auto; padding: 88–96px 56–60px;
```

### Grid Patterns (in order of frequency)
1. **Full-width hero** — centred column, content + hero mockup below, OR 50/50 split hero for company pages
2. **3-column expertise/feature grid** — `repeat(3, 1fr)`, gap 1px, background border trick (grid gaps via background colour on the parent, not gap property) for seamless-bordered look
3. **2-column product/content** — `1fr 1fr` with 52–80px gap
4. **4-column process steps** — `repeat(4, 1fr)`, step number + title + copy, right border as divider
5. **Horizontal stat strip** — flex row, each stat bordered-right, centred numbers

### Section Kicker Pattern
Every section opens with a small monospace label above the H2:
```html
<div class="kicker">Section Label</div>
<h2>Main Heading with <em>accent word</em></h2>
<p class="lead">Supporting paragraph...</p>
```
The kicker has a short horizontal rule (`::before { content:''; width:20–24px; height:1px; background:accent }`) preceding the text.

### Card Borders — "Hairline Grid" Technique
For multi-cell grids, use this pattern instead of box-shadow or gap:
```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--border);   /* the 1px gaps become the border */
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
}
.grid-cell {
  background: var(--bg2);   /* covers the 1px background to form cells */
}
```
This creates a perfectly integrated grid where borders are part of the layout, not the cells.

### Accent Bar on Hover
Cards and product panels get a 2–3px coloured bar that appears at the bottom (or left edge) on hover:
```css
.card::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--accent), transparent);
  opacity: 0;
  transition: opacity 0.25s;
}
.card:hover::after { opacity: 1; }
```

---

## Background Textures

Each product has a subtle full-page background texture applied via `body::before` (position: fixed, inset: 0, pointer-events: none, z-index: 0). All content sits on z-index 1+.

**Cloudyard** — tight square grid:
```css
background-image:
  linear-gradient(rgba(94,207,187,0.025) 1px, transparent 1px),
  linear-gradient(90deg, rgba(94,207,187,0.025) 1px, transparent 1px);
background-size: 60px 60px;
```

**Plane Sailing** — larger topographic-style double grid:
```css
background-image:
  linear-gradient(rgba(79,156,249,0.025) 1px, transparent 1px),
  linear-gradient(90deg, rgba(79,156,249,0.015) 1px, transparent 1px);
background-size: 80px 80px, 200px 200px;
```

**CloudGate** — dot matrix:
```css
background-image: radial-gradient(circle, rgba(245,158,11,0.04) 1px, transparent 1px);
background-size: 32px 32px;
```

Additionally, use `body::after` for a decorative left-edge warning stripe (CloudGate only):
```css
position: fixed; top: 0; left: 0; bottom: 0; width: 3px;
background: repeating-linear-gradient(180deg, var(--amber) 0 12px, transparent 12px 24px);
opacity: 0.15;
```

---

## Navigation

```
position: fixed; top: 0; height: 60–64px; backdrop-filter: blur(14px);
background: rgba(bg-color, 0.88–0.93); border-bottom: 1px solid var(--border);
```

Logo: small coloured mark (square, rounded square, circle, or hex depending on product) + wordmark. Mark uses a gradient from accent to accent-dark. Wordmark uses heading font, the second half of the product name in accent colour via `<em>`.

Nav links: monospace or condensed sans, small, --text2 resting state, accent on hover.

Buttons: ghost button (transparent, accent-coloured border) + solid primary (accent fill, dark text).

---

## Hero Sections

### Structure
Hero is always full viewport height (`min-height: 100vh`). Two variants:

**Centred column hero (Cloudyard style):**
- Kicker pill/badge at top (rounded pill, accent background at 7%, monospace text with blinking dot)
- H1 spanning ~960px max-width
- Lead paragraph max-width ~580px
- CTA button row
- Large UI mockup (the browser-chrome wrapper + application UI) centred below, full-width up to ~1000px

**Split 50/50 hero (Plane Sailing style):**
- Left column: kicker, H1, lead, CTAs, stat row
- Right column: terminal/code block mockup
- Decorative coordinate watermark in bottom-right corner (monospace, --text3)

### Radial Glow Overlays
Behind hero content, add accent-coloured radial gradients as atmospheric depth:
```css
.hero-glow {
  position: absolute;
  top: -10%; left: 50%; transform: translateX(-50%);
  width: 900px; height: 450px;
  background: radial-gradient(ellipse at 50% 0%, rgba([accent], 0.06) 0%, transparent 60%);
  pointer-events: none;
}
```
Add a secondary glow in a contrasting colour (bottom-right, smaller) for depth.

---

## UI Mockups (Critical Component)

The in-page mockups are the most important visual element. Build them entirely in CSS. Structure:

### Browser Chrome Wrapper
```html
<div class="portal-shell">
  <div class="portal-bar">
    <div class="dot red"></div>
    <div class="dot yellow"></div>
    <div class="dot green"></div>
    <div class="url-bar">app.internal — Page Title</div>
  </div>
  <!-- application UI inside -->
</div>
```
```css
.portal-shell {
  background: var(--bg2); border: 1px solid var(--border);
  border-radius: 12–14px; overflow: hidden;
  box-shadow: 0 40px 100px rgba(0,0,0,0.5), inset 0 1px 0 rgba(accent,0.08);
}
.portal-bar {
  background: var(--bg3); padding: 11px 18px;
  display: flex; align-items: center; gap: 9px;
  border-bottom: 1px solid var(--border);
}
.dot { width: 10–11px; height: 10–11px; border-radius: 50%; }
```

### Internal Application Layouts
Backstage-style portals use a two-column layout:
- Left sidebar (220px): dark bg (#070a0f), nav items with active highlight (accent background, left border)
- Right main area: service catalogue cards, pipeline status, or workspace list

Terminal mockups use:
- Prompt: `$` in accent colour
- Output lines: --text2 for normal, --green for success ticks, --red for errors, --amber for warnings, --text3 for comments
- Blinking cursor: 8×14px block, accent colour, blink animation

Log/scan feed mockups show timestamped rows (monospace), package/file name, status badge. Threat rows get a red-tinted background (`rgba(239,68,68,0.05)`).

### Status Indicators
Status badges throughout: `font-size: 0.55–0.65rem; padding: 2–3px 6–8px; border-radius: 3–4px; text-transform: uppercase; letter-spacing: 0.06em;`
- Active/healthy: green background + text
- Warning/scanning: amber — add `animation: throb 1.5s infinite` (opacity 1→0.5→1)
- Error/blocked: red — same throb animation
- Queued: neutral grey

Green status dot with glow effect: `background: #22c55e; box-shadow: 0 0 4–6px #22c55e;`

---

## Animations

**Page load — staggered fade-up:**
```css
@keyframes fadeUp {
  to { opacity: 1; transform: translateY(0); }
}
.fu { opacity: 0; transform: translateY(20px); animation: fadeUp 0.6s forwards; }
.d1 { animation-delay: 0.08s; }
.d2 { animation-delay: 0.18s; }
.d3 { animation-delay: 0.28s; }
.d4 { animation-delay: 0.4s;  }
```

**Scanning animations (CloudGate / security products):**
```css
/* Vertical scan line sweeping hero */
@keyframes scandown {
  0% { top: 0; opacity: 0; }
  10% { opacity: 0.4; }
  90% { opacity: 0.4; }
  100% { top: 100%; opacity: 0; }
}
/* Horizontal accent sweep on card tops */
@keyframes sweep {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

**Blinking dot (status / "live" indicators):**
```css
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
```

**Spinner (form loading state):**
```css
@keyframes spin { to { transform: rotate(360deg); } }
```

Keep animations purposeful: one orchestrated hero entrance, status indicators only. No scroll-triggered animations or parallax — they feel gimmicky in this context.

---

## Forms

Forms are always presented as a styled card, never naked:
- Background: `var(--bg2)`, border `var(--border)`, border-radius 10–12px, padding 28–32px
- Form title: monospace, `// Section Title` convention, accent colour
- Labels: `font-family: var(--mono); font-size: 0.66–0.68rem; letter-spacing: 0.06em; text-transform: uppercase;` — always `// label text`
- Inputs: `background: rgba(255,255,255,0.04); border: 1px solid var(--border2);` — border transitions to accent on focus
- Submit button: full-width, accent fill, dark text, heading font, ALL CAPS, loading state shows spinner (border-radius 50%, spin animation)
- Success message: green-tinted bg + border; Error: red-tinted

Feedback is always inline below the submit button. Never alert() dialogs.

---

## Stat Strips

Horizontal bands of large metrics, used between sections:
```css
.stat-strip {
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 44px 56px;
  display: flex; justify-content: center;
}
.stat { flex: 1; max-width: 200px; text-align: center; padding: 0 28px; border-right: 1px solid var(--border); }
.stat:last-child { border-right: none; }
.stat-number { font-family: var(--head); font-size: 2.5rem; font-weight: 700; color: var(--accent); }
.stat-label { color: var(--text2); font-size: 0.78rem; margin-top: 4px; }
```

---

## Section Dividers

Between major sections:
```css
.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border), transparent);
}
```

Alternatively: full-width band sections use `background: var(--bg2)` with top and bottom `border: 1px solid var(--border)` to create a recessed-panel effect.

---

## Copy Conventions

- **Section kickers:** `// Short Descriptor` or plain label — monospace, always lowercase or title case, never ALL CAPS
- **H2 headings:** Short, punchy, two-line preferred. One word or phrase in accent `<em>`. Fragments acceptable — "Nothing enters uninspected." "Complex infra. Plain simple."
- **Lead copy:** 1–2 sentences, --text2, `font-weight: 300`, generous line-height. Name the pain directly.
- **Feature lists:** Short title (bold, --text) + one-sentence description. Never more than 4 bullet points in a list.
- **Avoid:** "Revolutionise", "Transform", "Unlock", "Seamlessly", "Best-in-class", "State-of-the-art". Write like a senior engineer describing a problem they've actually solved.

---

## Footer Pattern

Three-section footer:
1. **Top grid** — `2fr 1fr 1fr 1fr`: brand column (logo + 2-line description), Products column, Expertise/Features column, Company/Links column
2. **Bottom bar** — `flex, space-between`: copyright left, product pills right
3. Product pills in footer: `font-family: mono; font-size: 0.6rem; padding: 3px 8px; border-radius: 3px; accent background at 8%, accent border at 20%, accent text`

---

## Responsive Behaviour

Breakpoint at **1024px** (not 768px — these are desktop-first B2B pages):
- Single-column layouts for grids
- Hide terminal/mockup in hero (it's detail that doesn't work at mobile scale)
- Reduce padding: `56–60px` → `24–32px`
- Stat strips wrap to 2×2

---

## Component Checklist for a New Page

When building a new page in this system, include:

- [ ] CSS custom properties (all design tokens above)
- [ ] Google Fonts import (pick appropriate pair from system above)
- [ ] `body::before` background texture (pick appropriate variant)
- [ ] Fixed nav with blur backdrop
- [ ] Hero with at minimum: kicker badge, H1 with accent word, lead paragraph, CTA buttons, UI mockup
- [ ] Radial glow overlay(s) in hero
- [ ] Stat strip between hero and content
- [ ] Section kicker → H2 → lead paragraph pattern for every section
- [ ] At least one full-width `bg2` recessed band section (breaking up the page)
- [ ] Early access / interest capture form wired to `https://interest-api.planesailing.io/signup/platform`
- [ ] Footer with product pills
- [ ] Staggered `fadeUp` animation on hero elements
- [ ] `blink` animation on live status dots
- [ ] Inline form feedback (success/error states)

---

## What Not To Do

- **No** white or light backgrounds, even for contrast sections
- **No** illustrations, SVG icons from icon libraries, or Lottie animations
- **No** drop shadows on cards (use border + background contrast instead)
- **No** rounded corners larger than 12–14px on major containers (4–6px on small elements)
- **No** more than one accent colour per page (exceptions: semantic green/red/amber for status only)
- **No** Inter or Roboto as the only font — use the specified pairs
- **No** placeholder copy ("Lorem ipsum", "Feature title", "Description here")
- **No** generic stock photo or gradient mesh hero backgrounds — the mockup IS the hero visual
- **No** modal dialogs or overlays
- **No** carousels or sliders

---

## API Integration

All forms POST to:
```
https://interest-api.planesailing.io/signup/platform
```

Payload:
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "company": "string (optional)",
  "role": "string — e.g. 'cloudyard-interest', 'cloudgate-interest', 'enquiry'",
  "use_case": "string — concatenate interest + message",
  "infra": "string — product slug e.g. 'cloudyard', 'cloudgate', 'pigeonhole'"
}
```

Response: `{ ok: true, message: "..." }` or `{ ok: false, error: "..." }`

Show inline success/error message. Clear the form on success. Button shows spinner during request.
