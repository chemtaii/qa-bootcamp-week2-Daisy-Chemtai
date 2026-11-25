import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
    readonly email: Locator;
    readonly password: Locator;
    readonly loginButton: Locator;
    readonly error: Locator;
    constructor (readonly page: Page) {
        this.email = page.getByPlaceholder('Your email');
        this.password = page.getByPlaceholder('Your password');
        this.loginButton = page.getByRole('button', {name: 'Login'});
        this.error = page.getByText('Invalid email or password');
    }
    async goto() {
        await this.page.goto('/auth/login');
    }
    async login(email: string, password: string) {
        await this.email.fill(email);
        await this.password.fill(password);
        await this.loginButton.click();
    }
}

