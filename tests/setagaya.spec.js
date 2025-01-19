import { test } from '@playwright/test';

test('検索', async ({ page }) => {

  await page.goto('https://jhomes.to-kousya.or.jp/search/jkknet/service/akiyaJyoukenStartInit');
  await page.check('input[type="checkbox"][value="世田谷区"]');
  await page.click('input[type="button"][value="検索する"]');

  const noResultsMessage = page.locator('.error');
  if (await noResultsMessage.count() > 0) {
    console.log('見つかりませんでした');
  } else {
    throw new Error('見つかりました');
  }
});