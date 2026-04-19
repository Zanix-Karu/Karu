---
inclusion: always
---

# Karu — Design System

## Design Philosophy

**Two systems fused into one:**

**From Cluely** — Product-forward structure. Each feature section shows a mock Karu UI
(not just icons). Copy is ruthlessly short (≤6 words per headline). Scroll-driven
storytelling. Stats row. Glass panels. FAQ accordion.

**From Karu's own brand** — Dark espresso backgrounds, burnished amber gold, Cormorant
Garamond serif. Warm luxury, not cold minimalism. The page stays dark throughout.

**The rule:** Cluely's *structure*, Karu's *soul*.

The one unforgettable element: a floating mock Karu app window (built in SVG/HTML)
that shows the actual product — search results, booking confirmation, vendor
verification — without requiring a real app.

---

## Colour Tokens

```css
:root {
  /* Backgrounds */
  --karu-ink:        #0D0905;
  --karu-deep:       #120C06;
  --karu-mahogany:   #1A0E07;
  --karu-cognac:     #2E1808;
  --karu-leather:    #3D2008;

  /* Accent */
  --karu-amber:        #C8841A;
  --karu-amber-light:  #E8A832;
  --karu-amber-pale:   #F5C96A;
  --karu-amber-ghost:  rgba(200,132,26,0.10);
  --karu-amber-trace:  rgba(200,132,26,0.05);

  /* Text */
  --karu-cream:        #F0E8D8;
  --karu-cream-dim:    rgba(240,232,216,0.55);
  --karu-cream-faint:  rgba(240,232,216,0.18);
  --karu-cream-ghost:  rgba(240,232,216,0.07);

  /* Borders */
  --karu-gold-line:    rgba(200,132,26,0.14);
  --karu-gold-hover:   rgba(200,132,26,0.30);

  /* Glass */
  --karu-glass:        rgba(200,132,26,0.06);
  --karu-glass-border: rgba(200,132,26,0.18);
  --karu-glass-dark:   rgba(13,9,5,0.75);

  /* Mesh gradients for feature cards */
  --karu-mesh-amber: linear-gradient(135deg,#2E1808 0%,#3D2008 100%);
  --karu-mesh-deep:  linear-gradient(135deg,#120C06 0%,#1E1008 100%);
  --karu-mesh-gold:  linear-gradient(135deg,#1A0E07 0%,#2E1808 60%,#3D2008 100%);

  /* Shadows */
  --karu-shadow-card:  0 1px 3px rgba(0,0,0,0.20), 0 8px 32px rgba(0,0,0,0.30);
  --karu-shadow-float: 0 4px 6px rgba(0,0,0,0.15), 0 20px 60px rgba(0,0,0,0.35);
  --karu-shadow-amber: 0 0 60px rgba(200,132,26,0.10);
}
```

### Colour Rules
- Page background is always `--karu-ink` (#0D0905) — never pure black or white
- Feature cards use mesh gradient backgrounds (amber, deep, gold)
- Primary CTA is always amber fill with ink text
- NEVER use purple, blue, red, or green as accent colours
- NEVER use rounded corners > 20px on major cards

---

## Typography

```
Display font: Cormorant Garamond (Google Fonts)
  Weights: 300, 400, 500, 600
  Styles:  normal, italic

UI font: Syne (Google Fonts)
  Weights: 400, 500, 600, 700, 800
```

```html
<!-- Add to <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

```css
:root {
  --karu-font-serif: 'Cormorant Garamond', Georgia, serif;
  --karu-font-sans:  'Syne', system-ui, sans-serif;
}
```

### Type Scale
```
Hero headline:     Cormorant Garamond 300, clamp(4rem,9.5vw,10rem), ls:-0.025em, lh:0.86
Section headline:  Cormorant Garamond 300, clamp(2.8rem,5.5vw,5.5rem), lh:0.95
Section heading em:italic, color: var(--karu-amber-light)
Body copy:         Cormorant Garamond 300, 1rem–1.05rem, lh:1.85, color: var(--karu-cream-dim)
Tag/eyebrow:       Syne 700, 0.62rem, ls:0.22em, uppercase, color: var(--karu-amber)
Nav links:         Syne 600, 0.68rem, ls:0.18em, uppercase, color: var(--karu-cream-dim)
Buttons:           Syne 700, 0.72–0.75rem, ls:0.12–0.16em, uppercase
Stats numbers:     Cormorant Garamond 500, 4rem, tabular-nums, color: var(--karu-amber)
```

### NEVER use
- Inter, Roboto, Arial, or system-ui for display text
- More than 2 sentences of body copy per feature block
- Headings longer than 8 words

---

## Page Layout (Required Structure)

```
1. NAV            sticky + blur on scroll + amber CTA
2. HERO           centred headline + badge + CTAs + floating product window
3. TICKER         amber bar with scrolling feature keywords
4. HOW IT WORKS   alternating text/mock-UI scroll-story blocks (4 steps)
5. STATS ROW      3 metrics: number + label + 1-sentence description
6. TRUST SECTION  3×2 grid with amber top-bar hover animation
7. CITIES         2-column (Douala + Yaoundé) with ghost city code overlay
8. FAQ            clean accordion, 4–6 questions, chevron animation
9. CTA SECTION    dark bg, large serif title, email form, ⌘+↵ keyboard visual
10. FOOTER        4-column: brand + Product + Company + Legal
```

---

## Navigation

```
Structure: Logo (left) | Links (centre, 4–5 items) | CTA button (right)

Logo:      <em>K</em>aru — italic amber K, cream text, Cormorant Garamond 500 1.55rem
Links:     Syne 600, 0.68rem, 0.18em tracking, uppercase, cream-dim → amber hover
CTA:       Syne 700, amber fill, ink text, no border-radius, 11px 26px padding
Scroll:    background rgba(13,9,5,0.88) + blur(20px) + gold-line border-bottom
Mobile:    hide nav links (show CTA only or hamburger)
```

---

## Buttons

```css
/* Primary — amber */
.karu-btn-primary {
  font-family: var(--karu-font-sans);
  font-size: 0.75rem; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  background: var(--karu-amber); color: var(--karu-ink);
  border: none; padding: 14px 40px; cursor: pointer;
  position: relative; overflow: hidden;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
}
.karu-btn-primary::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.2), transparent);
  transform: translateX(-200%); transition: transform 0.55s;
}
.karu-btn-primary:hover::before { transform: translateX(200%); }
.karu-btn-primary:hover {
  background: var(--karu-amber-light);
  transform: translateY(-2px);
  box-shadow: 0 16px 48px rgba(200,132,26,0.30);
}

/* Ghost — transparent */
.karu-btn-ghost {
  font-family: var(--karu-font-sans);
  font-size: 0.75rem; font-weight: 500;
  letter-spacing: 0.12em; text-transform: uppercase;
  background: transparent; color: var(--karu-cream-dim);
  border: 1px solid var(--karu-cream-faint); padding: 14px 40px;
  transition: border-color 0.2s, color 0.2s, transform 0.15s;
}
.karu-btn-ghost:hover {
  border-color: var(--karu-amber); color: var(--karu-amber);
  transform: translateY(-2px);
}
```

---

## Section Tag

```css
.karu-tag {
  display: inline-flex; align-items: center; gap: 10px;
  font-family: var(--karu-font-sans);
  font-size: 0.62rem; font-weight: 700;
  letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--karu-amber); margin-bottom: 18px;
}
.karu-tag::before {
  content: ''; display: block;
  width: 28px; height: 1px; background: var(--karu-amber);
}
```

---

## Feature Cards (Cluely scroll-story blocks)

Each of the 4 "How it works" steps is its own full-width section:
- Text column (step number, headline, 1-sentence description)
- Mesh card with embedded mock Karu UI (booking, vendor check, payment, notification)
- Alternating layout: text-left/card-right then flip

```css
.karu-step-card {
  border-radius: 20px; padding: 36px; overflow: hidden;
  position: relative; min-height: 320px;
  display: flex; align-items: flex-end;
  box-shadow: var(--karu-shadow-float);
}
/* Amber glow inside card */
.karu-step-card::before {
  content: ''; position: absolute;
  bottom: -40px; left: 50%; transform: translateX(-50%);
  width: 280px; height: 180px;
  background: radial-gradient(ellipse at center, rgba(200,132,26,0.15) 0%, transparent 70%);
}
```

---

## Trust Section Cards

```css
.karu-trust-card {
  background: var(--karu-mahogany); padding: 48px 40px;
  position: relative; overflow: hidden;
  transition: background 0.3s;
}
.karu-trust-card:hover { background: var(--karu-cognac); }

/* Top bar sweeps left to right on hover */
.karu-trust-card-bar {
  position: absolute; top: 0; left: 0; right: 0; height: 1.5px;
  background: linear-gradient(90deg, var(--karu-amber), var(--karu-amber-light));
  transform: scaleX(0); transform-origin: left;
  transition: transform 0.45s ease;
}
.karu-trust-card:hover .karu-trust-card-bar { transform: scaleX(1); }
```

---

## City Cards

```css
.karu-city-card {
  background: var(--karu-mahogany);
  border: 1px solid var(--karu-gold-line);
  padding: 64px 52px; position: relative; overflow: hidden;
  transition: border-color 0.4s, transform 0.4s;
}
.karu-city-card:hover {
  border-color: var(--karu-gold-hover);
  transform: translateY(-8px);
}
/* Ghost city code behind content */
.karu-city-code {
  position: absolute; right: -16px; top: 50%; transform: translateY(-50%);
  font-family: var(--karu-font-serif); font-size: 9rem; font-weight: 600;
  color: rgba(240,232,216,0.024); line-height: 1;
  pointer-events: none; user-select: none; white-space: nowrap;
}
```

---

## CTA Section — Keyboard Visual

```html
<div class="kbd-visual">
  <div class="kbd">⌘</div>
  <span class="kbd-sep">+</span>
  <div class="kbd">↵</div>
  <span class="kbd-hint">to submit from anywhere</span>
</div>
```

```css
.kbd {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 44px; height: 44px; padding: 0 12px;
  background: rgba(240,232,216,0.06);
  border: 1px solid rgba(240,232,216,0.15);
  border-bottom: 3px solid rgba(240,232,216,0.12);
  border-radius: 8px;
  font-family: var(--karu-font-sans); font-size: 0.75rem;
  font-weight: 600; color: var(--karu-cream-dim);
  transition: transform 0.12s, border-bottom-width 0.12s, background 0.2s;
}
.kbd:hover {
  background: rgba(200,132,26,0.10);
  border-color: rgba(200,132,26,0.30);
  border-bottom-width: 1px; transform: translateY(2px);
  color: var(--karu-amber);
}
```

---

## Motion System

### Page Load (hero only — max 3 staggered elements)
```css
@keyframes riseUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
/* Badge: delay 0.3s | Title: delay 0.5s | CTAs: delay 0.84s */
```

### Scroll Reveal (all other sections)
```javascript
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
}, { threshold: 0.10 });
document.querySelectorAll('.reveal, .reveal-l, .reveal-r').forEach(el => io.observe(el));
```

```css
.reveal   { opacity: 0; transform: translateY(28px); transition: opacity .75s ease, transform .75s ease; }
.reveal-l { opacity: 0; transform: translateX(-28px); transition: opacity .75s ease, transform .75s ease; }
.reveal-r { opacity: 0; transform: translateX(28px);  transition: opacity .75s ease, transform .75s ease; }
.reveal.show, .reveal-l.show, .reveal-r.show { opacity: 1; transform: none; }
```

### Product Window Float
```css
@keyframes karuFloat {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-8px); }
}
.hero-product { animation: karuFloat 4s ease-in-out infinite; }
```

### Grain Overlay (always present)
```css
body::before {
  content: ''; position: fixed; inset: 0; z-index: 9990;
  pointer-events: none; opacity: 0.028;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 400px;
}
```

### Custom Cursor (desktop only)
```css
body { cursor: none; }
```
```html
<div id="karu-cursor-dot"></div>
<div id="karu-cursor-ring"></div>
```
```javascript
const dot = document.getElementById('karu-cursor-dot');
const ring = document.getElementById('karu-cursor-ring');
let cx=0, cy=0, tx=0, ty=0;
document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
(function raf() {
  cx += (tx-cx)*.12; cy += (ty-cy)*.12;
  dot.style.transform  = `translate(${tx}px,${ty}px)`;
  ring.style.transform = `translate(${cx}px,${cy}px)`;
  requestAnimationFrame(raf);
})();
document.querySelectorAll('a,button,input').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('karu-hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('karu-hovering'));
});
```

---

## Ticker Bar

```html
<div class="karu-ticker-wrap">
  <div class="karu-ticker-track">
    <!-- Duplicate items for seamless loop -->
    <span class="karu-ticker-item">Verified Providers <span>✦</span></span>
    <span class="karu-ticker-item">Airport Pickups <span>✦</span></span>
    <span class="karu-ticker-item">MTN Mobile Money <span>✦</span></span>
    <span class="karu-ticker-item">Orange Money <span>✦</span></span>
    <span class="karu-ticker-item">Douala <span>✦</span></span>
    <span class="karu-ticker-item">Yaoundé <span>✦</span></span>
    <span class="karu-ticker-item">Pre-Arrival Booking <span>✦</span></span>
    <span class="karu-ticker-item">Zero Middlemen <span>✦</span></span>
    <!-- repeat exactly once more for seamless animation -->
  </div>
</div>
```

```css
.karu-ticker-wrap { background: var(--karu-amber); overflow: hidden; padding: 13px 0; }
.karu-ticker-track {
  display: flex; white-space: nowrap;
  animation: karuTicker 30s linear infinite;
}
.karu-ticker-item {
  display: inline-flex; align-items: center; gap: 20px; padding: 0 32px;
  font-family: var(--karu-font-sans);
  font-size: 0.64rem; font-weight: 700; letter-spacing: 0.14em;
  text-transform: uppercase; color: var(--karu-ink);
}
@keyframes karuTicker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
```

---

## Footer Structure

```
Column 1 (Brand):   Logo + 1-sentence brand description
Column 2 (Product): How it works, For vendors, For travellers, Cities
Column 3 (Company): About Zanix, Blog, Press, Contact
Column 4 (Legal):   Privacy Policy, Terms of Service, Vendor Agreement, Cookie Policy

Bottom bar: "© 2025 Karu · getkaru.io" | "A Zanix product · Built for Cameroon"
```

---

## Design Checklist (run before every commit)

- [ ] All colours use `--karu-*` variables — no hardcoded hex except in tokens file
- [ ] Cormorant Garamond loaded for all display text
- [ ] Syne loaded for all UI text
- [ ] Grain overlay present on body::before
- [ ] Custom cursor HTML elements present
- [ ] Nav blurs on scroll
- [ ] Hero has floating product window (SVG mock UI)
- [ ] Ticker bar is amber with dark text
- [ ] Each How it Works step has a mesh card + mock UI
- [ ] Stats row has exactly 3 metrics
- [ ] Cities block has Douala + Yaoundé with coordinates
- [ ] FAQ has 4–6 questions with working accordion
- [ ] CTA section has keyboard visual (⌘ + ↵)
- [ ] Footer is 4 columns
- [ ] All text meets WCAG AA contrast (4.5:1 minimum)
- [ ] Mobile works at 320px minimum width
- [ ] No console errors on load
