# Neurocortex Labs

Landing page for **Neurocortex Labs**, a nonprofit research group.

We study how ordinary skills map onto work that helps people — which industries are
short of what, which roles actually exist, and what the distance is between where
someone is now and where they could be useful. The research is published free, with
methods attached.

**Live site:** https://aaronhhsi.github.io/neurocortex-labs/

---

## Stack

| Layer    | Choice                                    |
| -------- | ----------------------------------------- |
| Build    | [Vite](https://vite.dev)                  |
| UI       | React 19 + TypeScript                     |
| Styling  | Tailwind CSS v4 (CSS-first `@theme` config) |
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

## Project layout

```
src/
  components/
    layout/     Header, Footer — the frame around every page
    sections/   One file per landing-page section
    ui/         Small reusable pieces (Button, SectionHeading, icons)
  content/      Copy and data, kept out of the components
  index.css     Design tokens + base styles
```

Copy lives in `src/content/` on purpose. Editing the words should not mean
editing a component.

## Deployment

Every push to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds the site and publishes it to GitHub Pages.
[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs lint, typecheck and
build on pull requests so nothing broken reaches `main`.

Pages serves the site from a subpath, so `vite.config.ts` sets
`base: '/neurocortex-labs/'`. If a custom domain is ever pointed at the site,
change that back to `'/'`.

## Roadmap

- [x] Landing page: mission, method, focus areas
- [ ] **Cortex** — a hosted assistant that walks someone through the three-step
      research process conversationally, instead of making them read it
- [ ] Published skill-to-impact maps as browsable pages rather than prose
- [ ] Newsletter delivery for new research

## License

Code is [MIT](LICENSE). Research and written content published by Neurocortex Labs
is intended to be freely shared — attribution appreciated, permission not required.
