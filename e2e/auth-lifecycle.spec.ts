import { test, expect } from "@playwright/test";

/**
 * Auth lifecycle end-to-end tests.
 *
 * Prerequisites:
 *  - habit-coach-api running on http://localhost:4000
 *  - habit-coach-web running on http://localhost:3000
 */
test.describe("Auth lifecycle", () => {
  const randomEmail = () => `auth-e2e-${Date.now()}@e2e.example`;
  const password = "password123";

  test("session persists across page reload", async ({ page }) => {
    const email = randomEmail();

    // Sign up
    await page.goto("/signup");
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/password/i).fill(password);
    await page.getByRole("button", { name: /create account/i }).click();
    await expect(page).toHaveURL(/\/habits/);

    // Reload — should stay on habits (token in localStorage)
    await page.reload();
    await expect(page).toHaveURL(/\/habits/);
    await expect(page.getByText(/habit coach/i)).toBeVisible();
  });

  test("logout clears session and redirects to login", async ({ page }) => {
    const email = randomEmail();

    // Sign up to get a valid session
    await page.goto("/signup");
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/password/i).fill(password);
    await page.getByRole("button", { name: /create account/i }).click();
    await expect(page).toHaveURL(/\/habits/);

    // Log out
    await page.getByRole("button", { name: /log out/i }).click();
    await expect(page).toHaveURL(/\/login/);

    // Verify session is gone — visiting a protected route redirects back to login
    await page.goto("/habits");
    await expect(page).toHaveURL(/\/login/);
  });

  test("accessing protected route while logged out redirects to login", async ({ page }) => {
    // Clear storage explicitly
    await page.goto("/login");
    await page.evaluate(() => localStorage.clear());

    await page.goto("/habits");
    await expect(page).toHaveURL(/\/login/);

    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("forced session expiry shows banner on login page", async ({ page }) => {
    // Simulate what the error link does: set the session reason before navigating
    await page.goto("/login");
    await page.evaluate(() => {
      sessionStorage.setItem("hc_session_reason", "expired");
    });

    // Reload login page — banner should appear
    await page.reload();
    await expect(page.getByRole("status")).toContainText(/session has expired/i);
  });
});
