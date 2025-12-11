# Teste Técnico - GESTRAN

> Repositório organizado para responder aos desafios (BDD, bugs, SQL, API e automações) do processo seletivo.

## Estrutura
- `docs/desafio1-bdd/buggy_registration.feature`: cenários BDD do formulário Buggy.
- `docs/desafio2-bugs/bug-report.md`: modelo + achados para Sauce Demo.
- `docs/desafio3-sql/queries.sql`: consultas solicitadas.
- `docs/desafio4-postman/`: coleção Postman com testes de status code.
- `automation/robot/`: suíte Robot para CRUD no Reqres.
- `automation/playwright/`: teste Playwright para cadastro Buggy.

## Como executar o que é automatizado
- **Robot (Reqres)**: `cd automation/robot; pip install -r <deps>` (veja README) e `robot reqres_crud.robot`.
- **Postman (Reqres)**: importar `docs/desafio4-postman/reqres-crud-collection.json` e rodar na ordem POST -> GET -> PUT -> DELETE.
- **Playwright (Buggy)**: `cd automation/playwright; npm install; npx playwright test` (ajuste `BUGGY_BASE_URL` e seletores se necessário).

## Anotações rápidas por desafio
- **Desafio 1**: cenários BDD cobrindo caminho feliz, campos obrigatórios, validações de e-mail/senha, duplicidade e segurança básica.
- **Desafio 2**: template de bug report + exemplos iniciais para `saucedemo` (completar com evidências reais).
- **Desafio 3**: consultas SQL usando joins entre produtos/fornecedores e pedidos/clientes/vendedores/pagamentos.
- **Desafio 4**: coleção Postman com testes de status code para CRUD de usuários no Reqres.
- **Desafio 5**: automação API (Robot) e UI (Playwright) cobrindo CRUD e fluxo de cadastro.