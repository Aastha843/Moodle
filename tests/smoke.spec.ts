import { test, expect } from "@playwright/test";

test("home page responds", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.status()).toBeLessThan(400);
  await expect(page.locator("body")).toBeVisible();
});

test("/api/render without id returns 400", async ({ request }) => {
  const res = await request.get("/api/render");
  expect(res.status()).toBe(400);
  const text = (await res.text()).toLowerCase();
  expect(text).toContain("missing");
});
