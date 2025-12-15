const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const url = 'http://127.0.0.1:8000/loja';
  try {
    await page.goto(url, { waitUntil: 'networkidle' });

    // Click the first button in the header icon group (user icon)
    const headerButtons = page.locator('header .flex.items-center.space-x-4 button');
    await headerButtons.first().click();

    // Wait for the dropdown text to appear
    const adminText = page.locator('text=Acesso Admin');
    await adminText.waitFor({ state: 'visible', timeout: 3000 });

    // Click the email input inside the dropdown
    const emailInput = page.locator('input[type="email"]');
    await emailInput.click();

    // Verify the dropdown is still visible
    const visible = await adminText.isVisible();
    if (!visible) {
      console.error('Dropdown closed after clicking email input');
      await browser.close();
      process.exit(1);
    }

    console.log('Success: Dropdown remained open after clicking email input');
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('Test error:', err);
    await browser.close();
    process.exit(1);
  }
})();