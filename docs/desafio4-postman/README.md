# Postman - Reqres CRUD

Coleção `reqres-crud-collection.json` cobre POST, GET, PUT e DELETE.

## Uso
1. Importar a coleção no Postman.
2. Garantir variável `baseUrl` = `https://reqres.in/api` (já vem definida).
3. Executar na ordem: POST -> GET -> PUT -> DELETE.
4. A requisição POST salva o `userId` como collection variable para ser usado nas demais.

## Testes automáticos
- Cada requisição valida o status code esperado (201, 200, 200, 204) e campos de eco (`name`, `job`, `id`/`createdAt`, `updatedAt`).
- Ajuste body/variáveis conforme necessidade.

## Nota sobre bloqueios
- Houve bloqueios (403/Cloudflare) no `reqres.in`, o que impediu executar/validar as automações neste ambiente.

