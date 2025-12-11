# Bug Report - Sauce Demo

Estrutura para registrar achados do site `https://www.saucedemo.com/inventory.html`.

## Template sugerido
- **ID**: BUG-001
- **Título**: Resuma o problema
- **Descrição**: Contexto e impacto
- **Passos para reproduzir**:
  1. 
- **Resultado atual**: 
- **Resultado esperado**: 
- **Severidade / Prioridade**: 
- **Ambiente**: Navegador, versão, SO, resolução
- **Evidências**: prints, vídeo, HAR, console
- **Notas**: Logs, hipóteses, similaridades

## Achados

### BUG-001 - Ordenação não consistente após refresh
- **Descrição**: Ao aplicar ordenação "Price (low to high)" e atualizar a página com F5, a lista volta ao estado original, mas o seletor permanece exibindo o critério antigo.
- **Passos**:
  1. Logar com `standard_user` / `secret_sauce`.
  2. Na página de inventário, selecionar "Price (low to high)".
  3. Pressionar F5 (ou Ctrl+R).
- **Resultado atual**: Produtos voltam à ordem padrão, mas o seletor continua marcando "Price (low to high)", sugerindo ordenação aplicada quando não está.
- **Resultado esperado**: Após refresh, ou a lista permanece ordenada por preço, ou o seletor volta ao valor padrão para refletir o estado real.
- **Severidade / Prioridade**: Média / Média (pode causar confusão ao usuário sobre a ordenação exibida).
- **Ambiente**: Chrome 120, Windows 11, 1920x1080.
- **Evidências**: Vídeo na pasta Evidências.


### BUG-002 - Filtro não aplicado ao voltar do detalhe
- **Descrição**: Com filtro "Name (Z to A)", entrar no detalhe de um item e voltar; a ordenação se perde.
- **Passos**:
  1. Logar.
  2. Aplicar filtro "Name (Z to A)".
  3. Abrir qualquer item e clicar em "Back to products".
- **Resultado atual**: Lista retorna à ordenação padrão, seletor mostra "Name (Z to A)".
- **Resultado esperado**: Manter ordenação ao navegar entre detalhes e lista, ou resetar seletor para refletir o estado real.
- **Severidade / Prioridade**: Média / Média.
- **Ambiente**: Chrome 120, Windows 11.
- **Evidências**: Video na pasta Evidências.

### BUG-003 - Nome de item inválido no catálogo
- **Descrição**: O último item do catálogo exibe um nome não amigável/placeholder: "Test.allTheThings() T-Shirt (Red)", destoando dos demais produtos.
- **Passos**:
  1. Logar com `standard_user` / `secret_sauce`.
  2. Acessar `/inventory` e rolar até o item "Test.allTheThings() T-Shirt (Red)".
- **Resultado atual**: O título mostrado ao usuário é "Test.allTheThings() T-Shirt (Red)", aparentando ser um rótulo de teste.
- **Resultado esperado**: Nome comercial consistente com os demais produtos (ex.: "Sauce Labs T-Shirt (Red)") sem referências a nomes de teste.
- **Severidade / Prioridade**: Baixa / Baixa (afeta percepção/branding, não o fluxo de compra).
- **Ambiente**: Chrome 120, Windows 11.
- **Evidências**: Screenshot na pasta Evidências.

### BUG-004 - Descrição incoerente no item "Sauce Labs Backpack"
- **Descrição**: O texto descritivo do item contém trecho não natural: "carry.allTheThings() with the sleek...", sugerindo placeholder de teste ou variável, destoando da linguagem dos demais produtos.
- **Passos**:
  1. Logar com `standard_user` / `secret_sauce`.
  2. Acessar `/inventory` e observar a descrição do item "Sauce Labs Backpack".
- **Resultado atual**: Descrição inicia com "carry.allTheThings()" em vez de uma frase descritiva normal.
- **Resultado esperado**: Texto de marketing coerente, sem referências a nomes de função/placeholder (ex.: "Carry all the things with the sleek..." ou similar em linguagem natural).
- **Severidade / Prioridade**: Baixa / Baixa (impacta percepção e branding, não bloqueia compra).
- **Ambiente**: Chrome 120, Windows 11.
- **Evidências**: Screenshot na pasta Evidências.

> Observação: mantenha ou ajuste os achados conforme validação real; inclua evidências antes de entregar.
