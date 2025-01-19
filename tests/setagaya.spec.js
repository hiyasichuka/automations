import { test } from '@playwright/test';

test('検索', async ({ context, page }) => {

    const newTabPromise = context.waitForEvent("page");

    await page.goto('https://jhomes.to-kousya.or.jp/search/jkknet/service/akiyaJyoukenStartInit');
    // 「こちら」のリンクが描画されるまで待機
    await page.waitForSelector('a[onclick*="submitNext"]');

    await page.click('a[onclick*="submitNext"]')
    
    const newTab = await newTabPromise;
    await newTab.waitForLoadState("domcontentloaded");

    // チェックボックス
    await newTab.check('input[type="checkbox"][name="akiyaInitRM.akiyaRefM.checks"][value="12"]');
    await newTab.waitForSelector('a[onclick*="submitPage"]');
    await newTab.waitForSelector('a[onclick*="submitPage(\'akiyaJyoukenRef\')"]', { state: 'visible' });
    await newTab.click('a[onclick*="submitPage(\'akiyaJyoukenRef\')"]');
    await newTab.waitForSelector('li.error', { state: 'visible',  timeout: 5000  });
    const errorExists = await newTab.locator('li.error').count() > 0;

    if (errorExists) {
    console.log('li.error が表示されています。');
    } else {
    console.log('li.error は表示されていません。');
    }

    // スクリーンショットを取得
    await newTab.screenshot({ path: 'screenshot.png', fullPage: true });

    console.log('スクリーンショットを取得しました: screenshot.png');

});