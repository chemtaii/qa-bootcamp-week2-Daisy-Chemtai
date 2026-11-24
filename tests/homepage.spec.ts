import {test, expect} from '@playwright/test';

test ('Homepage displays correct title', async ({page}) => {
    await page.goto('https://practicesoftwaretesting.com/');
    const title = await page.title();
    console.log(title);
    expect(title).toBe('Practice Software Testing - Toolshop - v5.0');
})