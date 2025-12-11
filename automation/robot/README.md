# Robot Framework - Reqres CRUD

Suite que cobre POST, GET, PUT e DELETE no Reqres.

## Pré-requisitos
- Python 3.9+
- `pip install robotframework requests requests-toolbelt robotframework-requests`

## Execução
```
robot reqres_crud.robot
```

Se o executável `robot` não estiver no PATH (instalação via pip --user), use:
```
python -m robot reqres_crud.robot
```

## Observações
- A suíte cria um usuário, captura o `id`, valida o GET, atualiza e exclui na mesma execução.
- Se quiser rodar cenários isolados, utilize `--test "POST Criar usuario"` etc.

## Nota sobre bloqueios
- Houve bloqueios (403/Cloudflare) ao chamar `https://reqres.in/api`, impedindo a execução/validação das automações neste ambiente.
