# Usa uma imagem leve do Node
FROM node:18-alpine

# Cria o diretório de trabalho
WORKDIR /app

# Copia os arquivos para o container
COPY . .

# Instala as dependências
RUN yarn install

# Compila o código TypeScript
RUN yarn build

# Copia o banco de dados local para o diretório de execução
# (Se você estiver usando volume em /data, certifique-se que o .db já está no lugar certo)

# Expõe a porta do servidor Fastify
EXPOSE 4000

# Inicia a aplicação
CMD ["yarn", "start"]
