import { Browser, BrowserContext, chromium, Page, expect } from '@playwright/test';
import {
    After,
    AfterAll,
    Before,
    DataTable,
    Given,
    Then,
    When,
    setDefaultTimeout,
    setWorldConstructor,
    World,
    AfterStep,
    Status,
} from '@cucumber/cucumber';
import { BuggyRegisterPage } from '../pages/BuggyRegisterPage';
import fs from 'fs';
import path from 'path';

setDefaultTimeout(60 * 1000);

const BASE_URL = process.env.BUGGY_BASE_URL || 'https://buggy.justtestit.org/register';
let sharedBrowser: Browser | null = null;

type TableRow = { campo?: string; valor?: string };

class CustomWorld extends World {
    context!: BrowserContext;
    page!: Page;
    registerPage!: BuggyRegisterPage;
    usernameBase = 'tester';
    username: string | null = null;
    currentStep = '';
    evidenceLabels = new Set<string>();
}

setWorldConstructor(CustomWorld);

async function attachEvidence(world: CustomWorld, label: string, data?: Record<string, unknown>, withScreenshot = true): Promise<void> {
    if (!world.attach) return;
    // evita anexos duplicados para o mesmo label dentro do cenário
    if (world.evidenceLabels.has(label)) return;
    world.evidenceLabels.add(label);
    if (data) {
        await world.attach(JSON.stringify({ step: label, ...data }, null, 2), 'application/json');
    }
    if (withScreenshot && world.page) {
        const buffer = await world.page.screenshot({ fullPage: true });
        await world.attach(buffer, 'image/png');
    }
}

function resolveValue(rawValue: string | undefined, world: CustomWorld): string {
    if (rawValue === '${username}' || rawValue === '<username>') {
        if (!world.username) {
            world.username = `${world.usernameBase || 'tester'}_${Date.now()}`;
        }
        return world.username;
    }
    return rawValue ?? '';
}

function normalizeRows(dataTable: DataTable, world: CustomWorld): Array<{ campo: string; valor: string }> {
    const rows = dataTable.hashes() as Array<Record<string, string>>;
    return rows.map((row: Record<string, string>) => ({
        campo: (row.campo || '').trim(),
        valor: resolveValue(row.valor, world),
    }));
}

Before(async function (this: CustomWorld) {
    if (!sharedBrowser) {
        sharedBrowser = await chromium.launch({ headless: true });
    }
    this.context = await sharedBrowser.newContext();
    this.page = await this.context.newPage();
    this.registerPage = new BuggyRegisterPage(this.page);
    this.evidenceLabels = new Set<string>();
});

After(async function (this: CustomWorld) {
    if (this.context) {
        await this.context.close();
    }
});

AfterAll(async function () {
    if (sharedBrowser) {
        await sharedBrowser.close();
        sharedBrowser = null;
    }
});

AfterStep(async function (this: CustomWorld, { pickle, result }) {
    this.currentStep = pickle.name;
    if (!this.page) return;
    if (result?.status !== Status.FAILED) return;
    const buffer = await this.page.screenshot({ fullPage: true });
    await this.attach(buffer, 'image/png');
});

Given('que estou na pagina de cadastro do Buggy', async function (this: CustomWorld) {
    await this.registerPage.goto(BASE_URL);
});

Given('defino um username base {string}', function (this: CustomWorld, base: string) {
    this.usernameBase = base;
});

When('gero um username unico', function (this: CustomWorld) {
    this.username = `${this.usernameBase || 'tester'}_${Date.now()}`;
    void attachEvidence(this, 'username-gerado', { username: this.username }, false);
});

When('preencho os campos obrigatorios com valores validos:', async function (this: CustomWorld, dataTable: DataTable) {
    const rows = normalizeRows(dataTable, this);
    await this.registerPage.fillFromTable(rows);
    await attachEvidence(this, 'preencher-campos-validos', { username: this.username });
});

When('preencho os campos com valores validos:', async function (this: CustomWorld, dataTable: DataTable) {
    const rows = normalizeRows(dataTable, this);
    await this.registerPage.fillFromTable(rows);
    await attachEvidence(this, 'preencher-campos', { username: this.username });
});

When('preencho os campos obrigatorios com valores:', async function (this: CustomWorld, dataTable: DataTable) {
    const rows = normalizeRows(dataTable, this);
    await this.registerPage.fillFromTable(rows);
    await attachEvidence(this, 'preencher-campos-obrigatorios', { username: this.username });
});

When('aceito os termos se exibidos', async function (this: CustomWorld) {
    await this.registerPage.acceptTermsIfVisible();
});

When('envio o formulario de cadastro', async function (this: CustomWorld) {
    await this.registerPage.submitForm();
    await attachEvidence(this, 'enviar-formulario', { username: this.username });
});

Then('vejo mensagem de sucesso de cadastro', async function (this: CustomWorld) {
    await this.registerPage.expectSuccess();
    await attachEvidence(this, 'mensagem-sucesso', { username: this.username });
});

Then('estou habilitado para autenticar', async function (this: CustomWorld) {
    await this.registerPage.expectSuccess();
});

Then('vejo mensagem de erro {string}', async function (this: CustomWorld, message: string) {
    await this.registerPage.expectErrorContains(message);
    await attachEvidence(this, 'mensagem-erro', { esperado: message, username: this.username });
});

Then('valido a validacao de erro com mensagem {string}', async function (this: CustomWorld, message: string) {
    await this.registerPage.expectErrorContains(message);
    await attachEvidence(this, 'validacao-erro', { esperado: message, username: this.username });
});

Then('o cadastro nao deve ser concluido', async function (this: CustomWorld) {
    await this.registerPage.expectBlockedRegistration();
    await attachEvidence(this, 'cadastro-nao-concluido', { username: this.username });
});

Given('ja existe um usuario cadastrado com o username {string}', function (this: CustomWorld, username: string) {
    this.username = username;
});

When('tento submeter scripts maliciosos nos campos de texto:', async function (this: CustomWorld, dataTable: DataTable) {
    const rows = normalizeRows(dataTable, this);
    await this.registerPage.fillFromTable(rows);
    await attachEvidence(this, 'scripts-maliciosos-preenchidos', { username: this.username });
});

Then('o sistema deve sanitizar ou rejeitar a entrada', async function (this: CustomWorld) {
    await this.registerPage.expectBlockedRegistration();
    await attachEvidence(this, 'sanitizacao-ou-rejeicao', { username: this.username });
});

When('navego pelos campos usando tecla tab seguindo a ordem exibida', async function (this: CustomWorld) {
    await this.registerPage.focusOrderIsLogical();
});

Then('a ordem do foco deve ser logica e continua', function () {
    // Validado no passo de navegacao por tab.
});

Then('mascaras ou validacoes de formato devem ser aplicadas corretamente', async function (this: CustomWorld) {
    await this.registerPage.validateMasksOrFormats();
});

// Pequena assercao defensiva para cenarios negativos com erro generico
Then('vejo mensagem de erro', async function (this: CustomWorld) {
    await expect(this.page.locator('.alert-danger, .error, .result')).toBeVisible();
});
