import { test } from '@playwright/test';

const baseUrl = 'https://setagaya.keyakinet.net';
const symbols = ['〇', '△'];
const locations = ['羽根木公園', '砧中学校', '用賀中学校', '桜丘中学校', '砧南中学校', '烏山中学校'];
const conditions = ['土', /^日$/, '祝', 'ヶ月'];

test('test', async ({ page }) => {
  const navigateAndClick = async (role, name, exact = false) => {
    const locator = exact 
      ? page.getByText(name, { exact: true }) 
      : page.getByRole(role, { name });
    await locator.click();
  };

  const checkSymbols = async () => {
    await page.waitForSelector('tbody'); // tbodyが表示されるまで待機
    const bodyTexts = await page.locator('tbody').allInnerTexts();
    const combinedText = bodyTexts.join('\n');
    for (const symbol of symbols) {
      if (combinedText.includes(symbol)) {
        throw new Error(`The text contains symbol: ${symbol}`);
      }
    }
    return combinedText;
  };

  const selectConditions = async (conditions) => {
    for (const condition of conditions) {
      await page.locator('label').filter({ hasText: condition }).click();
    }
  };

  await page.goto(`${baseUrl}/Web/Home/WgR_ModeSelect`);
  await navigateAndClick('link', '使用目的から探す');
  await navigateAndClick('text', '屋外スポーツ', true); 
  await navigateAndClick('text', 'テニス', true);
  await navigateAndClick('button', '検索');
  await navigateAndClick('link', 'さらに読み込む');

  for (const location of locations) {
    const locator = page.getByRole('cell', { name: location }).locator('label');
    if (await locator.isVisible()) {
      await locator.click();
    }
  }
  await navigateAndClick('link', '次へ進む');

  await page.goto(`${baseUrl}/Web/Yoyaku/WgR_ShisetsubetsuAkiJoukyou`);
  await navigateAndClick('button', 'その他の条件で絞り込む');
  await selectConditions(conditions);
  await navigateAndClick('button', '表示');

  await checkSymbols();

  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  await page.getByPlaceholder('/2/13').click();
  await page.getByTitle('').click();
  await page.getByRole('link', { name: day, exact: true }).click();
  await navigateAndClick('button', '表示');

  await checkSymbols();

  console.log("空きコートなし");
}, { timeout: 60000 }); // タイムアウトを60秒に設定