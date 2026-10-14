const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  // Fill in Admin credentials directly
  await page.fill('input[type="email"]', 'admin@miterahealth.com.ng');
  await page.fill('input[type="password"]', 'mitera@12345%');
  await page.click('button[type="submit"]');

  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshot_admin_updated.png' });

  // Click Quote Generator tab
  await page.click('button:has-text("Quote Generator")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshot_quote_generator.png' });

  // Click Corporate Agreements tab
  await page.click('button:has-text("Corporate Agreements")');
  await page.waitForTimeout(500);
  await page.click('button:has-text("Configure Corporate Agreement")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshot_agreements_modal.png' });

  await browser.close();
  console.log('Updated screenshots generated successfully');
})();
