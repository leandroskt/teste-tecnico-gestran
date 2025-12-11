*** Settings ***
Library    RequestsLibrary
Suite Setup    Create Session    reqres    https://reqres.in/api

*** Variables ***
${NAME}          morpheus
${JOB}           leader
${UPDATED_JOB}   zion resident
${USER_ID}       None

*** Test Cases ***
POST Criar usuario
    ${payload}=    Create Dictionary    name=${NAME}    job=${JOB}
    ${response}=   Post Request    reqres    /users    json=${payload}
    Should Be Equal As Integers    ${response.status_code}    201
    ${json}=       Set Variable    ${response.json()}
    Should Not Be Empty    ${json}[id]
    Set Suite Variable    ${USER_ID}    ${json}[id]

GET Obter usuario criado
    Should Not Be Equal    ${USER_ID}    None
    ${response}=   Get Request    reqres    /users/${USER_ID}
    Should Be Equal As Integers    ${response.status_code}    200

PUT Atualizar usuario
    ${payload}=    Create Dictionary    name=${NAME}    job=${UPDATED_JOB}
    ${response}=   Put Request    reqres    /users/${USER_ID}    json=${payload}
    Should Be Equal As Integers    ${response.status_code}    200

DELETE Excluir usuario
    ${response}=   Delete Request    reqres    /users/${USER_ID}
    Should Be Equal As Integers    ${response.status_code}    204
