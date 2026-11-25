import { test, expect } from '@playwright/test';

test('Product search displays correct results', async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');

    await page.getByRole('textbox', { name: 'Search' }).fill('Pliers');
    await page.getByRole('button', { name: 'Search' }).click();

    const products = page.getByRole('heading', { name: /pliers/i });

    await expect(products.first()).toBeVisible();
});