import {test, expect} from '@playwright/test';
import {pathToFileURL} from 'url';
import path from 'path';

test('Drill fixed: Save shows a message', async ({page}) => {
    const fileUrl = pathToFileURL(path.join(__dirname, 'index.html')).href;
    await page.goto(fileUrl);

    await page.getByRole('button', {name: 'Save'}).click();

    // retries until the text is "Saved", or times out after 5 seconds
    await expect(page.locator('#status')).toHaveText('Saved');
})