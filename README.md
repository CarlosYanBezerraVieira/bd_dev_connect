# db_dev_connect

> Backend simples em Node.js + Express + MongoDB para gerenciar posts (modelo pequeno para um feed).

Resumo rápido
- Projeto mínimo com Express (app exportado em `server.js`) e conexão MongoDB em `db.js`.
- API principal exposta em `/api/posts` (implementada em `routes/posts.js`).
- Modelo de dados: `models/Post.js` (author, authorImageBytes, content, likes, isLiked).

Pré-requisitos
- Node.js (>=16 recomendado)
- MongoDB acessível (URI disponível via variável de ambiente `MONGO_URI`)

Instalação

1. Instale dependências:

```powershell
npm install
```

2. Defina a variável de ambiente (ex.: arquivo `.env` na raiz):

```
MONGO_URI=mongodb+srv://usuario:senha@cluster0.mongodb.net/meubanco
```

Como executar (nota importante)
- O arquivo `server.js` exporta a instância do Express mas não chama `app.listen()` — isto permite testes ou uso em servidores serverless. Para rodar localmente crie um `index.js` simples ou usar o comando abaixo:

Exemplo mínimo de `index.js` para rodar localmente:

```javascript
// index.js
const app = require("./server");
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
```

Depois rode:

```powershell
node index.js
```

Endpoints principais (base `/api/posts`)

- GET /api/posts/getAll
  - Retorna todos os posts ordenados por `createdAt` (desc).
- GET /api/posts/:id
  - Retorna um post por ID.
- POST /api/posts/
  - Cria um novo post. Body esperado (JSON):
    - `author` (string, required)
    - `authorImageBytes` (string, required) — o projeto atual armazena a imagem como string (provavelmente base64)
    - `content` (string, required)
    - `likes` (number, opcional)
    - `isLiked` (boolean, opcional)
- PUT /api/posts/:id
  - Atualiza um post (substitui campos passados; retorna o documento novo).
- DELETE /api/posts/:id
  - Deleta um post (responde 204 no sucesso).
- PATCH /api/posts/:id/like
  - Atualiza apenas o estado de curtida (body: `{ "isLiked": true|false }`) e ajusta a contagem de `likes` de acordo.
- GET /api/posts/shouldUpdate/:lastSync
  - Recebe uma data ISO em `lastSync` (params) e retorna `{ shouldUpdate: boolean }` indicando se existem posts com `updatedAt` mais recentes.

Notas sobre o modelo
- `models/Post.js` usa timestamps (`createdAt`, `updatedAt`).
- Campos principais: `author`, `authorImageBytes`, `content`, `likes` (default 0), `isLiked` (default false).

Conveções e observações específicas deste repositório
- `server.js` monta middlewares (cors, body-parser) e chama `connectDB()` do `db.js`. Se for usado em produção (serverless), o export do `app` facilita testes e integração com plataformas que esperam um handler.
- `db.js` guarda um `isConnected` simples para evitar reconexões repetidas (útil em ambientes serverless/lamdas).
- `routes/posts.js` mistura endpoints de CRUD com rota utilitária `shouldUpdate` pensada para sincronização eficiente.

Dependências principais
- express, mongoose, body-parser, cors, dotenv