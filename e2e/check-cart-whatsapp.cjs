const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const url = 'http://127.0.0.1:8000/loja';
  try {
    // Open page with test helper enabled
    await page.goto(url + '?e2e=1', { waitUntil: 'networkidle' });

    // Use helper to add a product to the cart if no products available
    const addButtons = page.locator('button', { hasText: 'Adicionar' });
    if ((await addButtons.count()) === 0) {
      await page.evaluate(() => window.addTestProduct && window.addTestProduct());
    } else {
      await addButtons.first().click();
    }

    // Open cart
    const headerButtons = page.locator('header .flex.items-center.space-x-4 button');
    await headerButtons.nth(1).click();

    // Wait for cart dropdown
    const cartHeading = page.locator('text=Meu Carrinho');
    await cartHeading.waitFor({ state: 'visible', timeout: 3000 });

      // Debug: dump cart dropdown innerHTML to help identify selectors
      const cartHtml = await page.evaluate(() => {
        const header = Array.from(document.querySelectorAll('h2')).find(h => h.textContent && h.textContent.trim() === 'Meu Carrinho');
        const container = header ? header.closest('div') : Array.from(document.querySelectorAll('div')).find(d => d.textContent && d.textContent.includes('Meu Carrinho'));
        return container ? container.innerHTML : null;
      });
      console.log('CART HTML SNIPPET:', cartHtml ? cartHtml.slice(0, 800) : 'none');
      // List all radio inputs in the cart dropdown for debugging
      const radioList = await page.evaluate(() => {
        const el = Array.from(document.querySelectorAll('div')).find(d => d.textContent && d.textContent.includes('Meu Carrinho'));
        if (!el) return null;
        return Array.from(el.querySelectorAll('input[type="radio"]')).map(i => ({ value: i.value, outer: i.outerHTML }));
      });
      console.log('RADIOS IN CART:', radioList);
    // Choose Retirada = Entrega
    const cartContainer = page.locator('div', { hasText: 'Meu Carrinho' });
    const entregaRadio = cartContainer.locator('input[type="radio"][value="entrega"]');
    console.log('Entrega count (in container):', await entregaRadio.count());
    await entregaRadio.waitFor({ state: 'attached', timeout: 3000 });
    await entregaRadio.click();

    // Choose Pagamento = Cartão (query inside cart container)
    let cartaoRadio = cartContainer.locator('input[type="radio"][value="cartao"]');
    console.log('Cartao count (in container):', await cartaoRadio.count());
    if ((await cartaoRadio.count()) > 0) {
      await cartaoRadio.waitFor({ state: 'attached', timeout: 3000 });
      await cartaoRadio.click();
    } else {
      // Fallback: click via DOM
      await page.evaluate(() => {
        const container = Array.from(document.querySelectorAll('div')).find(d => d.textContent && d.textContent.includes('Meu Carrinho'));
        const el = container && container.querySelector('input[type="radio"][value="cartao"]');
        if (el) el.click();
      });
    }

    // Click Finalizar Pedido and capture opened URL by overriding window.open (fallback to avoid popup issues)
    await page.evaluate(() => {
      window._openedUrl = null;
      const originalOpen = window.open;
      window.open = (url, name, specs) => {
        window._openedUrl = url;
        return originalOpen.call(window, url, name, specs);
      };
    });

    // Debug: list buttons inside cart container and all buttons on page
    const cartButtons = await page.evaluate(() => {
      const container = Array.from(document.querySelectorAll('div')).find(d => d.textContent && d.textContent.includes('Meu Carrinho'));
      if (!container) return [];
      return Array.from(container.querySelectorAll('button')).map(b => ({ text: b.innerText.trim(), outer: b.outerHTML }));
    });
    console.log('CART BUTTONS:', cartButtons);

    const allButtons = await page.evaluate(() => Array.from(document.querySelectorAll('button')).map(b => ({ text: b.innerText.trim(), outer: b.outerHTML })));
    console.log('ALL BUTTONS ON PAGE:', allButtons.slice(0, 20));

    // Check if 'Finalizar Pedido' exists anywhere in the page
    const finalizeExists = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.trim().includes('Finalizar Pedido'));
      return btn ? btn.outerHTML : null;
    });
    console.log('FINALIZAR BUTTON OUTER:', finalizeExists);
    const totalBlock = await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('div')).find(d => d.textContent && d.textContent.includes('Total:'));
      return el ? el.outerHTML : null;
    });
    console.log('TOTAL BLOCK OUTER:', totalBlock ? totalBlock.slice(0, 500) : 'none');

    // Try clicking the Finalizar button (search by text)
    const finalizeBtn = page.locator('button', { hasText: 'Finalizar Pedido' });
    await finalizeBtn.click();

    // Wait for the captured URL
    const popupUrl = await page.waitForFunction(() => window._openedUrl || null, null, { timeout: 5000 })
      .then(() => page.evaluate(() => window._openedUrl));
    if (!popupUrl.includes('Entrega') && !decodeURIComponent(popupUrl).includes('Entrega')) {
      console.error('Popup URL does not contain "Entrega"');
      await browser.close();
      process.exit(1);
    }
    if (!popupUrl.includes('Cart%C3%A3o') && !decodeURIComponent(popupUrl).includes('Cartão')) {
      console.error('Popup URL does not contain "Cartão"');
      await browser.close();
      process.exit(1);
    }

    console.log('Success: Pickup and payment included in WhatsApp message URL');
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('Test error:', err);
    await browser.close();
    process.exit(1);
  }
})();