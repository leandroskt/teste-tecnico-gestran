# Playwright - Buggy Form (TS + POM + BDD)

Automação do cadastro do Buggy com Playwright, Cucumber (Gherkin) e Page Object Model.

## Pré-requisitos
- Node.js 18+
- `npm install`
- (Opcional) `npx playwright install` para baixar os navegadores.

## Estrutura principal
- `features/pages/BuggyRegisterPage.ts`: Page Object com seletores/métodos de interação e asserções.
- `features/steps/buggy.steps.ts`: Step definitions em TypeScript consumindo o POM.
- `../docs/desafio1-bdd/buggy_registration.feature`: Feature file (Gherkin) reutilizado.
- `tsconfig.json`: Configuração TS para os steps.

## Execução
- Testes Playwright padrão (spec TS/JS):
```bash
npm test
```

- BDD Cucumber + Playwright (usa o .feature do desafio):
```bash
npm run bdd
```

- BDD com relatório (HTML + JSON em `reports/`):
```bash
npm run bdd:report
```
Depois abra `reports/cucumber.html` no navegador. Evidências (screenshots) ficam anexadas aos passos no HTML.

### Relatórios e evidências
- Saída JSON: `reports/cucumber.json`
- Saída HTML com anexos: `reports/cucumber.html` (abrir no navegador; expanda o cenário e cada step para ver prints e JSON anexos)
- Screenshots são anexados inline no HTML (não são gravados em disco fora do relatório)

### Dicas de execução
- Se precisar apontar para outro formulário: `BUGGY_BASE_URL=https://url-do-formulario npm run bdd:report`
- Para reproduzir localmente de forma limpa: `npm install`, opcional `npx playwright install`, depois `npm run bdd` ou `npm run bdd:report`.

Variáveis úteis:
- `BUGGY_BASE_URL=https://buggy.justtestit.org/register` (default) — ajuste se o endpoint mudar.

## Notas e ajustes
- Se os seletores do formulário diferirem, atualize apenas `features/pages/BuggyRegisterPage.ts`.
- Os steps usam geração de username única (`${username}`) e cobrem caminhos feliz, negativos, duplicidade, segurança e usabilidade (tab order).
- Tipos e lint são estritos; o build usa `ts-node/register` no comando `bdd`.
