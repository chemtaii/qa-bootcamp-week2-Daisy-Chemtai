import {test, expect} from '@playwright/test';
import {pathToFileURL} from 'url';
import path from 'path';

test('Save shows a message', async ({page}) => {
    const fileUrl = pathToFileURL(path.join(__dirname, 'index.html')).href;
    await page.goto(fileUrl);

    await page.getByRole('button', {name: 'Save'}).click();

    await page.waitForTimeout(500);  

    const message = await page.locator('#status').textContent();
    console.log('Message read:', message);
    expect(message).toBe('Saved');
})