FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

# tsconfig.base.json est à la racine, référencé par ../../tsconfig.base.json depuis packages/frontend
COPY tsconfig.base.json ./

WORKDIR /app/packages/frontend

COPY packages/frontend/package.json ./
RUN pnpm install --shamefully-hoist
RUN pnpm rebuild esbuild

COPY packages/frontend/ ./
RUN pnpm run build

FROM nginx:alpine

COPY --from=builder /app/packages/frontend/dist /usr/share/nginx/html
COPY packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
