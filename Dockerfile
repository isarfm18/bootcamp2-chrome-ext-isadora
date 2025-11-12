# Dockerfile
FROM mcr.microsoft.com/playwright:v1.46.0-jammy

WORKDIR /app

# Copia package.json primeiro para cache de layer
COPY package*.json ./

RUN npm ci --silent

# (imagem base costuma já ter navegadores, mas garantir)
RUN npx playwright install --with-deps chromium

# Copia tudo
COPY . .

# Build da extensão (gera dist/)
RUN node scripts/build-extension.mjs

# Comando default executa os testes
CMD ["npm", "run", "test:e2e"]
