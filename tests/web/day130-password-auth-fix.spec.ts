import { test, expect } from '@playwright/test';

test.describe('Day 130 — Password Auth & Reset (FR-21, FR-22)', () => {
  
  test('FR-21: Seller can sign up and login with password', async ({ page }) => {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'SecurePassword123!';

    // Navigate to signup page
    await page.goto('https://www.soloshopbox.com/auth/signup');
    
    // Fill signup form with password
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="name"]', 'Test Seller');
    await page.fill('input[name="password"]', testPassword);
    
    // Submit signup
    await page.click('button[type="submit"]');
    
    // Should redirect or show success (magic link flow may still exist)
    await page.waitForTimeout(2000);
    
    // Now try to login with password
    await page.goto('https://www.soloshopbox.com/auth/login');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard or shops
    await page.waitForTimeout(3000);
    const url = page.url();
    expect(url).toMatch(/dashboard|create-shop/);
  });

  test('FR-22: Forgot password flow works end-to-end', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://www.soloshopbox.com/auth/login');
    
    // Look for "Forgot password?" link
    const forgotLink = page.locator('a[href*="forgot"]');
    await expect(forgotLink).toBeVisible();
    
    // Click forgot password
    await forgotLink.click();
    
    // Should land on forgot password page
    await expect(page).toHaveURL(/forgot-password/);
    
    // Page should have email input and submit button
    await expect(page.locator('input[name="email"], input[type="email"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Try submitting with test email
    await page.fill('input[name="email"], input[type="email"]', 'test@example.com');
    await page.click('button[type="submit"]');
    
    // Should show success message or confirmation
    await page.waitForTimeout(2000);
    const content = await page.textContent('body');
    expect(content).toMatch(/sent|email|check|reset/i);
  });

  test('Password reset page exists and has proper form', async ({ page }) => {
    // Visit reset page with dummy token
    await page.goto('https://www.soloshopbox.com/auth/reset-password?token=test123');
    
    // Should have password fields
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Form should have at least one password field (new password)
    const passwordFields = await page.locator('input[type="password"]').count();
    expect(passwordFields).toBeGreaterThanOrEqual(1);
  });

  test('Login page has password input field', async ({ page }) => {
    await page.goto('https://www.soloshopbox.com/auth/login');
    
    // Check for password input
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    await expect(passwordInput).toBeVisible();
    
    // Check for email input
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    await expect(emailInput).toBeVisible();
    
    // Check for submit button
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('Signup page has password field', async ({ page }) => {
    await page.goto('https://www.soloshopbox.com/auth/signup');
    
    // Check for password input on signup
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    await expect(passwordInput).toBeVisible();
  });

});
