# Neurocortex Labs

Landing page for **Neurocortex Labs**, a nonprofit research group.

We study how ordinary skills map onto work that helps people — which industries are
short of what, which roles actually exist, and what the distance is between where
someone is now and where they could be useful. The research is published free, with
methods attached.

**Live site:** https://neurocortexlabs.github.io/

---

## Stack

| Layer    | Choice                                    |
| -------- | ----------------------------------------- |
| Build    | [Vite](https://vite.dev)                  |
| UI       | React 19 + TypeScript                     |
| Styling  | Tailwind CSS v4 (CSS-first `@theme` config) |
| 3D       | three.js via React Three Fiber (lazy-loaded) |
| Lint     | ESLint flat config + typescript-eslint    |
| Hosting  | GitHub Pages, deployed by GitHub Actions  |

No CSS framework overrides, no component library. The design tokens live in
[`src/index.css`](src/index.css) and everything else composes from them.

## Getting started

```bash
npm install
npm run dev
```

| Script              | What it does                                  |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Dev server with HMR at `localhost:5173`       |
| `npm run build`     | Typecheck, then production build into `dist/` |
| `npm run preview`   | Serve the production build locally            |
| `npm run lint`      | ESLint over the whole repo                    |
| `npm run typecheck` | `tsc` in build mode, no emit                  |
| `npm run og`        | Rasterize the social card to `public/og-image.png` |

## Project layout

```
assets/         Design sources that are built, not served (og-image.svg)
public/         Served verbatim (favicon, generated og-image.png)
scripts/        One-off build helpers
src/
  components/
    brain/      The interactive 3D hero (see below)
    layout/     Header, Footer — the frame around every page
    sections/   One file per landing-page section
    ui/         Small reusable pieces (Button, SectionHeading, icons)
  content/      Copy and data, kept out of the components
  hooks/        useInView, usePrefersReducedMotion
  index.css     Design tokens + base styles
```

Copy lives in `src/content/` on purpose. Editing the words should not mean
editing a component.

## The brain

The hero is a procedural 3D brain where each lobe opens a section of the site.
No model file is involved — the geometry is generated in `brain/geometry.ts`.

The one thing worth knowing before editing it: **the cerebrum is a single
surface per hemisphere, split into lobes by sorting its faces**, not four
overlapping ellipsoids. Independent per-lobe spheres were tried first and the
silhouette is a union of circles no matter how the centres are tuned — it
always looks like a bag of stones. Deforming one surface and partitioning it
keeps the organ continuous while still giving each region its own mesh to
raycast against.

The same trap catches the midline. Each hemisphere is a **whole** ellipsoid
centred on z = 0, sliced in half by clamping every vertex to `MEDIAL_GAP`.
Offsetting two hemispheres apart instead leaves a gap that widens toward the
poles — worst at the frontal pole — which head-on looks like a strip missing
from the middle of the brain.

| File               | What it owns                                            |
| ------------------ | ------------------------------------------------------- |
| `brainRegions.ts`  | Which lobe maps to which section, and the accent colours |
| `geometry.ts`      | The fold field, the lateral sulcus, face classification  |
| `BrainScene.tsx`   | Lighting, materials, hover and click                     |
| `BrainStage.tsx`   | Loading, fallbacks, caption and legend                   |

Useful dials, all in `BrainScene.tsx`: `REST_GLOW` (how colour-coded the brain
looks when nobody is touching it), `HOVER_GLOW`, `HOVER_LIFT`, and `TISSUE`.
Colours mix in **linear** space, so small numbers go further than they look.

three.js is lazy-loaded, so the headline and CTAs paint on the initial bundle
and the scene arrives after. The stage degrades in three steps: no WebGL falls
back to the constellation graphic, `prefers-reduced-motion` disables the
auto-rotation, and the canvas stops rendering entirely once it scrolls out of
view. The legend beneath the brain is the accessible path to the same
navigation — real links, keyboard reachable, and the only version that exists
when WebGL is unavailable.

## Deployment

Every push to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds the site and publishes it to GitHub Pages.
[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs lint, typecheck and
build on pull requests so nothing broken reaches `main`.

This repo is the organization's **root** Pages site — it is named
`neurocortexlabs.github.io`, so it publishes to the domain root rather than a
`/repo-name/` subpath. That is why `vite.config.ts` sets `base: '/'`, and why
pointing a custom domain here later needs no build changes at all.

## Roadmap

- [x] Landing page: mission, method, focus areas
- [ ] **Cortex** — a hosted assistant that walks someone through the three-step
      research process conversationally, instead of making them read it
- [ ] Published skill-to-impact maps as browsable pages rather than prose
- [ ] Newsletter delivery for new research

## License

Code is [MIT](LICENSE). Research and written content published by Neurocortex Labs
is intended to be freely shared — attribution appreciated, permission not required.
