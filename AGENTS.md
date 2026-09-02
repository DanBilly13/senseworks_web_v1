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
