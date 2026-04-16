FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

# tsconfig.base.json est à la racine, référencé par ../../tsconfig.base.json depuis packages/backend
COPY tsconfig.base.json ./

WORKDIR /app/packages/backend

COPY packages/backend/package.json ./
RUN pnpm install

COPY packages/backend/prisma ./prisma
RUN npx prisma generate

COPY packages/backend/tsconfig.json ./
COPY packages/backend/src ./src

RUN pnpm run build

EXPOSE 8000

CMD ["node", "dist/api/app.js"]
