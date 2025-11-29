import { test, expect } from "@playwright/test";

test("/login: 未ログインならフォームが表示される", async ({ page }) => {
  await page.goto("http://localhost:3000/login");

  // メール入力欄
  await expect(page.getByPlaceholder("メール")).toBeVisible();

  // パスワード入力欄
  await expect(page.getByPlaceholder("パスワード")).toBeVisible();

  // ログインボタン
  await expect(page.getByRole("button", { name: "ログイン" })).toBeVisible();
});
