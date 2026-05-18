import { test, expect } from '@playwright/test';

test.describe('Day 58 Feature Testing: Email Template Editor + Seller Profile', () => {
  
  test('FR-37: Email Template Editor page loads and displays correctly', async ({ page }) => {
    // Navigate to email template editor
    await page.goto('https://www.soloshopbox.com/dashboard/email-template');
    
    // Check page loaded
    await expect(page).toHaveURL(/\/dashboard\/email-template/);
    
    // Check for key elements mentioned in FR-37
    await expect(page.locator('text=Email Template')).toBeVisible({ timeout: 10000 });
    
    // Check for template customization fields
    const bodyLocators = [
      page.locator('textarea[name="emailBody"]'),
      page.locator('textarea[placeholder*="email"]'),
      page.locator('textarea'),
    ];
    
    let foundTextarea = false;
    for (const locator of bodyLocators) {
      const count = await locator.count();
      if (count > 0) {
        foundTextarea = true;
        break;
      }
    }
    expect(foundTextarea).toBeTruthy();
    
    // Check for merge tags or preview functionality
    const hasMergeTags = await page.locator('text=/{{.*}}|Merge Tag/i').count() > 0;
    const hasPreview = await page.locator('button:has-text("Preview")').count() > 0;
    expect(hasMergeTags || hasPreview).toBeTruthy();
  });

  test('FR-25: Seller Profile page loads with social links and logo upload', async ({ page }) => {
    // Navigate to seller profile
    await page.goto('https://www.soloshopbox.com/dashboard/profile');
    
    // Check page loaded
    await expect(page).toHaveURL(/\/dashboard\/profile/);
    
    // Check for profile page heading
    await expect(page.locator('text=/Profile|Seller Profile/i')).toBeVisible({ timeout: 10000 });
    
    // Check for social link inputs (Twitter, Instagram, Facebook)
    const socialInputs = [
      page.locator('input[name*="twitter" i]'),
      page.locator('input[name*="instagram" i]'),
      page.locator('input[name*="facebook" i]'),
      page.locator('input[placeholder*="twitter" i]'),
      page.locator('input[placeholder*="instagram" i]'),
      page.locator('input[placeholder*="facebook" i]'),
    ];
    
    let foundSocialInput = false;
    for (const locator of socialInputs) {
      const count = await locator.count();
      if (count > 0) {
        foundSocialInput = true;
        break;
      }
    }
    expect(foundSocialInput).toBeTruthy();
    
    // Check for logo upload field or button
    const logoUploadLocators = [
      page.locator('input[type="file"]'),
      page.locator('button:has-text("Upload Logo")'),
      page.locator('text=/Logo|logo/'),
    ];
    
    let foundLogoUpload = false;
    for (const locator of logoUploadLocators) {
      const count = await locator.count();
      if (count > 0) {
        foundLogoUpload = true;
        break;
      }
    }
    expect(foundLogoUpload).toBeTruthy();
  });

  test('API Health Check: Verify endpoints are accessible', async ({ request }) => {
    // Test /api/shops/email-template endpoint exists
    const emailTemplateResponse = await request.put('https://www.soloshopbox.com/api/shops/email-template', {
      data: {},
      failOnStatusCode: false
    });
    // Should not be 404 (endpoint exists, even if unauthorized or bad request)
    expect(emailTemplateResponse.status()).not.toBe(404);
    
    // Test /api/shops/profile endpoint exists
    const profileResponse = await request.put('https://www.soloshopbox.com/api/shops/profile', {
      data: {},
      failOnStatusCode: false
    });
    // Should not be 404 (endpoint exists, even if unauthorized or bad request)
    expect(profileResponse.status()).not.toBe(404);
  });

  test('Smoke Test: Dashboard navigation works', async ({ page }) => {
    // Test that dashboard is accessible
    await page.goto('https://www.soloshopbox.com/dashboard');
    
    // Check for navigation links to email template and profile
    const emailTemplateLink = page.locator('a[href*="email-template"]');
    const profileLink = page.locator('a[href*="profile"]');
    
    // At least one of these navigation elements should exist
    const hasEmailTemplateNav = await emailTemplateLink.count() > 0;
    const hasProfileNav = await profileLink.count() > 0;
    
    expect(hasEmailTemplateNav || hasProfileNav).toBeTruthy();
  });
});
