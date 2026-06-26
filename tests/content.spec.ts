import { expect, test } from '@playwright/test';

test.describe('content hub visibility', () => {
  test('shows the readings hub without the coming-soon overlay', async ({ page }) => {
    await page.goto('/content', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: '[ READINGS ]' })).toBeVisible();
    await expect(page.locator('#weekly')).toBeVisible();
    await expect(page.locator('#library')).toBeVisible();
    await expect(page.locator('#radar')).toBeVisible();
    await expect(page.locator('#voices')).toBeVisible();
    await expect(page.locator('#radar a')).toHaveCount(8);

    await page.waitForLoadState('load', { timeout: 8000 }).catch(() => undefined);
    await page.getByRole('tab', { name: /FIELD MODELS/ }).click();
    await expect(page.getByRole('tab', { name: /FIELD MODELS/ })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    await expect(page.getByRole('heading', { name: 'Charter Jurisdictions' })).toBeVisible();
    await expect(page.locator('#library a[href="/societies"]')).toHaveCount(4);

    await expect(page.getByRole('heading', { name: 'Coming Soon' })).toHaveCount(0);
    await expect(page.getByRole('link', { name: '[ CONTRIBUTE ]' })).toHaveCount(0);
  });

  test('keeps explicitly gated pages behind the coming-soon overlay', async ({ page }) => {
    await page.goto('/tooling', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: 'Coming Soon' })).toBeVisible();
    await expect(page.getByRole('link', { name: '[ CONTRIBUTE ]' })).toBeVisible();
  });
});
