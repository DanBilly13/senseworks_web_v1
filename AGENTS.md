<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# senseworks web — agent notes

Full context lives in `senseworks-specs/web-block-library/` (sibling
repo): `solution-spec.md`, `decision-log.md`, `risk-register.md`,
`implementation-plan.md`.

- Tailwind CSS **v4** (CSS-first `@theme` in `src/app/globals.css`).
  There is no `tailwind.config.js` — don't add one.
- Never use Tailwind arbitrary-value syntax (`rounded-[13px]`) —
  enforced by `eslint-plugin-tailwindcss`'s `no-arbitrary-value` rule
  (`eslint.config.mjs`). Add a named token to `globals.css` instead.
- **Never use `max-w-xl`/`max-w-2xl`/`max-w-3xl`/`max-w-4xl`** (or
  `w-`/`h-` with those names). Our spacing scale defines
  `--spacing-xl/2xl/3xl/4xl`, and Tailwind v4 resolves named `max-w-*`
  against `--spacing-*` before its own `--container-*` scale — so
  those utilities silently compute to our spacing values (tens of
  px) instead of Tailwind's real container widths (hundreds of px).
  This broke the Hero/FAQ layout once already (see `risk-register.md`
  R14) and passed lint/build cleanly while broken — only visual/
  computed-style checking caught it. Use `max-w-prose-sm/md/lg`
  instead (defined in `globals.css` specifically to avoid this).
  After adding any new width/max-width utility, verify its computed
  value in a real browser — don't trust lint+build alone.
- **Width tiers (D15)**: three levels, don't mix them up. Section
  backgrounds may go full-bleed (no cap). Structural content rows
  (nav bar contents, a hero's text+image column, future feature
  grids) cap at `max-w-page` (1440px) — this matters because the
  actual audience often works on wide/ultrawide monitors, and
  uncapped content sprawls absurdly thin/far apart otherwise. Body
  text specifically caps narrower still, at `max-w-prose-sm/md/lg`
  (576–768px), for readability. Every new block needs its structural
  wrapper capped at `max-w-page`, with any prose text inside further
  capped at `max-w-prose-*` — don't leave a block's content width
  fully uncapped.
- **Intro-text-to-content gap = `gap-2xl`/`mt-2xl` (64px)**: every
  block that stacks an intro text cluster (eyebrow/heading/body/CTA)
  above a content area (image, grid, cards, a carousel) uses exactly
  64px between them — Hero, Feature Grid, Testimonial Carousel, Stats
  Band, Pricing Cards, and FAQ all match. Within the text cluster
  itself, elements are `gap-medium` (16px) apart. When the content
  area can't be a flex/grid sibling of the text cluster (e.g. a
  full-bleed carousel scroller that must sit outside the `max-w-page`
  wrapper), use `mt-2xl` on it directly instead of a parent `gap`.
  Don't reach for `mt-medium-large` or other one-off values here — it
  reads as visually inconsistent between blocks stacked on the same
  page (caught by Dan comparing Pricing Cards to the Testimonial
  Carousel/"social proof" block).
- **`mx-auto` + `max-w-*` needs an explicit `w-full` alongside it**
  whenever the element is a direct child of `<body>` (root layout is
  `flex flex-col`) or any other flex/grid container. CSS flexbox
  disables an item's default stretch when its cross-axis margins are
  `auto` and its width is `auto` — so without `w-full`, the box
  shrink-wraps to its content's natural size instead of filling out
  to the `max-w-*` cap, and visibly resizes whenever the content
  inside it changes (this broke the FAQ accordion — it changed width
  every time an item expanded/collapsed). Pattern:
  `mx-auto w-full max-w-prose-lg`, not just `mx-auto max-w-prose-lg`.
- **Shared UI primitives, not copy-paste.** Two patterns were
  duplicated across every block before being extracted — use them
  instead of hand-rolling the markup again:
  - `SectionShell` (`src/components/ui/SectionShell.tsx`): the
    `<section>` + centered/padded `max-w-page` (or `prose-lg`)
    container. Only skip it when a block's content genuinely can't
    live inside one wrapper (Feature Split's mirrored row, Testimonial
    Carousel's full-bleed scroller that must escape the container).
  - `SectionIntro` (`src/components/ui/SectionIntro.tsx`): the
    eyebrow/heading/body/CTA cluster. Takes `as="h1"|"h2"|"h3"` for
    the real heading level — **Hero is the only `h1` on a page**
    (it's the page title); every section heading is `h2`; card/item-
    level sub-headings within a section are `h3` (e.g. a Pricing
    plan's name). Don't default to `h1` for visual size — Pricing and
    Bento Grid both did this early on (an `h2` styled at `text-h1`
    size) and it was never actually a deliberate choice, just
    copy-paste from Hero.
- Block components live in `src/components/blocks/`, one file per
  Sanity block schema in `src/sanity/schemaTypes/blocks/`. Register
  new blocks in **both** `src/sanity/schemaTypes/index.ts` and
  `src/components/blocks/BlockRenderer.tsx` — a block missing from
  either place silently won't render (this is intentional, see D7:
  unknown/incomplete blocks don't render).
- Icons use **`@ant-design/icons`** (D16) — don't reach for unicode
  glyphs, another icon package, or inline SVGs. Its icon components
  need a client-side React context, so any component that renders one
  must have `'use client'` at the top, even if it would otherwise be a
  plain Server Component.
- i18n: locale-prefixed routes only (`/en/...`, `/sv/...`), English
  is the default. Data fetching always goes through
  `src/lib/sanity/getPage.ts`, which already implements the
  locale-fallback `coalesce()` query (D12) — don't write ad hoc
  Sanity queries elsewhere for page content.
- Test runner is **Vitest** (unit/component, `yarn test`) +
  **Playwright** (e2e, `yarn test:e2e`) — not Jest.
- Package manager is **yarn**. `yarn.lock` is the source of truth; do
  not commit a `package-lock.json`.
- `.env.local` holds only public Sanity identifiers
  (`NEXT_PUBLIC_SANITY_PROJECT_ID`/`_DATASET`) — never a real secret.
  It's gitignored; never commit it.
