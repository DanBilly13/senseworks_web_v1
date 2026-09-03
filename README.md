# Senseworks Web Block Library

CMS-driven React/TypeScript block library for the Senseworks
marketing site. See `senseworks-specs/web-block-library/` (in the
sibling `senseworks-specs` repo) for the full spec, decisions, and
risk register.

This slice implements the calibration set: **Header**, **Hero**, and
**FAQ accordion**, assembled from Sanity content into one demo page
(`/en/home`, `/sv/home`).

## Setup

1. `yarn install`
2. Copy `.env.local.example` to `.env.local` and fill in your Sanity
   project details (see comments in that file for the exact commands
   — `npx sanity login` then `npx sanity init`).
3. `yarn dev`

Sanity Studio: http://localhost:3000/studio
Demo page: http://localhost:3000/en/home

## Test

```bash
yarn lint
npx tsc --noEmit
yarn test        # Vitest — unit/component
yarn test:e2e     # Playwright — requires a real Sanity project + authored content
yarn build
```

## Design tokens

All spacing, radius, and typography values are defined once in
`src/app/globals.css` under `@theme`. Never use Tailwind's arbitrary
value syntax (`rounded-[13px]`) — it's blocked by
`eslint-plugin-tailwindcss`'s `no-arbitrary-value` rule. Add a new
token to `globals.css` instead.
