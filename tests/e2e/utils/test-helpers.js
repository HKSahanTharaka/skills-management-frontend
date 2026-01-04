/**
 * Test helper utilities
 */

/**
 * Wait for element to be visible and return it
 * @param {import('@playwright/test').Page} page
 * @param {string} selector
 * @param {number} timeout
 */
export async function waitForElement(page, selector, timeout = 5000) {
  return await page.waitForSelector(selector, { state: 'visible', timeout });
}

/**
 * Fill form field by label
 * @param {import('@playwright/test').Page} page
 * @param {string} label
 * @param {string} value
 */
export async function fillByLabel(page, label, value) {
  const input = page.locator(`input:near(:text("${label}"))`).first();
  await input.fill(value);
}

/**
 * Click button by text
 * @param {import('@playwright/test').Page} page
 * @param {string} text
 */
export async function clickButton(page, text) {
  await page.click(`button:has-text("${text}")`);
}

/**
 * Wait for toast notification
 * @param {import('@playwright/test').Page} page
 * @param {string} message
 * @param {number} timeout
 */
export async function waitForToast(page, message, timeout = 5000) {
  return await page.waitForSelector(`text="${message}"`, { timeout });
}

/**
 * Wait for loading to finish
 * @param {import('@playwright/test').Page} page
 */
export async function waitForLoadingToFinish(page) {
  // Wait for any loading indicators to disappear
  await page.waitForSelector('[data-testid="loading"], .loading', { 
    state: 'hidden', 
    timeout: 10000 
  }).catch(() => {
    // Ignore if no loading indicator found
  });
}

/**
 * Generate random email
 */
export function generateRandomEmail() {
  const timestamp = Date.now();
  return `test-${timestamp}@example.com`;
}

/**
 * Generate random string
 * @param {number} length
 */
export function generateRandomString(length = 10) {
  return Math.random().toString(36).substring(2, length + 2);
}

/**
 * Take screenshot with name
 * @param {import('@playwright/test').Page} page
 * @param {string} name
 */
export async function takeScreenshot(page, name) {
  await page.screenshot({ 
    path: `test-results/screenshots/${name}-${Date.now()}.png`,
    fullPage: true 
  });
}

/**
 * Check if element is visible
 * @param {import('@playwright/test').Page} page
 * @param {string} selector
 */
export async function isVisible(page, selector) {
  try {
    await page.waitForSelector(selector, { state: 'visible', timeout: 2000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Wait for network to be idle
 * @param {import('@playwright/test').Page} page
 */
export async function waitForNetworkIdle(page) {
  await page.waitForLoadState('networkidle');
}

/**
 * Mock API response
 * @param {import('@playwright/test').Page} page
 * @param {string} url
 * @param {Object} response
 */
export async function mockApiResponse(page, url, response) {
  await page.route(url, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
}

/**
 * Clear all inputs in a form
 * @param {import('@playwright/test').Page} page
 * @param {string} formSelector
 */
export async function clearForm(page, formSelector = 'form') {
  const inputs = await page.locator(`${formSelector} input`).all();
  for (const input of inputs) {
    await input.clear();
  }
}

/**
 * Get table row count
 * @param {import('@playwright/test').Page} page
 * @param {string} tableSelector
 */
export async function getTableRowCount(page, tableSelector = 'table tbody tr') {
  return await page.locator(tableSelector).count();
}

/**
 * Wait for URL to contain path
 * @param {import('@playwright/test').Page} page
 * @param {string} path
 */
export async function waitForUrlToContain(page, path) {
  await page.waitForURL(`**/${path}**`);
}

