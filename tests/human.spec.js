// tests/human.spec.js（CommonJS版）
const { test, expect } = require('@playwright/test');
const dotenv = require('dotenv');

dotenv.config();

const BASE = process.env.KEYAKI_BASE_URL ?? 'https://setagaya.keyakinet.net';

const LOCATIONS = ['羽根木公園', '用賀中学校', '玉川野毛町公園', '総合運動場', '大蔵第二運動場'];
const CONDITIONS = ['土', /^日$/, '祝', 'ヶ月'];

async function loginIfNeeded(page) {
    const passwordInput = page.locator('input[type="password"]');
    if (!(await passwordInput.first().isVisible().catch(() => false))) return;

    const user = process.env.KEYAKI_USERNAME ?? '';
    const pass = process.env.KEYAKI_PASSWORD ?? '';
    if (!user || !pass) throw new Error('環境変数を設定してください。');

    await page.locator('#userID').fill(user);
    await page.locator('#passWord').fill(pass);
    await page.getByRole('link', { name: 'ログイン' }).click();

}

async function clickByText(page, role, name, exact = false) {
    if (role === 'text') return page.getByText(name, { exact }).click();
    const loc = page.getByRole(role, { name, exact });
    if (await loc.first().isVisible().catch(() => false)) return loc.first().click();
    return page.locator(`:text("${name}")`).first().click();
}


async function selectConditions(page, conditions) {
    for (const c of conditions) {
        const label = typeof c === 'string'
            ? page.locator('label', { hasText: c })
            : page.locator('label').filter({ hasText: c });
        await expect(label.first()).toBeVisible();
        await label.first().click();
    }
}

test('世田谷施設検索', async ({ page }) => {
    test.slow();

    await page.goto(`${BASE}/Web/Home/WgR_ModeSelect`, { waitUntil: 'domcontentloaded' });
    await clickByText(page, 'button', 'ログイン');

    await loginIfNeeded(page).catch(() => { });

    await clickByText(page, 'link', '使用目的から探す');
    await clickByText(page, 'text', '屋外スポーツ', true);
    await clickByText(page, 'text', 'テニス', true);
    await clickByText(page, 'button', '検索');
    await page.getByRole('link', { name: 'さらに読み込む' }).first().click().catch(() => { });

    for (const loc of LOCATIONS) {
        await page.getByRole('cell', { name: loc }).locator('label').first().click();
    }
    await clickByText(page, 'link', '次へ進む');

    await clickByText(page, 'button', 'その他の条件で絞り込む');
    await selectConditions(page, CONDITIONS);
    await clickByText(page, 'button', '表示');

    await page.pause(); // 手動操作タイム

});
