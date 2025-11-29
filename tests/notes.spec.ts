import { test, expect } from '@playwright/test';

test('Notes page loads', async ({ page }) => {
  await page.goto('http://localhost:3000/notes');
  await expect(page.getByRole('heading', { name: 'Notes' })).toBeVisible();
});

test('user can login and see notes dashboard', async ({ page }) => {
  await page.goto('http://localhost:3000/login');

  await page.fill('input[type="email"]', 'huuriekaiseki@gmail.com');
  await page.fill('input[type="password"]', '8823km'); // 文字列で！

  await page.getByRole('button', { name: 'ログイン' }).click();

  await expect(page.getByRole('heading', { name: 'Notes' })).toBeVisible();
});
