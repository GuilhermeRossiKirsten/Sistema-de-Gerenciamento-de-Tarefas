# Sistema de Gerenciamento de Tarefas

Este projeto é um **Sistema de Gerenciamento de Tarefas**, dividido em **Backend** e **Frontend**, com suporte a execução local e deployment em produção.

---

## 🖥 Backend

O backend é desenvolvido com **TypeScript** e **Fastify**, utilizando **Zod** para validação de dados. Ele oferece uma API REST para gerenciamento de tarefas, incluindo criação, atualização, exclusão e listagem.

### 💾 Banco de Dados

O banco de dados é PostgreSQL e pode ser executado localmente utilizando Docker:

```bash
docker compose up
```

Esse comando cria o banco, executa as migrations e insere alguns dados iniciais para teste.

### ⚡ Executando o servidor

Para rodar o servidor localmente, é necessário utilizar a versão 24 do Node.js:

```bash
npm install
npm run start
```

### Swagger da API:
https://sistema-de-gerenciamento-de-tarefas-wkf7.onrender.com/docs

#### Endpoints principais:

```js
GET    /tasks          → Lista tarefas 

POST   /task           → Cria nova tarefa

PATCH  /task/:id       → Atualiza tarefa

DELETE /task/:id       → Remove tarefa

GET    /csrf-token/:id → Obtém token CSRF
```



#### CSRF Token:

Cada usuário possui um token válido por 5 minutos

Necessário enviar nos headers:

`X-CSRF-Token: <token>`

`X-User-Id: <id>`

O servidor disponibiliza todos os endpoints da API para comunicação com o frontend.

## 📱 Frontend

O frontend é desenvolvido em NextJS, React e Typescript:

### Ambiente de Desenvolvimento

```bash
npm run dev
```
Executa o frontend em modo de desenvolvimento.

Permite hot reload, ou seja, alterações no código são refletidas imediatamente sem reiniciar o app.

Ideal para testes e desenvolvimento de novas funcionalidades.

### Produção Local

```bash
npm run build
npm run start
```
Executa o frontend compilado, semelhante ao ambiente de produção.

Código otimizado e pronto para deployment.

Ideal para testes finais antes de subir para produção.

## 🌐 Produção

O projeto também possui uma versão em produção:

Backend e banco de dados hospedados no Render
.

Frontend hospedado na Vercel: https://sistema-de-gerenciamento-de-tarefas-two.vercel.app/

## 🛠 Tecnologias Utilizadas

Backend: TypeScript, Fastify, Zod, PostgreSQL, Drizzle ORM, Node.js v24

Frontend: NextJS, React, TypeScript

Deployment: Render (backend), Vercel (frontend)

Docker: para banco de dados local
