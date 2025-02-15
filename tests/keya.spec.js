import { test } from "@playwright/test";

const baseUrl = "https://setagaya.keyakinet.net";
const screenshotPath = "./screenshots/keya.png";
const symbols = ["〇", "△"];
const locations = [
  "羽根木公園",
  "用賀中学校",
  "桜丘中学校",
];
const conditions = ["土", /^日$/, "祝", "ヶ月"];

test("test", async ({ page }) => {
  test.slow();
  const navigateAndClick = async (role, name, exact = false) => {
    const locator = exact
      ? page.getByText(name, { exact: true })
      : page.getByRole(role, { name });
    await locator.click();
  };

  const checkSymbols = async (tag) => {
    console.log(`Checking ${tag}`);
    await page.waitForSelector("tbody"); // tbodyが表示されるまで待機
    const bodyTexts = await page.locator("tbody").allInnerTexts();
    const combinedText = bodyTexts.join("\n");
    for (const symbol of symbols) {
      if (combinedText.includes(symbol)) {
        await page.screenshot({ path: screenshotPath, fullPage: true })
        throw new Error(`Tag: ${tag} ,The text contains symbol: ${symbol}`);
      }
    }
    return combinedText;
  };

  const selectConditions = async (conditions) => {
    for (const condition of conditions) {
      await page.locator("label").filter({ hasText: condition }).click();
    }
  };

  await page.goto(`${baseUrl}/Web/Home/WgR_ModeSelect`);
  await navigateAndClick("link", "使用目的から探す");
  await navigateAndClick("text", "屋外スポーツ", true);
  await navigateAndClick("text", "テニス", true);
  await navigateAndClick("button", "検索");
  await navigateAndClick("link", "さらに読み込む");

  let firstFlag = true;
  for (const location of locations) {
    await page.getByRole("cell", { name: location }).locator("label").click();
    await navigateAndClick("link", "次へ進む");

    if(firstFlag){
      await navigateAndClick("button", "その他の条件で絞り込む");
      await selectConditions(conditions);  
      firstFlag = false
    }
    await navigateAndClick("button", "表示");
    await checkSymbols("直近1ヶ月: " + location);

    await navigateAndClick("link", "前に戻る");
    await page.getByRole("cell", { name: location }).locator("label").click();

  }

  // const date = new Date();
  // const day = date.getDate();
  // await page.getByPlaceholder('/2/13').click();
  // await page.getByTitle('').click();
  // await page.getByRole('link', { name: day, exact: true }).click();
  // await navigateAndClick('button', '表示');
  // await checkSymbols("1ヶ月後");
  // console.log("空きコートなし");
});
