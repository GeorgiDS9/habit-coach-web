import { test, expect } from "@playwright/test";

/**
 * End-to-end: signup → create habit → check-in → dashboard stats visible.
 *
 * Prerequisites:
 *  - habit-coach-api running on http://localhost:4000
 *  - habit-coach-web running on http://localhost:3000
 *
 * The test uses a random email to avoid unique-constraint errors on repeated runs.
 */
test.describe("Habit Coach — main flow", () => {
  const randomEmail = () => `test-${Date.now()}@e2e.example`;

  test("signup → create habit → check-in → view dashboard", async ({ page }) => {
    const email = randomEmail();
    const password = "password123";

    // -----------------------------------------------------------------------
    // 1. Signup
    // -----------------------------------------------------------------------
    await page.goto("/signup");
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/password/i).fill(password);
    await page.getByRole("button", { name: /create account/i }).click();

    // Should redirect to habits page after signup
    await expect(page).toHaveURL(/\/habits/);

    // -----------------------------------------------------------------------
    // 2. Create a habit
    // -----------------------------------------------------------------------
    await page.getByRole("button", { name: /new habit/i }).click();
    await page.getByLabel(/title/i).fill("E2E Daily Run");
    await page.getByRole("button", { name: /^create$/i }).click();

    // Habit should appear in the list
    await expect(page.getByText("E2E Daily Run")).toBeVisible();

    // -----------------------------------------------------------------------
    // 3. Open habit detail and log a check-in for today
    // -----------------------------------------------------------------------
    await page.getByRole("link", { name: "E2E Daily Run" }).click();
    await expect(page).toHaveURL(/\/habits\/.+/);

    // Click today's check-in button (the last cell in the grid, which is today)
    const checkInButtons = page.getByRole("button").filter({ hasText: /⬜/ });
    // Click the last one (today is the rightmost)
    const count = await checkInButtons.count();
    if (count > 0) {
      await checkInButtons.nth(count - 1).click();
      // Should now show checked state
      await expect(page.getByRole("button").filter({ hasText: /✅/ })).toHaveCount(1);
    }

    // -----------------------------------------------------------------------
    // 4. Navigate to dashboard and verify streak/stats are visible
    // -----------------------------------------------------------------------
    await page.getByRole("link", { name: /dashboard/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);

    // Stats cards should be present
    await expect(page.getByText(/active habits/i)).toBeVisible();
    await expect(page.getByText(/best current streak/i)).toBeVisible();
    await expect(page.getByText(/check-ins this week/i)).toBeVisible();
  });

  test("login redirects unauthenticated user", async ({ page }) => {
    // Clear storage and try to visit a protected route
    await page.goto("/habits");
    await expect(page).toHaveURL(/\/login/);
  });

  test("login with wrong credentials shows error", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("nobody@nowhere.com");
    await page.getByLabel(/password/i).fill("wrongpassword");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByRole("alert")).toBeVisible();
  });
});
