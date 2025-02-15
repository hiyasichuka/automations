import { test } from "@playwright/test";

const screenshotPath = "./screenshots/jkk.png";

test("検索", async ({ context, page }) => {
  const newTabPromise = context.waitForEvent("page");
  await page.goto(
    "https://jhomes.to-kousya.or.jp/search/jkknet/service/akiyaJyoukenStartInit"
  );
  await page.click('a[onclick*="submitNext"]');
  const newTab = await newTabPromise;
  await newTab.waitForLoadState("domcontentloaded");

  // ward
  await newTab.check(
    'input[type="checkbox"][name="akiyaInitRM.akiyaRefM.checks"][value="12"]'
  );
  // house layout
  await newTab.check(
    'input[type="checkbox"][name="akiyaInitRM.akiyaRefM.madoris"][value="2"]'
  );
  await newTab.check(
    'input[type="checkbox"][name="akiyaInitRM.akiyaRefM.madoris"][value="3"]'
  );

  await newTab.click("a[onclick*=\"submitPage('akiyaJyoukenRef')\"]");
  await newTab.waitForSelector("li.error", { state: "visible", timeout: 3000 });
  const errorExists = await newTab.locator("li.error").isVisible();
  console.log(errorExists ? "見つからず" : "見つかった");
  if (!errorExists) {
    await page.screenshot({ path: screenshotPath, fullPage: true });
    throw new Error("見つかりました");
  }
});
