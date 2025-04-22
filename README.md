# 🔐 Authify-Back

Authify-Back é uma API de autenticação desenvolvida com **Fastify** e **GraphQL (Mercurius)**, utilizando **TypeScript** e **Prisma**. O projeto possui uma arquitetura modular clara, separando os Resolvers, TypeDefs e tipos globais. A autenticação é feita com JWT e as senhas são protegidas com bcryptjs.

---

## 🚀 Tecnologias Utilizadas

- [Fastify](https://fastify.io/)
- [Mercurius (GraphQL)](https://mercurius.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma ORM](https://www.prisma.io/)
- [Zod](https://github.com/colinhacks/zod) – validação de dados
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- [dotenv](https://github.com/motdotla/dotenv)
- [tsup](https://tsup.egoist.dev/) – build TypeScript moderna

---

## 📁 Estrutura de Pastas

```bash
.
├── prisma/
│   └── schema.prisma             # Esquema do banco de dados Prisma
├── src/
│   ├── graphql/
│   │   ├── Resolvers/
│   │   │   └── index.ts          # Resolvers GraphQL
│   │   └── TypesDefs/
│   │       └── index.ts          # Definições de tipos GraphQL (SDL)
│   │── types/
│   │   └── index.ts              # Tipos globais ou utilitários
│   │── auth.ts                   # Funções para autenticação
│   └── index.ts                  
├── .env                          # Variáveis de ambiente
├── .gitignore
├── package.json
├── tsconfig.json
├── yarn.lock
```

---

## ⚙️ Como Rodar Localmente

1. **Clone o repositório**

```bash
git clone https://github.com/Eduardo-Paixao/Authify-Back.git
cd Authify-Back
```

2. **Instale as dependências**

```bash
yarn
# ou
npm install
```

3. **Configure o `.env`**

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/db"
JWT_SECRET="sua_chave_super_secreta"
JWT_REFRESH_SECRET="sua_chave_super_secreta"
PORT=3333
```

4. **Execute as migrações do Prisma**

```bash
npx prisma migrate dev
```

5. **Inicie o servidor**

```bash
yarn dev
# ou
npm run dev
```

---

## 🔐 Funcionalidades

- ✅ Autenticação com JWT
- 🔐 Hash seguro de senhas com bcryptjs
- 🚀 API construída com GraphQL e Mercurius
- 🧱 Arquitetura modular para escalabilidade
- 🔍 Tipagem com TypeScript 

---

## 📜 Scripts disponíveis

```bash
yarn dev      # Inicia o projeto com tsx
yarn build    # Compila o código com tsup
yarn start    # Executa o projeto já compilado
```

---

## 📘 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

Feito com 💙 por [Eduardo Paixão](https://github.com/Eduardo-Paixao)
