import { test } from '@playwright/test';
import { OpenNewAccountPage } from '../pages/OpenNewAccountPage';
import { TransferFundsPage } from '../pages/TransferFundsPage';

test.use({ storageState: 'playwright/.auth/user.json' });


test('Open account and transfer funds', async ({ page }) => {
  await page.goto('https://parabank.parasoft.com/parabank/index.htm');
  
  const accountPage = new OpenNewAccountPage(page);

  // STEP 1: Open account
  await accountPage.goTo();
  await accountPage.selectAccountType('1');
  await page.waitForLoadState('networkidle');

  await accountPage.submitAccountForm();
  const newAccountId = await accountPage.getNewAccountId();

  await accountPage.verifyAccountCreation(newAccountId);

  // STEP 2: Transfer
  const transferPage = new TransferFundsPage(page);

  await transferPage.goTo();

  const transferAmount = '100';
  const fromAccountId = await transferPage.getFromAccountId();

  await transferPage.fillTransferDetails(transferAmount, newAccountId);
  await transferPage.submitTransfer();

  await transferPage.verifyTransferSuccess(
    transferAmount,
    fromAccountId,
    newAccountId
  );
});