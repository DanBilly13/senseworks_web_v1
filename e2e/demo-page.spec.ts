import { test, expect } from '@playwright/test'

// These tests require a real Sanity project with the "home" page
// authored in Studio (see implementation-plan.md Step 8) — they
// cannot pass against the placeholder .env.local values.

test('demo page renders header, hero, and an interactive FAQ (en)', async ({ page }) => {
  await page.goto('/en/home')
  await expect(page.getByRole('banner')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  const question = page.getByRole('button', { name: /.+/ }).first()
  await question.click()
  await expect(question).toHaveAttribute('aria-expanded', 'true')
})

test('requesting an untranslated locale falls back silently, no error page (D8, D12)', async ({
  page,
}) => {
  // Assumes only the English "home" page exists at this point in the slice.
  const response = await page.goto('/sv/home')
  expect(response?.status()).toBeLessThan(400)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})
