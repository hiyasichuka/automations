import { test } from '@playwright/test';

test('検索', async ({ context, page }) => {
  const newTabPromise = context.waitForEvent("page");
  await page.goto('https://jhomes.to-kousya.or.jp/search/jkknet/service/akiyaJyoukenStartInit');
  await page.click('a[onclick*="submitNext"]');
  const newTab = await newTabPromise;
  await newTab.waitForLoadState("domcontentloaded");
  await newTab.check('input[type="checkbox"][name="akiyaInitRM.akiyaRefM.checks"][value="12"]');
  await newTab.click('a[onclick*="submitPage(\'akiyaJyoukenRef\')"]');
  const errorExists = await newTab.locator('li.error').isVisible({ timeout: 5000 });
  console.log(errorExists ? 'li.error が表示されています。' : 'li.error は表示されていません。');
  await newTab.screenshot({ path: 'screenshot.png', fullPage: true });
  console.log('スクリーンショットを取得しました: screenshot.png');
});