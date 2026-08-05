# Contributing

Thanks for looking. This repo is the public landing page for Neurocortex Labs, and
help is welcome on both the site and the research it points at.

## Ways to help that are not code

- **Tell us a field we are missing.** If you work in a sector that is short of
  people in ways job postings do not capture, open a
  [focus area suggestion](../../issues/new?template=focus-area.yml). That is the
  most useful thing anyone can send us.
- **Correct us.** If something we published about your industry is wrong or out of
  date, say so. Open an issue, or email <hello@neurocortexlabs.org>.

## Working on the site

```bash
npm install
npm run dev
```

Before opening a pull request:

```bash
npm run lint
npm run typecheck
npm run build
```

CI runs the same three, so a green local run means a green PR.

### Conventions

- **Copy lives in `src/content/`.** If you are only changing words, you should not
  need to open a component.
- **Style with tokens, not raw values.** Colours, fonts and section type scales are
  defined in `@theme` at the top of `src/index.css`. Reach for `text-ink-300`, not
  `text-[#9dabcb]`.
- **Tailwind classes must be literal.** The scanner reads source text, so
  `text-${accent}-400` silently produces nothing. Write the full class names out and
  pick between them — see `ACCENTS` in `FocusAreas.tsx` for the pattern.
- **Respect reduced motion.** Every animation is either behind
  `motion-reduce:` variants or covered by the global
  `prefers-reduced-motion` rule in `src/index.css`. Keep it that way.
- **One section per file** in `src/components/sections/`, wired up in `App.tsx`.

### Commit messages

Conventional-commit prefixes, lowercase subject:

```
feat: add newsletter archive section
fix: keep focus inside the mobile nav
docs: explain the focus area methodology
ci: cache the pages build
```

## Reporting a security issue

Please do not open a public issue. Email <hello@neurocortexlabs.org> instead.
