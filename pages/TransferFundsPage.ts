import { Locator, Page, expect } from '@playwright/test';

export class TransferFundsPage {
    readonly page: Page;
    readonly transferFundsLink: Locator;
    readonly amountInput: Locator;
    readonly fromAccountId: Locator;
    readonly toAccountSelect: Locator;
    readonly transferButton: Locator;
    readonly transferCompleteHeading: Locator;
    readonly transferSuccessMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.transferFundsLink = page.locator('#leftPanel').getByRole('link', { name: 'Transfer Funds' });
        this.amountInput = page.locator('#amount');
        this.fromAccountId = page.locator('#fromAccountId');
        this.toAccountSelect = page.locator('#toAccountId');
        this.transferButton = page.getByRole('button', { name: 'Transfer' });
        this.transferCompleteHeading = page.getByRole('heading', { name: 'Transfer Complete!' });
        this.transferSuccessMessage = page.getByText(/has been transferred from account/);
    }

    async goTo() {
        await this.transferFundsLink.click();
    }

    async fillTransferDetails(amount: string, toAccountId: string) {
        await this.amountInput.fill(amount);

        // chọn account đầu tiên
        await this.fromAccountId.selectOption({ index: 0 });

        // chọn account đích
        await this.toAccountSelect.selectOption(toAccountId);
    }

    async submitTransfer() {
        await this.transferButton.click();
    }

    // ✅ FIX QUAN TRỌNG
    async getFromAccountId(): Promise<string> {
        await this.fromAccountId.waitFor({ state: 'visible' });

        const id = await this.fromAccountId
            .locator('option:checked')
            .textContent();

        if (!id) {
            throw new Error('❌ Failed to get from account ID');
        }

        return id.trim();
    }

    async verifyTransferSuccess(
        amount: string,
        fromAccountId: string,
        toAccountId: string
    ) {
        await expect(this.transferCompleteHeading).toBeVisible();

        const expectedText = `$${amount}.00 has been transferred from account #${fromAccountId} to account #${toAccountId}.`;

        await expect(this.transferSuccessMessage).toContainText(expectedText);
    }
}