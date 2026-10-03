const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Set viewport
  await page.setViewportSize({ width: 1280, height: 800 });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Take screenshot of Auth/Login Page
  await page.screenshot({ path: '/home/jules/verification/screenshots/login_page.png' });
  console.log('Login page screenshot captured.');

  // Click HMO Admin credential preset
  await page.click('text=admin@miterahealth.com.ng');
  await page.click('text=Sign In to Portal');
  await page.waitForTimeout(1000);

  // Take screenshot of Admin Portal
  await page.screenshot({ path: '/home/jules/verification/screenshots/admin_portal.png' });
  console.log('Admin portal screenshot captured.');

  // Click Sign Out
  await page.click('text=Sign Out');
  await page.waitForTimeout(500);

  // Login as Individual Broker
  await page.click('text=individual@broker.ng');
  await page.click('text=Sign In to Portal');
  await page.waitForTimeout(1000);

  // Take screenshot of Individual Broker Post-Login Portal
  await page.screenshot({ path: '/home/jules/verification/screenshots/individual_broker_portal.png' });
  console.log('Individual broker portal screenshot captured.');

  await browser.close();
})();
