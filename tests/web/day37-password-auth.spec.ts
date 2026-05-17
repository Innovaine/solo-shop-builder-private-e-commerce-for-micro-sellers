import { test, expect } from '@playwright/test';

test.describe('FR-21: Password Authentication', () => {
  test('login page has password input and works', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login');
    
    // Should have password input field
    const passwordInput = page.locator('input[type="password"][name="password"]');
    await expect(passwordInput).toBeVisible();
    
    // Should have email input
    const emailInput = page.locator('input[type="email"][name="email"]');
    await expect(emailInput).toBeVisible();
    
    // Should have submit button
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/day-37/fr21-login-page.png', fullPage: true });
  });

  test('login with password succeeds', async ({ page }) => {
    // First create a test account via API
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'TestPass123!';
    
    // Sign up first
    const signupRes = await page.request.post('http://localhost:3000/api/auth/signup', {
      data: { email: testEmail, password: testPassword }
    });
    
    if (!signupRes.ok()) {
      console.log('Signup response:', await signupRes.text());
    }
    
    // Now login via UI
    await page.goto('http://localhost:3000/auth/login');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    
    await page.screenshot({ path: 'test-results/day-37/fr21-login-filled.png', fullPage: true });
    
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard or verification page
    await page.waitForURL(/\/(dashboard|auth\/verify)/, { timeout: 10000 });
    
    const finalUrl = page.url();
    expect(finalUrl).toMatch(/\/(dashboard|auth\/verify)/);
    
    await page.screenshot({ path: 'test-results/day-37/fr21-login-success.png', fullPage: true });
  });

  test('settings page has password change option', async ({ page }) => {
    // Create and login first
    const testEmail = `settings-${Date.now()}@example.com`;
    const testPassword = 'TestPass123!';
    
    await page.request.post('http://localhost:3000/api/auth/signup', {
      data: { email: testEmail, password: testPassword }
    });
    
    await page.goto('http://localhost:3000/auth/login');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');
    
    // Navigate to settings
    await page.goto('http://localhost:3000/dashboard/settings');
    
    // Should have password change fields
    const currentPasswordInput = page.locator('input[name="currentPassword"], input[placeholder*="current" i]');
    const newPasswordInput = page.locator('input[name="newPassword"], input[placeholder*="new" i]');
    
    // At least one of these should exist
    const hasPasswordFields = (await currentPasswordInput.count()) > 0 || (await newPasswordInput.count()) > 0;
    expect(hasPasswordFields).toBe(true);
    
    await page.screenshot({ path: 'test-results/day-37/fr21-settings-page.png', fullPage: true });
  });
});
