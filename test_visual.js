const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  // Take auth screenshot
  await page.screenshot({ path: 'screenshot_auth.png' });

  // Fill in Admin credentials directly
  await page.fill('input[type="email"]', 'admin@miterahealth.com.ng');
  await page.fill('input[type="password"]', 'mitera@12345%');
  await page.click('button[type="submit"]');

  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshot_admin_dashboard.png' });

  // Click Corporate Agreements tab
  await page.click('button:has-text("Corporate Agreements")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshot_corporate_agreements.png' });

  // Click Retail Codes tab
  await page.click('button:has-text("Retail Codes")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshot_retail_codes.png' });

  await browser.close();
  console.log('All screenshots generated successfully');
})();
