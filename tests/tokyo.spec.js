import { test } from '@playwright/test'

test('test', async ({ page }) => {
  test.slow();

  const facilities = [
    // { name: '日比谷', value: '1000' },
    { name: '芝', value: '1010' },
    { name: '高井戸', value: '1175' },
    // { name: '善福寺', value: '1180' },
    { name: '祖師谷', value: '1070' },
  ];

  await page.goto('https://kouen.sports.metro.tokyo.lg.jp/web/index.jsp');

  for (const facility of facilities) {
    console.log(`施設 ${facility.name} を検索します`);

    await selectFacility(page, facility.value);

    const found = await searchCourt(page);

    if (found) {
      console.log(`施設 ${facility.name} で空きが見つかりました`);
      throw new Error(`施設 ${facility.name} で空きが見つかりました`);
    }

    console.log(`施設 ${facility.name} に空きはありませんでした`);
    await page.goto('https://kouen.sports.metro.tokyo.lg.jp/web/index.jsp');
  }

  console.log('すべての施設を検索しましたが、空きは見つかりませんでした。');
});

// 施設を選択して検索する共通処理
async function selectFacility(page, facilityValue) {
  await page.locator('#contents').click();
  await page.locator('#purpose-home').selectOption('1000_1030'); // 人工芝
  await page.locator('#bname-home').selectOption(facilityValue);
  await page.getByRole('button', { name: ' 検索' }).click();
}

// 空きコートを探す共通処理
async function searchCourt(page) {
  const maxTries = 2;
  let tries = 0;

  while (tries < maxTries) {
    const locator = page.getByRole('img', { name: '空き' });

    try {
      await locator.waitFor({ timeout: 5000 });
      await locator.click();
      return true;
    } catch (e) {
      console.log('空きコートは存在しません。次の週へ進みます');
      await page.locator('#next-week').click();
      tries++;
    }
  }
  return false;
}
