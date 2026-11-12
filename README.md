# NOCTIS — Futuristic Car Theme Website

**Brief:** #5 Futuristic Car Theme Website — ACM MAJU Vibe Coding Competition, 12 Nov 2026
**Team:** Muzammil (solo) — _add ID / name as required by the submission form_
**Audience / primary task:** A premium EV buyer who wants to see the car in 3D, compare variants and book a test drive. Primary action: **Book a Test Drive**.

## Features
Loader, 3D hero with camera intro, pinned scroll stats, 3 variant tabs + side-by-side compare, live paint configurator (6 finishes, Studio/Night light), 3 clickable 3D hotspots, photo mode (PNG), AR button (supported phones), Ctrl/Cmd+K command palette, optional sound, fake test-drive form with booking ticket (nothing is sent or stored).

## Stack
React 18, Vite, @google/model-viewer, GSAP + ScrollTrigger + @gsap/react, Lenis, Zustand, SplitType. Plain CSS.

## Run
```
npm install
npm run dev      # development
npm run build    # production build in dist/
```
Deploy on Vercel: set **Root Directory** to `NOCTIS_CYBER_VELOCITY_COMPLETE` (if the repo root is the parent), build `npm run build`, output `dist`.

## AI tools used
ChatGPT / Claude for code generation and review. **What I checked or changed:** _write your own edits here (copy, palette, interactions, bug fixes, mobile/keyboard checks)._

## Credits
- 3D model: **CarConcept** © 2024 Darmstadt Graphics Group GmbH, licensed CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Source: KhronosGroup/glTF-Sample-Assets. Changes: textures converted to WebP; body paint recolored at runtime.
- Fonts: Big Shoulders Display, IBM Plex Sans, JetBrains Mono (Google Fonts, OFL).
- Libraries: React, Vite, model-viewer, GSAP, Lenis, Zustand, SplitType.
- `public/posters/car-1..3.webp`: concept images supplied by the team — _state source/tool here_. Used only as fallback/loading visuals.

## Sample data
All names, specs, prices (NCR, a fictional currency), booking references and form data are fictional. The brand NOCTIS is fictional.

## Known limits
All three variants share one 3D body (specs differ); 3D file is ~9 MB so first load can be slow on mobile.

Live link: _add Vercel URL_ · Repo: _add GitHub URL_
