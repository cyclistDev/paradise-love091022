# Paradise — A Love Letter in Light 🌸🦋

A mobile-first, romantic **golden-hour QR experience**. Compose a private message,
generate a clean printable QR code, and when your loved one scans it the screen
blooms from darkness into a warm paradise of falling flowers, fluttering
butterflies, drifting shimmer and a message written just for them.

Everything lives in the link — **no backend, no accounts**. All the data the
reveal needs travels in the URL (`?to=...&headline=...&sub=...`).

## ✨ Features

- **Creator / Landing page (`/`)** — romantic pitch, a live preview thumbnail,
  inputs for recipient name / headline / subline, a big **Generate QR** button,
  and **Download PNG** for a clean, high-error-correction printable code.
- **Reveal page (`/reveal`)** — full-screen, portrait-optimised animation:
  - starts dark → a **golden bloom explosion** from the centre
  - settles into a warm golden-hour gradient
  - layered, parallaxed: **cascading flowers/petals** (peony, orchid, cherry
    blossom) with depth blur, **8–14 butterflies** (monarch + iridescent) with
    realistic flapping wings, **upward shimmer particles**, and **soft bokeh**
  - elegant serif typography fades in after the bloom
  - a subtle **haptic pulse** on load and a **Tap to replay** button
- **`useParallax` hook** combining:
  - **device orientation** (with iOS permission request + “Enable Motion” button)
  - **mouse/touch drag** fallback (plus desktop hover)
  - **smooth lerping** and **per-layer depth** (butterflies strongest, bokeh weakest)
  - respects **`prefers-reduced-motion`**
- All art is **inline SVG** — no image assets. Serif typography via
  Playfair Display + Cormorant Garamond.

## 🧱 Tech stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · Framer Motion · `qrcode`.

## 🚀 Getting started

> Requires Node ≥ 22.13 (Node 24 recommended).

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run lint     # eslint (React Compiler rules)
npm run preview  # preview the production build
```

Open the printed local URL, fill in the form on `/`, hit **Generate QR**, and
scan it (or click **Open reveal**) to see `/reveal` in action.

## 🗂️ Project structure

```
src/
  App.tsx                  # routes: / and /reveal
  main.tsx
  index.css                # Tailwind v4 theme tokens + base styles
  lib/
    params.ts              # URL <-> reveal params contract
    qr.ts                  # QR canvas/PNG helpers
    random.ts              # deterministic seeded RNG (pure, idempotent)
  hooks/
    useParallax.ts         # gyro + drag parallax driver
  components/
    Flower.tsx             # inline SVG: peony / orchid / blossom
    Butterfly.tsx          # inline SVG with flapping wings (monarch / iridescent)
    Butterflies.tsx        # flutter of butterflies on varied paths
    Petals.tsx             # cascading flowers with depth blur
    ShimmerParticles.tsx   # upward-drifting motes
    Bokeh.tsx              # soft background circles
    GoldenBloom.tsx        # opening light explosion
    ParallaxLayer.tsx      # depth-scaled parallax wrapper
    RevealTypography.tsx   # centred message
    ParadiseScene.tsx      # orchestrates the full reveal
    PreviewThumbnail.tsx   # live mini-preview on the creator page
  pages/
    CreatorPage.tsx
    RevealPage.tsx
```

## ♿ Accessibility

When the OS requests reduced motion, animations collapse to gentle fades and a
still, scattered bouquet — the message and art are always legible.
