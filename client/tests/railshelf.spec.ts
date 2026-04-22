// Playwright provides its own test() and expect() functions
// — do not mix these up with Jest's versions
import { test, expect } from '@playwright/test';

test('homepage displays the RailShelf heading', async ({ page }) => {
    // page.goto() opens a URL in a real browser — just like a user
    // typing an address into the address bar
    await page.goto('http://localhost:5173');

    // page.getByRole() finds elements by their accessibility role,
    // similar to React Testing Library's screen.getByRole().
    // .toBeVisible() checks that the element is actually shown on screen.
    await expect(
        page.getByRole('heading', { name: /railshelf/i })
    ).toBeVisible();
});

test('can add a new book', async ({ page }) => {
    // Date.now() generates a unique timestamp so each test run creates
    // a book with a different title. Without this, repeated test runs
    // would create duplicates and cause "found multiple elements" errors.
    const bookTitle = `Test Book ${Date.now()}`;

    await page.goto('http://localhost:5173');

    // Log in first — the app shows the LoginForm when there is no token.
    // getByPlaceholder() finds <input> elements by their placeholder text.
    // Use this when the form uses placeholders instead of <label> elements.
    await page.getByPlaceholder('Email').fill('jiminy@railshelf.com');
    await page.getByPlaceholder('Password').fill('SecurePassword123');
    await page.getByRole('button', { name: 'Log In' }).click();

    // Wait for login to complete — the book list heading should appear
    await expect(
        page.getByRole('heading', { name: /railshelf/i })
    ).toBeVisible();

    // Open the Add Book form
    await page.getByRole('button', { name: /add a book/i }).click();

    // Fill in the form fields. Use the exact placeholder text when a
    // generic match like /title/i would hit multiple elements (e.g.
    // both the search bar and the title input).
    await page.getByPlaceholder('Title *').fill(bookTitle);
    await page.getByPlaceholder(/author name/i).fill('Test Author');

    // Submit the form
    await page.getByRole('button', { name: /save/i }).click();

    // waitForLoadState('networkidle') pauses until all network requests
    // have finished. This is needed because the page refreshes after
    // submission, and we need to wait for the book list to reload.
    await page.waitForLoadState('networkidle');

    // Verify the new book appears in the list.
    // The extended timeout gives the page extra time to finish loading.
    await expect(page.getByText(bookTitle)).toBeVisible({ timeout: 10000 });
});
