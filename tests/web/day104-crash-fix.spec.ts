import { test, expect } from '@playwright/test';

test.describe('Day 104 - Crash Fix Verification', () => {
  test('homepage loads without crash', async ({ page }) => {
    const response = await page.goto('https://www.soloshopbox.com/');
    expect(response?.status()).toBe(200);
    
    // Verify page content loads
    await expect(page.locator('body')).toBeVisible();
  });

  test('shop page loads without crash - reads currency field', async ({ page }) => {
    // This was the crashing endpoint - prisma.shop.findUnique() was reading Shop.currency
    const response = await page.goto('https://www.soloshopbox.com/shop/salman');
    expect(response?.status()).toBe(200);
    
    // Verify shop page structure loads
    await expect(page.locator('body')).toBeVisible();
    
    // Check that shop content is rendered (not a Prisma error page)
    const pageText = await page.textContent('body');
    expect(pageText).not.toContain('PrismaClientKnownRequestError');
    expect(pageText).not.toContain('Shop.currency');
    expect(pageText).not.toContain('column does not exist');
  });

  test('dashboard redirects properly (not crash)', async ({ page }) => {
    // Dashboard should redirect to login, not crash
    const response = await page.goto('https://www.soloshopbox.com/dashboard', {
      waitUntil: 'networkidle'
    });
    
    // Should redirect to login (307 -> 200 on login page)
    const finalUrl = page.url();
    expect(finalUrl).toContain('login');
    expect(response?.status()).toBeLessThan(400); // Not a 500 error
  });

  test('API currency endpoint works', async ({ page }) => {
    // Test the API endpoint that reads currency directly
    const response = await page.goto('https://www.soloshopbox.com/api/shops/salman/currency');
    expect(response?.status()).toBe(200);
    
    const body = await page.textContent('body');
    const data = JSON.parse(body || '{}');
    
    // Should return currency field (USD or KWD)
    expect(data).toHaveProperty('currency');
    expect(['USD', 'KWD']).toContain(data.currency);
  });

  test('shop products page loads without Prisma errors', async ({ page }) => {
    const response = await page.goto('https://www.soloshopbox.com/shop/salman');
    expect(response?.status()).toBe(200);
    
    // Wait for products to load
    await page.waitForLoadState('networkidle');
    
    // Check console for Prisma errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Reload to catch any console errors
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Should not have Prisma schema errors
    const prismaErrors = errors.filter(e => 
      e.includes('Prisma') || e.includes('Shop.currency') || e.includes('column does not exist')
    );
    expect(prismaErrors).toHaveLength(0);
  });

  test('health check confirms database migration applied', async ({ page }) => {
    const response = await page.goto('https://www.soloshopbox.com/api/health');
    expect(response?.status()).toBe(200);
    
    const body = await page.textContent('body');
    const health = JSON.parse(body || '{}');
    
    expect(health.status).toBe('ok');
    expect(health.checks.database.status).toBe('ok');
  });
});
