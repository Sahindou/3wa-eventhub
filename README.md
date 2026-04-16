# EventHub

---

Application de gestion d'événements — monorepo pnpm avec backend Node/Express/Prisma et frontend React/Redux/Vite.

## Structure

```text
3wa-eventhub/
├── packages/
│   ├── backend/    # API Express + Prisma + PostgreSQL
│   └── frontend/  # React + Redux + Vite
├── tsconfig.base.json
└── pnpm-workspace.yaml
```

## Démarrage

```bash
pnpm install
pnpm -r dev
```

## Tests

```bash
pnpm -r test
```

## CI/CD

Le pipeline Jenkins se déclenche automatiquement à chaque push sur `main` via un webhook GitHub.

### Étapes du pipeline

1. **Install** — `pnpm install --frozen-lockfile`
2. **Tests** — `pnpm -r test`
3. **Build Docker backend** — `docker build -f packages/backend/Dockerfile -t eventhub-backend:$BUILD_NUMBER .`
4. **Build Docker frontend** — `docker build -f packages/frontend/Dockerfile -t eventhub-frontend:$BUILD_NUMBER .`

### Docker

Les deux images sont construites depuis la racine du monorepo afin d'accéder à `tsconfig.base.json` :

```bash
docker build -f packages/backend/Dockerfile -t eventhub-backend .
docker build -f packages/frontend/Dockerfile -t eventhub-frontend .
```

---
