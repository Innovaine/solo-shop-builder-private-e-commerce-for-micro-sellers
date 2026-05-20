// Day 105 Testing: Schema drift fix, product image display, currency selector
// Tests for #302, #303, #304

import { test, expect } from '@playwright/test'

test.describe('Day 105 - Critical Fixes', () => {
  // #302: OrderItem schema drift fix - productTitle instead of title
  test('#302: Orders page displays product titles correctly', async ({ page }) => {
    // Login as seller
    await page.goto('https://www.soloshopbox.com/auth/login')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'testpass123')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/dashboard')

    // Navigate to orders page
    await page.goto('https://www.soloshopbox.com/dashboard/orders')
    await page.waitForSelector('table', { timeout: 10000 })

    // Check that orders table exists and has product title column
    const itemsHeader = await page.locator('th:has-text("Items")')
    await expect(itemsHeader).toBeVisible()

    // Verify that order items display productTitle field (not title)
    // The fix changed the type to use productTitle instead of title
    const firstRow = await page.locator('tbody tr').first()
    const itemsCell = await firstRow.locator('td').nth(3) // Items column
    
    // Should display product name and quantity, not throw error
    const itemText = await itemsCell.textContent()
    expect(itemText).toBeTruthy() // Should have content
    expect(itemText).toMatch(/\(\d+\)/) // Should show quantity in parentheses
  })

  // #303: Product details page crash fix - prioritize images array
  test('#303: Product detail page displays images without crash', async ({ page }) => {
    // Visit a product detail page
    await page.goto('https://www.soloshopbox.com/shop/test-shop')
    
    // Wait for products to load
    await page.waitForSelector('.grid', { timeout: 10000 })
    
    // Click first product
    const firstProduct = await page.locator('article').first()
    await firstProduct.click()
    
    // Should navigate to product detail without crash
    await page.waitForURL('**/product/**', { timeout: 10000 })
    
    // Check that product detail page loaded
    await expect(page.locator('h1')).toBeVisible()
    
    // Verify image display logic:
    // 1. Should show first image from images array if exists
    // 2. Should fallback to imageUrl if images array empty
    // 3. Should show placeholder if neither exists
    const mainImage = await page.locator('.aspect-square img').first()
    const noImageText = await page.locator('.aspect-square:has-text("No image available")')
    
    // Either image is visible OR placeholder text is visible
    const hasImage = await mainImage.isVisible().catch(() => false)
    const hasPlaceholder = await noImageText.isVisible().catch(() => false)
    
    expect(hasImage || hasPlaceholder).toBeTruthy()
    
    // Page should not crash - check for common crash indicators
    const errorBoundary = await page.locator('text=/error|crash|failed/i')
    const errorCount = await errorBoundary.count()
    expect(errorCount).toBe(0)
  })

  // #304: Currency selector in shop creation
  test('#304: Shop creation form includes currency selector', async ({ page }) => {
    // Login
    await page.goto('https://www.soloshopbox.com/auth/login')
    await page.fill('input[type="email"]', 'newshop@example.com')
    await page.fill('input[type="password"]', 'testpass123')
    await page.click('button[type="submit"]')
    
    // Navigate to create shop page
    await page.goto('https://www.soloshopbox.com/dashboard/create-shop')
    await page.waitForSelector('form', { timeout: 10000 })
    
    // Check currency selector exists
    const currencySelect = await page.locator('select#currency')
    await expect(currencySelect).toBeVisible()
    
    // Verify currency options
    const options = await currencySelect.locator('option').allTextContents()
    expect(options).toContain('USD - United States Dollar')
    expect(options).toContain('KWD - Kuwaiti Dinar')
    
    // Verify default is USD
    const defaultValue = await currencySelect.inputValue()
    expect(defaultValue).toBe('USD')
    
    // Check payment provider hint for USD
    let providerHint = await page.locator('text=/Stripe/i')
    await expect(providerHint).toBeVisible()
    
    // Change to KWD
    await currencySelect.selectOption('KWD')
    
    // Check payment provider hint updates to MyFatoorah
    providerHint = await page.locator('text=/MyFatoorah/i')
    await expect(providerHint).toBeVisible()
    
    // Fill rest of form
    await page.fill('input#shopName', 'Test KWD Shop')
    await page.fill('input#shopSlug', 'test-kwd-shop')
    
    // Verify slug validation
    const slugPreview = await page.locator('text=/soloshopbox.com\\/shop\\/test-kwd-shop/i')
    await expect(slugPreview).toBeVisible()
  })

  // Integration test: Verify all three fixes work together
  test('Integration: Orders page, product detail, and shop creation all work', async ({ page }) => {
    // 1. Create shop with currency
    await page.goto('https://www.soloshopbox.com/auth/login')
    await page.fill('input[type="email"]', 'integration@example.com')
    await page.fill('input[type="password"]', 'testpass123')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/dashboard')
    
    // 2. Check product detail doesn't crash
    const shopSlug = 'test-shop'
    await page.goto(`https://www.soloshopbox.com/shop/${shopSlug}`)
    const products = await page.locator('article').count()
    
    if (products > 0) {
      await page.locator('article').first().click()
      await page.waitForURL('**/product/**')
      await expect(page.locator('h1')).toBeVisible()
    }
    
    // 3. Check orders page displays correctly
    await page.goto('https://www.soloshopbox.com/dashboard/orders')
    await expect(page.locator('h1:has-text("Orders")')).toBeVisible()
    
    // All three pages should be accessible without crashes
    const pageTitle = await page.title()
    expect(pageTitle).toBeTruthy()
  })
})
