import { test } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test('test', async ({ page }) => {
    await page.goto(process.env.TEST_URL, { waitUntil: 'domcontentloaded' });
    await page.locator('#apply_sign_no').fill(process.env.APPLY_SIGN_NO);
    await page.locator('#apply_insured_no').fill(process.env.APPLY_INSURED_NO);
    await page.locator('#apply_office_name').fill(process.env.APPLY_OFFICE_NAME);
    await page.locator('#apply_kana_name').fill(process.env.APPLY_KANA_NAME);
    await page.locator('#apply_year').selectOption(process.env.APPLY_YEAR);
    await page.locator('#apply_month').selectOption(process.env.APPLY_MONTH);
    await page.locator('#apply_day').selectOption(process.env.APPLY_DAY);
    await page.locator('#apply_contact_phone').fill(process.env.APPLY_CONTACT_PHONE);
    await page.locator('#apply_postal').fill(process.env.APPLY_POSTAL);
    await page.locator('#apply_address').fill(process.env.APPLY_ADDRESS);
    await page.locator('#apply_stay_persons').fill(process.env.APPLY_STAY_PERSONS);
    await page.pause();
});