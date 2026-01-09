import { test, expect } from '@playwright/test'

test.describe('Gestion des tissus', () => {
  test('page liste des tissus est accessible', async ({ page }) => {
    await page.goto('/tissu')
    await expect(page).toHaveURL('/tissu')
  })
})