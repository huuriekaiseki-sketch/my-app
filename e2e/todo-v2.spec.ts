import { test, expect } from "@playwright/test";

test("Todo CRUD full flow", async ({ page }) => {
  await page.goto("http://localhost:3000/login");

  // ログイン
  await page.getByPlaceholder("メール").fill("huuriekaiseki@gmail.com");
  await page.getByPlaceholder("パスワード").fill("8823km");
  await page.getByRole("button", { name: "ログイン" }).click();

  await expect(page).toHaveURL(/\/todo-v2/);

  // --- ToDo追加（テストごとに一意なタイトルを付ける）---
  const newTask = `PlaywrightでCRUDテスト ${Date.now()}`;

  await page.getByPlaceholder(/やること/).fill(newTask);
  await page.getByRole("button", { name: "追加" }).click();

  // 追加したこの1行だけを特定
  const targetItem = page
    .getByRole("listitem")
    .filter({ hasText: newTask });

  await expect(targetItem).toBeVisible();

  // --- 完了トグル ---
  const checkbox = targetItem.getByRole("checkbox");
  await checkbox.click();

  // この行のテキストに line-through が付くことを確認
  await expect(targetItem.getByText(newTask)).toHaveClass(/line-through/);

  // --- 削除（confirm を自動OK）---
  page.on("dialog", async (dialog) => {
    await dialog.accept();
  });

  await targetItem.getByRole("button", { name: "削除" }).click();

  // 削除されたことを確認
  await expect(targetItem).not.toBeVisible();
});
