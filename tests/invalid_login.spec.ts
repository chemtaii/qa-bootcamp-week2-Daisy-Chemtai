import { test, expect } from '@playwright/test';

test('Invalid login displays an error message', async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/auth/login', {
        waitUntil: 'domcontentloaded'
    });

    await page.getByRole('textbox', { name: 'Email' }).fill('invalid@example.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('wrongpassword');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Invalid email or password')).toBeVisible();
});