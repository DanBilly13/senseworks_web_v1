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
- Block components live in `src/components/blocks/`, one file per
  Sanity block schema in `src/sanity/schemaTypes/blocks/`. Register
  new blocks in **both** `src/sanity/schemaTypes/index.ts` and
  `src/components/blocks/BlockRenderer.tsx` — a block missing from
  either place silently won't render (this is intentional, see D7:
  unknown/incomplete blocks don't render).
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
