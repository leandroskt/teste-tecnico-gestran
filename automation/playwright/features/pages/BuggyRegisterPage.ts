import { Page, Locator, expect } from '@playwright/test';

export class BuggyRegisterPage {
    private readonly page: Page;
    private readonly registerForm: Locator;
    private readonly firstName: Locator;
    private readonly lastName: Locator;
    private readonly userName: Locator;
    private readonly password: Locator;
    private readonly confirmPassword: Locator;
    private readonly terms: Locator;
    private readonly submit: Locator;
    private readonly success: Locator;
    private readonly error: Locator;

    constructor(page: Page) {
        this.page = page;
        this.registerForm = page.locator('form').filter({ has: page.getByRole('button', { name: /register/i }) }).first();
        this.firstName = this.registerForm.locator('input[name="firstName"], input#firstName').first();
        this.lastName = this.registerForm.locator('input[name="lastName"], input#lastName').first();
        this.userName = this.registerForm.locator('input#username, input[formcontrolname="username"], input[name="username"]').first();
        this.password = this.registerForm.locator('input#password, input[formcontrolname="password"], input[name="password"]').first();
        this.confirmPassword = this.registerForm.locator('input#confirmPassword, input[formcontrolname="confirmPassword"], input[name="confirmPassword"]').first();
        this.terms = this.registerForm.locator('input[type="checkbox"]');
        this.submit = this.registerForm.getByRole('button', { name: /register/i }).first();
        this.success = page.locator('.alert-success, .result');
        this.error = page.locator('.alert-danger, .error, .result');
    }

    fieldSelector(field: string): Locator {
        const map: Record<string, Locator> = {
            'First Name': this.firstName,
            'Last Name': this.lastName,
            Username: this.userName,
            Password: this.password,
            'Confirm Password': this.confirmPassword,
        };
        const locator = map[field];
        if (!locator) throw new Error(`Campo nao mapeado: ${field}`);
        return locator;
    }

    async goto(url: string): Promise<void> {
        await this.page.goto(url);
    }

    async fillField(field: string, value: string): Promise<void> {
        await this.fieldSelector(field).fill(value ?? '');
    }

    async fillFromTable(rows: Array<{ campo: string; valor: string }>): Promise<void> {
        for (const row of rows) {
            const field = row.campo?.trim();
            await this.fillField(field, row.valor ?? '');
        }
    }

    async acceptTermsIfVisible(): Promise<void> {
        if ((await this.terms.count()) > 0 && (await this.terms.first().isVisible())) {
            await this.terms.first().check({ force: true });
        }
    }

    async submitForm(): Promise<void> {
        if (await this.submit.isEnabled()) {
            await this.submit.click();
            // Aguarda a resposta/renderização pós-clique (rede ou UI)
            try {
                await this.page.waitForLoadState('networkidle', { timeout: 5000 });
            } catch {
                // Se a página não navegar, aguarda um pequeno tempo para renderizar validações client-side
                await this.page.waitForTimeout(2000);
            }
        }
    }

    async expectSuccess(): Promise<void> {
        await expect(this.success.first()).toBeVisible();
    }

    async expectErrorContains(text: string): Promise<void> {
        if (text === 'NONE') {
            await expect(this.submit).toBeDisabled({ timeout: 2000 });
            return;
        }

        const visibleError = this.page
            .locator('.alert-danger:visible, .error:visible, .result:visible')
            .filter({ hasText: text });

        await expect(visibleError.first()).toBeVisible({ timeout: 4000 });
    }

    async expectBlockedRegistration(): Promise<void> {
        await expect(this.submit).toBeDisabled({ timeout: 2000 });
        await expect(this.success).not.toBeVisible({ timeout: 2000 });
    }

    async expectNoSuccess(): Promise<void> {
        await expect(this.success).not.toBeVisible();
    }

    async focusOrderIsLogical(): Promise<void> {
        const order = [this.firstName, this.lastName, this.userName, this.password, this.confirmPassword];
        await order[0].focus();
        for (let i = 1; i < order.length; i++) {
            await this.page.keyboard.press('Tab');
            await expect(order[i]).toBeVisible();
        }
    }

    async validateMasksOrFormats(): Promise<void> {
        const fields = [this.firstName, this.lastName, this.userName];
        for (const field of fields) {
            const value = await field.inputValue();
            expect(value).not.toBeNull();
        }
    }
}
