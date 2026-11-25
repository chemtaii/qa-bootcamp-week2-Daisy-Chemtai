import { test, expect } from '@playwright/test';

test('GET products returns a successful response', async ({ request }) => {

    const response = await request.get('https://api.practicesoftwaretesting.com/products');

    expect(response.status()).toBe(200);

    const body = await response.json();

    //Check the first product's name
    expect(body.data[0].name).toBeTruthy();

});