import { test, expect } from "@playwright/test";

test("Test the login page and the auth functionality.", async function ({ page }) {
  // Go to the login page.
  await page.goto("/");

  // Click login button without any details submitted.
  await page.click("text=Login");

  // Should stay on the same page.
  await expect(page).toHaveURL("/");
})