import { test, expect } from '@playwright/test'

test.describe('Authentification', () => {
  test('utilisateur peut accéder à la page de login', async ({ page }) => {
    await page.goto('/login')
    await expect(page).toHaveURL('/login')
  })

  test('formulaire de login est visible', async ({ page }) => {
    await page.goto('/login')
    
    // Vérifier que les champs sont présents
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')
    
    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
  })
})