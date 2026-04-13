import { Locator, Page, expect } from '@playwright/test';

export class OpenNewAccountPage {
    readonly page: Page;
    readonly openAccountLink: Locator;
    readonly accountTypeSelect: Locator;
    readonly openAccountButton: Locator;
    readonly newAccountId: Locator;
    readonly accountOpenedHeading: Locator;
    readonly successMessage: Locator;
    readonly newAccountMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.openAccountLink = page.getByRole('link', { name: 'Open New Account' });
        this.accountTypeSelect = page.locator('#type');
        this.openAccountButton = page.locator('input.button[value="Open New Account"]');
        this.newAccountId = page.locator('#newAccountId');
        this.accountOpenedHeading = page.getByRole('heading', { name: 'Account Opened!' });
        this.successMessage = page.getByText('Congratulations, your account is now open');
        this.newAccountMessage = page.locator('#openAccountResult');
    }

    async goTo() {
        await this.openAccountLink.click();
    }

    async selectAccountType(accountType: string) {
        await this.accountTypeSelect.selectOption(accountType);
    }

    async submitAccountForm() {
        await this.openAccountButton.click();
    }

   
    async getNewAccountId(): Promise<string> {
        await this.newAccountId.waitFor({ state: 'visible' });

        const id = await this.newAccountId.textContent();

        if (!id) {
            throw new Error('Failed to get new account ID');
        }

        return id.trim();
    }

    async verifyAccountCreation(newAccountId: string) {
        await expect(this.accountOpenedHeading).toBeVisible();
        await expect(this.successMessage).toBeVisible();

        const newAccountMessageText = await this.newAccountMessage.textContent();

        if (!newAccountMessageText) {
            throw new Error(' Account creation message is empty');
        }

        await expect(newAccountMessageText).toContain(newAccountId);
    }
}