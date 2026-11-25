import { type Page, type Locator } from '@playwright/test';

export class HomePage {

    readonly search: Locator;
    readonly searchButton: Locator;
    readonly productNames: Locator;

    constructor (readonly page: Page) {
        this.search = page.getByPlaceholder('Search');
        this.searchButton = page.getByRole('button', {name: 'Search'});
        this.productNames = page.locator('[data-test="product-name"]');
    }

    async goto() {
        await this.page.goto('/');
    }

    async searchProduct(productName: string) {
        const searchResponse = this.page.waitForResponse(
            (response) => response.url().includes('/products/search') && response.ok()
        );
        await this.search.fill(productName);
        await this.searchButton.click();
        await searchResponse;
    }

    async getProductNames(): Promise<string[]> {
        await this.productNames.first().waitFor();
        return this.productNames.allTextContents();
    }
};