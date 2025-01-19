import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://setagaya.keyakinet.net/Web/Home/WgR_ModeSelect');
  await page.getByRole('link', { name: ' 施設種類から探す' }).click();
  await page.getByText('庭球場・陸上競技場・プール').click();
  await page.getByText('庭球場', { exact: true }).click();
  await page.getByRole('button', { name: ' 検索' }).click();
  await page.getByRole('cell', { name: '羽根木公園' }).locator('label').click();
  await page.getByRole('link', { name: 'さらに読み込む' }).click();
  await page.getByRole('cell', { name: '砧中学校' }).locator('label').click();
  await page.getByText('用賀中学校', { exact: true }).click();
  await page.getByText('桜丘中学校', { exact: true }).click();
  await page.getByRole('link', { name: '次へ進む' }).click();
  await page.goto('https://setagaya.keyakinet.net/Web/Yoyaku/WgR_ShisetsubetsuAkiJoukyou');
  await page.getByRole('button', { name: ' その他の条件で絞り込む' }).click();
  await page.locator('label').filter({ hasText: '土' }).click();
  await page.locator('label').filter({ hasText: /^日$/ }).click();
  await page.getByText('祝', { exact: true }).click();
  await page.getByText('ヶ月').click();
  await page.getByRole('button', { name: ' 表示' }).click();
  await page.goto('https://setagaya.keyakinet.net/Web/Yoyaku/WgR_ShisetsubetsuAkiJoukyou');
  const symbols = ['〇', '△'];
  const bodyTexts = await page.locator('tbody').allInnerTexts();
  const combinedText = bodyTexts.join('\n');
  for (const symbol of symbols) {
    if (combinedText.includes(symbol)) {
        throw new Error(`The text contains symbol: ${symbol}`);
    }
  }
});