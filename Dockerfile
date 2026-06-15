# ==========================================
# Fase 1: Builder (Compilação)
# ==========================================
FROM node:22-slim AS builder

# Instala o OpenSSL (necessário para o Prisma funcionar no Linux Debian)
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Copia os arquivos de dependência primeiro (aproveita o cache do Docker)
COPY package*.json ./
COPY prisma ./prisma/

# Instala TODAS as dependências (incluindo as de desenvolvimento para fazer o build)
RUN npm install

# Gera o Prisma Client
RUN npx prisma generate

# Copia o resto do código e faz o build (tsup)
COPY . .
RUN npm run build

# ==========================================
# Fase 2: Runner (Produção)
# ==========================================
FROM node:22-slim AS runner

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Define ambiente de produção
ENV NODE_ENV="production"

# Copia apenas os arquivos estritamente necessários da Fase 1
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Expõe a porta que o Fastify vai usar
EXPOSE 3333

# Comando para iniciar a aplicação
CMD ["npm", "run", "start"]
