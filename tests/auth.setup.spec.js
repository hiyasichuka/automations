const { test, expect } = require('@playwright/test');
require('dotenv').config();
const BASE = process.env.KEYAKI_BASE_URL ?? 'https://setagaya.keyakinet.net';

async function clickByText(page, role, name, exact = false) {
    if (role === 'text') return page.getByText(name, { exact }).click();
    const loc = page.getByRole(role, { name, exact });
    if (await loc.first().isVisible().catch(() => false)) return loc.first().click();
    return page.locator(`:text("${name}")`).first().click();
}


test('auth setup: login once and save storage', async ({ page }) => {
    await page.goto(`${BASE}`, { waitUntil: 'domcontentloaded' });
    await clickByText(page, 'button', 'ログイン');

    await expect(page.locator('#userID')).toBeVisible({ timeout: 10000 });
    await page.locator('#userID').fill(process.env.KEYAKI_USERNAME);
    await page.locator('#passWord').fill(process.env.KEYAKI_PASSWORD);
    await page.getByRole('link', { name: 'ログイン' }).click();

    // セッション保存（以降のテストで使う）
    await page.context().storageState({ path: 'auth.json' });
});