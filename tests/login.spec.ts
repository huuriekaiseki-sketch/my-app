import { test, expect } from '@playwright/test';

test('Login button becomes disabled when submitting', async ({ page }) => {
  await page.goto('http://localhost:3000/login');

  await page.getByPlaceholder('メール').fill('test@test.com');
  await page.getByPlaceholder('パスワード').fill('wrongpassword');

  const loginButton = page.getByRole('button', { name: 'ログイン' });

  // 押す前はボタン有効
  await expect(loginButton).toBeEnabled();

  // ボタン押す
  await loginButton.click();

  // 押した後は disable になる
  await expect(loginButton).toBeDisabled();
});
