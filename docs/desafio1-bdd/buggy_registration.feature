#language: en
Feature: Cadastro no Buggy
    Como visitante do Buggy
    Quero criar uma conta nova
    Para acessar as funcionalidades autenticadas

    Background:
        Given que estou na pagina de cadastro do Buggy
        And defino um username base "tester"

    @smoke @cadastro
    Scenario: Cadastro valido com dados unicos
        When gero um username unico
        And preencho os campos obrigatorios com valores validos:
            | campo            | valor        |
            | First Name       | Test         |
            | Last Name        | User         |
            | Username         | ${username}  |
            | Password         | Str0ng!Pass1 |
            | Confirm Password | Str0ng!Pass1 |
        And envio o formulario de cadastro
        Then vejo mensagem de sucesso de cadastro

    @negativo @validacao
    Scenario Outline: Validacao de campos obrigatorios e formato de senha
        When preencho os campos obrigatorios com valores:
            | campo            | valor             |
            | First Name       | <firstName>       |
            | Last Name        | <lastName>        |
            | Username         | <username>        |
            | Password         | <password>        |
            | Confirm Password | <confirmPassword> |
        And envio o formulario de cadastro
        Then valido a validacao de erro com mensagem "<mensagem>"

        Examples:
            | firstName | lastName | username       | password     | confirmPassword | mensagem                                                                                                                                                                                                                                                                                                  |
            |           | User     | user-required  | Str0ng!Pass1 | Str0ng!Pass1    | NONE                                                                                                                                                                                                                                                                                                      |
            | Test      |          | user-required  | Str0ng!Pass1 | Str0ng!Pass1    | NONE                                                                                                                                                                                                                                                                                                      |
            | Test      | User     |                | Str0ng!Pass1 | Str0ng!Pass1    | NONE                                                                                                                                                                                                                                                                                                      |
            | Test      | User     | user-weak-pass | 12345        | 12345           | Password must be at least 6 characters                                                                                                                                                                                                                                                                    |
            | Test      | User     | user-mismatch  | Str0ng!Pass1 | Str0ng!Pass2    | Passwords do not match                                                                                                                                                                                                                                                                                    |

    @negativo @duplicado
    Scenario: Username ja existente
        Given ja existe um usuario cadastrado com o username "tester-existente"
        When preencho os campos obrigatorios com valores validos:
            | campo            | valor            |
            | First Name       | Test             |
            | Last Name        | User             |
            | Username         | tester-existente |
            | Password         | Str0ng!Pass1     |
            | Confirm Password | Str0ng!Pass1     |
        And envio o formulario de cadastro
        Then vejo mensagem de erro "User already exists"

    @seguranca
    Scenario: Bloqueio de scripts maliciosos
        When tento submeter scripts maliciosos nos campos de texto:
            | campo            | valor                     |
            | First Name       | <script>alert(1)</script> |
            | Last Name        | <script>alert(2)</script> |
            | Username         | attacker<script>          |
            | Password         | P@ssw0rd<script>          |
            | Confirm Password | P@ssw0rd<script>          |
        And envio o formulario de cadastro
        Then o sistema deve sanitizar ou rejeitar a entrada
        And o cadastro nao deve ser concluido

    @usabilidade
    Scenario: Navegacao por teclado e mascaras
        When navego pelos campos usando tecla tab seguindo a ordem exibida
        And preencho os campos com valores validos:
            | campo            | valor        |
            | First Name       | Test         |
            | Last Name        | User         |
            | Username         | ${username}  |
            | Password         | Str0ng!Pass1 |
            | Confirm Password | Str0ng!Pass1 |
        And envio o formulario de cadastro
        Then a ordem do foco deve ser logica e continua
        And mascaras ou validacoes de formato devem ser aplicadas corretamente
