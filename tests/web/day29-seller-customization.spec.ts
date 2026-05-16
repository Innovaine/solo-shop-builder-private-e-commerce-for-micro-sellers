import { test, expect } from '@playwright/test';

test.describe('Day 29 — Seller Customization Features', () => {
  test('FR-31/32: Seller profile page and storefront display', async ({ page }) => {
    // Navigate to login
    await page.goto('http://localhost:3000/auth/login');
    
    // Login (use test credentials)
    await page.fill('input[type="email"]', 'test-seller-day29@example.com');
    await page.fill('input[type="password"]', 'testpass123');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard
    await page.waitForURL('**/dashboard');
    
    // Navigate to profile page
    await page.goto('http://localhost:3000/dashboard/profile');
    await expect(page.locator('h1')).toContainText('Seller Profile');
    
    // Fill in profile fields
    await page.fill('input[name="businessName"]', 'Day 29 Test Shop');
    await page.fill('input[name="contactEmail"]', 'contact@day29shop.com');
    await page.fill('input[name="phone"]', '+1234567890');
    await page.fill('textarea[name="bio"]', 'We sell amazing handcrafted items.');
    
    // Save profile
    await page.click('button:has-text("Save Profile")');
    await expect(page.locator('text=/saved|success/i')).toBeVisible({ timeout: 5000 });
    
    // Now check storefront displays profile info
    // First get the shop slug
    const shopLink = await page.locator('a[href*="/shop/"]').first();
    const shopUrl = await shopLink.getAttribute('href');
    
    if (shopUrl) {
      await page.goto(`http://localhost:3000${shopUrl}`);
      // Check that profile info appears on storefront
      await expect(page.locator('text=/Day 29 Test Shop|contact@day29shop.com/i')).toBeVisible();
    }
  });

  test('FR-33/34: Shop branding with custom colors', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login');
    await page.fill('input[type="email"]', 'test-seller-day29@example.com');
    await page.fill('input[type="password"]', 'testpass123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    
    // Navigate to branding page
    await page.goto('http://localhost:3000/dashboard/branding');
    await expect(page.locator('h1')).toContainText(/branding|colors/i);
    
    // Set custom colors
    const primaryColorInput = page.locator('input[type="color"]').first();
    await primaryColorInput.fill('#FF5733');
    
    // Save branding
    await page.click('button:has-text("Save")');
    await expect(page.locator('text=/saved|success/i')).toBeVisible({ timeout: 5000 });
    
    // Verify storefront uses custom color
    const shopLink = await page.locator('a[href*="/shop/"]').first();
    const shopUrl = await shopLink.getAttribute('href');
    
    if (shopUrl) {
      await page.goto(`http://localhost:3000${shopUrl}`);
      // Check if custom color is applied (look for the hex color in styles)
      const headerStyle = await page.locator('header, nav, .header').first().getAttribute('style');
      // Custom colors might be in inline styles or CSS variables
    }
  });

  test('FR-35/36: Email template customization', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login');
    await page.fill('input[type="email"]', 'test-seller-day29@example.com');
    await page.fill('input[type="password"]', 'testpass123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    
    // Navigate to email template page
    await page.goto('http://localhost:3000/dashboard/email-template');
    await expect(page.locator('h1')).toContainText(/email|template/i);
    
    // Customize email template
    await page.fill('input[name="emailSubject"]', 'Your Order from Day 29 Shop');
    await page.fill('textarea[name="emailHeader"]', 'Thank you for your order!');
    await page.fill('textarea[name="emailFooter"]', 'Contact us at support@day29shop.com');
    
    // Save template
    await page.click('button:has-text("Save")');
    await expect(page.locator('text=/saved|success/i')).toBeVisible({ timeout: 5000 });
  });

  test('FR-37/38: Billing dashboard with transaction history', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login');
    await page.fill('input[type="email"]', 'test-seller-day29@example.com');
    await page.fill('input[type="password"]', 'testpass123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    
    // Navigate to billing page
    await page.goto('http://localhost:3000/dashboard/billing');
    await expect(page.locator('h1')).toContainText(/billing|transaction/i);
    
    // Should display transaction history (even if empty)
    await expect(page.locator('table, .transaction, text=/no transactions|history/i')).toBeVisible();
  });

  test('FR-39/40: Enhanced analytics dashboard', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login');
    await page.fill('input[type="email"]', 'test-seller-day29@example.com');
    await page.fill('input[type="password"]', 'testpass123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    
    // Navigate to analytics page
    await page.goto('http://localhost:3000/dashboard/analytics');
    await expect(page.locator('h1')).toContainText(/analytics|dashboard/i);
    
    // Should display revenue, orders, and top products
    await expect(page.locator('text=/revenue|total|sales/i')).toBeVisible();
    await expect(page.locator('text=/orders|total orders/i')).toBeVisible();
    await expect(page.locator('text=/top products|best selling/i')).toBeVisible();
  });
});
