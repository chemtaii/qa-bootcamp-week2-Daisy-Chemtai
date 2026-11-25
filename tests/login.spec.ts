import {test, expect} from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('Invalid login is rejected', async ({page}) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('invalid@example.com', 'wrongpassword');
    await expect(loginPage.error).toBeVisible();
})