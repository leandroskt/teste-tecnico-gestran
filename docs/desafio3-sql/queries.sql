-- Consulta 1: nome do produto, preço do produto e nome do fornecedor
SELECT 
    p.nome AS nome_produto,
    p.preco AS preco_produto,
    f.nome AS nome_fornecedor
FROM produto AS p
INNER JOIN fornecedores AS f 
    ON p.fornecedores_id = f.id;

-- Consulta 2: nome e telefone do cliente, nome do vendedor e forma de pagamento
SELECT 
    c.nome AS nome_cliente,
    c.telefone AS telefone_cliente,
    vdd.nome AS nome_vendedor,
    pag.forma_pagamento AS forma_pagamento
FROM venda AS v
INNER JOIN cliente AS c 
    ON v.cliente_id = c.id
INNER JOIN vendedor AS vdd 
    ON v.vendedor_id = vdd.id
INNER JOIN pagamento AS pag 
    ON v.pagamento_id = pag.id;
