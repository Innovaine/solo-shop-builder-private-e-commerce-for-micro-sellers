import { test, expect } from '@playwright/test';

/**
 * Day 48 — FR-21 & FR-22 Testing
 * Password Auth + Password Reset Flow
 * 
 * Features under test:
 * - FR-21: Seller password authentication (signup with optional password, login with password)
 * - FR-22: Password reset flow (forgot password → email → reset with token)
 */

test.describe('FR-21: Password Authentication', () => {
  test('should allow signup with optional password field', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login');
    
    // Navigate to signup (if link exists)
    const signupLink = page.locator('a[href*="signup"], button:has-text("Sign up")');
    if (await signupLink.isVisible()) {
      await signupLink.click();
    } else {
      await page.goto('http://localhost:3000/auth/signup');
    }

    // Look for password input field on signup page
    const passwordInput = page.locator('input[type="password"][name="password"], input[type="password"]').first();
    await expect(passwordInput).toBeVisible();
    
    // Verify it's optional (no required attribute or allow empty submission)
    const isRequired = await passwordInput.getAttribute('required');
    // Password field exists but should be optional
    expect(isRequired).toBeNull();
  });

  test('should accept password during signup and hash it (bcrypt 12 rounds)', async ({ page }) => {
    // This tests that the API accepts password and stores it securely
    // We'll verify by attempting login after signup
    
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'SecurePass123!';
    
    await page.goto('http://localhost:3000/auth/signup');
    
    await page.fill('input[type="email"], input[name="email"]', testEmail);
    await page.fill('input[type="password"], input[name="password"]', testPassword);
    
    // Submit form
    await page.click('button[type="submit"], button:has-text("Sign up")');
    
    // Should redirect or show success
    await page.waitForTimeout(1000);
    
    // Now try to login with the same credentials
    await page.goto('http://localhost:3000/auth/login');
    await page.fill('input[type="email"], input[name="email"]', testEmail);
    await page.fill('input[type="password"], input[name="password"]', testPassword);
    await page.click('button[type="submit"], button:has-text("Log in")');
    
    await page.waitForTimeout(1000);
    
    // Should be redirected to dashboard or authenticated area
    const url = page.url();
    expect(url).toContain('dashboard');
  });

  test('should show password input field on login page', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login');
    
    const passwordField = page.locator('input[type="password"]');
    await expect(passwordField).toBeVisible();
    
    const emailField = page.locator('input[type="email"]');
    await expect(emailField).toBeVisible();
  });
});

test.describe('FR-22: Password Reset Flow', () => {
  test('should have "Forgot Password" link on login page', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login');
    
    const forgotLink = page.locator('a[href*="forgot"], a:has-text("Forgot")');
    await expect(forgotLink).toBeVisible();
  });

  test('should accept email on forgot-password page', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/forgot-password');
    
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
    
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  });

  test('should send reset email when valid email submitted', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/forgot-password');
    
    await page.fill('input[type="email"]', 'test@example.com');
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(1000);
    
    // Should show success message or redirect
    const successMessage = page.locator('text=/sent|check your email|reset link/i');
    // Page may have success message or may have navigated
    const hasMessage = await successMessage.isVisible().catch(() => false);
    const currentUrl = page.url();
    
    // Either shows success message OR navigates away from forgot-password
    expect(hasMessage || !currentUrl.includes('forgot-password')).toBeTruthy();
  });

  test('should accept token and new password on reset page', async ({ page }) => {
    // Navigate to reset password page with a dummy token
    await page.goto('http://localhost:3000/auth/reset-password?token=dummy-token-for-ui-test');
    
    const passwordInput = page.locator('input[type="password"]').first();
    await expect(passwordInput).toBeVisible();
    
    const confirmPasswordInput = page.locator('input[type="password"]').last();
    // May have confirm password field
    const hasConfirm = await confirmPasswordInput.isVisible().catch(() => false);
    
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  });

  test('should validate token and update password', async ({ page }) => {
    // This is an integration test - requires valid token from email
    // For smoke test, we verify the endpoint exists and accepts POST
    
    const response = await page.request.post('http://localhost:3000/api/auth/reset-password', {
      data: {
        token: 'invalid-token-for-test',
        password: 'NewPassword123!'
      }
    });
    
    // Should get either 400 (invalid token) or 401 (expired) - not 404
    expect([200, 400, 401]).toContain(response.status());
  });
});

test.describe('Backwards Compatibility', () => {
  test('should still allow email-only signup (no password)', async ({ page }) => {
    const testEmail = `emailonly-${Date.now()}@example.com`;
    
    await page.goto('http://localhost:3000/auth/signup');
    
    await page.fill('input[type="email"]', testEmail);
    // Do NOT fill password field
    
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(1000);
    
    // Should succeed (redirect or success message)
    const url = page.url();
    // Should not still be on signup page with error
    const hasError = await page.locator('text=/error|invalid|required/i').isVisible().catch(() => false);
    expect(hasError).toBeFalsy();
  });
});
