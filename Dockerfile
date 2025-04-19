# Etapa 1: build da aplicação
FROM node:18-alpine AS builder

WORKDIR /app

# Copia apenas os arquivos necessários primeiro (melhora cache)
COPY package.json yarn.lock ./

# Instala as dependências (sem reconstruir lockfile)
RUN yarn install --frozen-lockfile

# Copia o restante dos arquivos
COPY . .

# Compila o TypeScript
RUN yarn build

# Etapa 2: cria uma imagem menor apenas com o necessário
FROM node:18-alpine

WORKDIR /app

# Copia apenas o que é necessário para rodar a aplicação
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/build ./build
COPY --from=builder /app/data ./data

# Expõe a porta
EXPOSE 4000

# Inicia a aplicação
CMD ["node", "build/index.js"]
