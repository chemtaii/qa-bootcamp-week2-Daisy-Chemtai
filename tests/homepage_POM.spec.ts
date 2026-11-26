import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/homepage';

test('Search returns the same products regardless of letter case', async ({page}) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await homePage.searchProduct('pliers');
    const lowerCaseNames = await homePage.getProductNames();
    expect(lowerCaseNames.length).toBeGreaterThan(0);

    await homePage.searchProduct('PLIERS');
    await expect(homePage.productNames).toHaveText(lowerCaseNames);

    await homePage.searchProduct('Pliers');
    await expect(homePage.productNames).toHaveText(lowerCaseNames);
});