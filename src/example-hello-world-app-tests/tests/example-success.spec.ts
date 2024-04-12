import { test, expect } from "@playwright/test";

const { APP_CONTAINER_URL_TO_GO_TO = "http://localhost:3000" } = process.env;

test("should has a title", async ({ page }) => {
  await page.goto(APP_CONTAINER_URL_TO_GO_TO);
  await expect(page.getByRole("heading")).toContainText(
    "Enjuto mojamuto bajonaaa mangurrián tontaco ahí va qué chorrazo cartoniano minim.",
  );
});

test("should have a dialog that open and close", async ({ page }) => {
  await page.goto(APP_CONTAINER_URL_TO_GO_TO);

  await page.getByRole("button", { name: "Open dialog" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();

  await page.getByRole("button", { name: "Close" }).filter({ hasNotText: "Close with form" }).click();
  await expect(page.getByRole("dialog")).toBeHidden();

  await page.getByRole("button", { name: "Open dialog" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();

  await page.getByRole("button", { name: "Close with form" }).filter({ hasText: "Close with form" }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
});
