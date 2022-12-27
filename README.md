# to-do-list-fullstack

Este é um projeto de estudo, criando uma aplicação simulando um To-do List (Lista de tarefas) utilizando React App, Xampp MySQL e Express.

## Frontend
Na pasta ./web encontra-se todo o Frontend do To-do List.

A organização dos arquivos foram feitas da seguinte forma:
- web
    - node_modules
        - ...
    - public
        - index.html
    - src
        - components
            -   tasks: contém todos os componentes individuais para a página de tasks.
        - pages: contém o home, login, register e as tasks.
        - routes: rotas de conexão com a API.
        - index.css
        - index.js: contém o roteamento para todas as páginas.
        - .env: API_URL=""

## Backend
Na pasta ./api encontra-se a estruturação da API e a coneção efetiva com o banco de dados do Xampp usando MySQL.

A organização dos arquivos foram feitas da seguinte forma:
- api
    - node_modules
        - ...
    - routes: todas as rotas da API.
        - tasks: middlewares e CRUD.
        - user:  middlewares e CRUD.
    - .env: HOST, USER, PASSWORD, DATABASE para conexão com o banco de dados do Xampp e JWT_KEY para criptografia do token.
    - router.js: contém o roteamento da API.
    - server.js: listen server app.
    - setup.js: app uses e configurações.
