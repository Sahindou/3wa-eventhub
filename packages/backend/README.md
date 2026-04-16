# EvenHub API

API REST de gestion de billetterie événementielle.

## Prérequis

- Node.js >= 18
- PostgreSQL
- Docker (optionnel)

## Installation

```bash
# Cloner le projet
git clone <url-du-repo>
cd evenhub-dev2

# Installer les dépendances
npm install

# Lancer PostgreSQL avec Docker
docker-compose up -d

# Appliquer les migrations
npx prisma migrate dev

# Générer le client Prisma
npx prisma generate

# Reset la base de données (supprime toutes les données + migrations)
npx prisma migrate reset --force
```

## Variables d'environnement

Créer un fichier `.env` à la racine :

```env
PORT=8000
NODE_ENV=development
DATABASE_URL=postgresql://event_user:event_password@localhost:5432/db_eventhub
JWT_SECRET=votre_secret_jwt
```

## Commandes

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lancer en mode développement |
| `npm run build` | Compiler le TypeScript |
| `npm run start` | Lancer la version compilée |
| `npm run test` | Exécuter les tests |
| `npm run swagger:generate` | Générer la documentation Swagger |

## Documentation API

Swagger UI disponible sur : `http://localhost:8000/api-docs`

## Structure du projet

```bash
src/
├── api/           # Controllers, routes, middlewares
├── application/   # Use cases (logique métier)
├── domain/        # Entités et interfaces
└── infrastructure/# Repositories, mappers, services
```
