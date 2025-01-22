import { test } from '@playwright/test';

test('test', async ({ page }) => {
  // 定数としてURLを定義（再利用性の向上）
  const baseUrl = 'https://setagaya.keyakinet.net';
  const symbols = ['〇', '△'];

  // ページナビゲーションを関数化
  const navigateAndClick = async (role, name, exact = false) => {
    const locator = exact 
      ? page.getByText(name, { exact: true }) 
      : page.getByRole(role, { name });
    await locator.click();
  };

  // 初期画面の操作
  await page.goto(`${baseUrl}/Web/Home/WgR_ModeSelect`);
  await navigateAndClick('link', '使用目的から探す');
  await navigateAndClick('text', '屋外スポーツ', true); 
  await navigateAndClick('text', 'テニス', true);
  await navigateAndClick('button', '検索');
  await navigateAndClick('link', 'さらに読み込む');
  // チェックボックス選択
  const locations = ['羽根木公園', '砧中学校', '用賀中学校', '桜丘中学校', '砧南中学校', '烏山中学校'];
  for (const location of locations) {
    const locator = page.getByRole('cell', { name: location }).locator('label');
    if (await locator.isVisible()) {
      await locator.click();
    }
  }
  await navigateAndClick('link', '次へ進む');

  // 条件フィルタリング
  await page.goto(`${baseUrl}/Web/Yoyaku/WgR_ShisetsubetsuAkiJoukyou`);
  await navigateAndClick('button', 'その他の条件で絞り込む');
  const conditions = ['土', /^日$/, '祝', 'ヶ月'];
  for (const condition of conditions) {
    await page.locator('label').filter({ hasText: condition }).click();
  }
  await navigateAndClick('button', '表示');

  // 記号チェック
  const bodyTexts = await page.locator('tbody').allInnerTexts();
  const combinedText = bodyTexts.join('\n');
  for (const symbol of symbols) {
    if (combinedText.includes(symbol)) {
      throw new Error(`The text contains symbol: ${symbol}`);
    }    
  }

  // １ヶ月後の予約を確認
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  await page.getByPlaceholder('/2/13').click();
  await page.getByTitle('').click();
  await page.getByRole('link', { name: day, exact: true }).click();
  await navigateAndClick('button', '表示');

  // 記号チェック
  const bodyTexts2 = await page.locator('tbody').allInnerTexts();
  const combinedText2 = bodyTexts2.join('\n');
  for (const symbol of symbols) {
    if (combinedText2.includes(symbol)) {
      throw new Error(`The text contains symbol: ${symbol}`);
    }    
  }
  console.log(combinedText2)

  console.log("空きコートなし");
});