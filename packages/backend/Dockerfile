FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json ./
RUN pnpm install

COPY prisma ./prisma
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src

RUN pnpm run build

EXPOSE 8000

CMD ["node", "dist/api/app.js"]
