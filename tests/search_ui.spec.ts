import {test, expect} from '@playwright/test';
import {HomePage} from '../pages/homepage';

test('C1 Search by name', async ({page}) => {
    const homePage = new HomePage(page);

    await homePage.goto();
    await homePage.searchProduct('pliers');

    await expect(homePage.productNames.first()).toContainText(/pliers/i);

    const names = await homePage.getProductNames();
    console.log('Product names found:', names);

    expect(names.length).toBeGreaterThan(0);

    for (const name of names) {
        expect(name.toLowerCase()).toContain('pliers');
    }
})