import { test, expect } from '@playwright/test';
import axios from 'axios';

// Slack Webhook URL
const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/your/slack/webhook/url';

// Slack通知を送信する関数
async function sendSlackNotification(message: string) {
  try {
    await axios.post(SLACK_WEBHOOK_URL, { text: message });
    console.log('Slack通知が送信されました');
  } catch (error) {
    console.error('Slack通知の送信に失敗しました', error);
  }
}

test('世田谷区検索結果を確認してSlack通知', async ({ page }) => {
  // サイトにアクセス
  await page.goto('https://jhomes.to-kousya.or.jp/search/jkknet/service/akiyaJyoukenStartInit');

  // 世田谷区をチェック
  await page.check('input[type="checkbox"][value="世田谷区"]');

  // 検索ボタンをクリック
  await page.click('input[type="button"][value="検索する"]');

  // 検索結果の存在を確認
  try {
    // 検索結果が存在する場合の処理
    const results = await page.locator('.search-result'); // 結果要素のセレクタを確認して変更する
    if (await results.count() > 0) {
      console.log('検索結果が見つかりました');
      await sendSlackNotification('検索結果が見つかりました！世田谷区で空き物件があります。');
    } else {
      console.log('検索結果が見つかりませんでした');
    }
  } catch (error) {
    console.error('エラーが発生しました', error);
  }
});