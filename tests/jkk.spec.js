import { test } from "@playwright/test";
import { notifyLineBroadcast } from "./notify";
test.use({ headless: true });


test("検索", async ({ context, page }) => {
  const newTabPromise = context.waitForEvent("page");
  await page.goto(
    "https://jhomes.to-kousya.or.jp/search/jkknet/service/akiyaJyoukenStartInit"
  );
  await page.click('a[onclick*="submitNext"]');
  const newTab = await newTabPromise;
  await newTab.waitForLoadState("domcontentloaded");

  // ward
  // await newTab.check('input[type="checkbox"][name="akiyaInitRM.akiyaRefM.allCheck"]');
  // await newTab.check('input[type="checkbox"][name="akiyaInitRM.akiyaRefM.checks"][value="04"]'); // 新宿区
  // await newTab.check('input[type="checkbox"][name="akiyaInitRM.akiyaRefM.checks"][value="05"]'); // 文京区 
  // await newTab.check('input[type="checkbox"][name="akiyaInitRM.akiyaRefM.checks"][value="09"]'); // 品川区
  // await newTab.check('input[type="checkbox"][name="akiyaInitRM.akiyaRefM.checks"][value="10"]'); // 目黒区
  // await newTab.check('input[type="checkbox"][name="akiyaInitRM.akiyaRefM.checks"][value="11"]'); // 大田区
  await newTab.check('input[type="checkbox"][name="akiyaInitRM.akiyaRefM.checks"][value="12"]'); // 世田谷区
  // await newTab.check('input[type="checkbox"][name="akiyaInitRM.akiyaRefM.checks"][value="13"]'); // 渋谷区
  // await newTab.check('input[type="checkbox"][name="akiyaInitRM.akiyaRefM.checks"][value="14"]'); // 中野区
  // await newTab.check('input[type="checkbox"][name="akiyaInitRM.akiyaRefM.checks"][value="15"]'); // 杉並区
  // house layout
  await newTab.check(
    'input[type="checkbox"][name="akiyaInitRM.akiyaRefM.madoris"][value="2"]'
  );
  await newTab.check(
    'input[type="checkbox"][name="akiyaInitRM.akiyaRefM.madoris"][value="3"]'
  );

  // price
  await newTab.locator('select[name="akiyaInitRM\\.akiyaRefM\\.yachinFrom"]').selectOption('160000');

  await newTab.click("a[onclick*=\"submitPage('akiyaJyoukenRef')\"]");
  await newTab.waitForSelector("li.error", { state: "visible", timeout: 3000 });
  const errorExists = await newTab.locator("li.error").isVisible();

  await notifyLineBroadcast(`test通知です。\n${url}`); // TODO: test削除

  if (!errorExists) {
    const url = "https://jhomes.to-kousya.or.jp/search/jkknet/service/akiyaJyoukenStartInit";
    await notifyLineBroadcast(`条件に合う結果を検知しました。\n${url}`);
  }
});
