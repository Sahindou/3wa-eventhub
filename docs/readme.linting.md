# Qualité de Code — Husky, Prettier, ESLint, Commitlint

## Vue d'ensemble

```bash
pnpm lint            → ESLint sur tous les packages
pnpm format          → Prettier (écriture)
pnpm format --check  → Prettier (vérification sans écrire)
```

---

## 1. Prettier — Formatage automatique

**Config** : `.prettierrc`

```json
{
  "semi": false,          // Pas de point-virgule en fin de ligne
  "singleQuote": true,    // Guillemets simples au lieu de doubles
  "trailingComma": "all", // Virgule après le dernier élément (objets, params...)
  "printWidth": 100,      // Retour à la ligne à 100 caractères
  "tabWidth": 2           // Indentation de 2 espaces
}
```

**Cibles** : tous les fichiers `*.ts`, `*.tsx`, `*.json` dans `packages/`

---

## 2. ESLint — Analyse statique du code

ESLint est configuré **uniquement sur le frontend**.

**Config** : `packages/frontend/eslint.config.js`

| Plugin | Rôle |
| --- | --- |
| `@eslint/js` | Règles JS de base |
| `typescript-eslint` | Règles TypeScript |
| `eslint-plugin-react-hooks` | Vérifie les règles des hooks React |
| `eslint-plugin-react-refresh` | Compatible Vite HMR |

**Cibles** : fichiers `**/*.{ts,tsx}` (le dossier `dist` est ignoré)

> Le backend n'a pas d'ESLint configuré.

---

## 3. Husky — Git Hooks

**Version** : `^9.0.0` — installé à la racine, activé par `pnpm prepare`.

Husky intercepte automatiquement deux événements Git :

### Hook `pre-commit` → `.husky/pre-commit`

S'exécute **avant chaque `git commit`**. Si l'un des checks échoue, le commit est bloqué.

```bash
pnpm lint            # ESLint sur le frontend
pnpm format --check  # Vérifie que le code est bien formaté avec Prettier
```

> Si Prettier détecte un fichier mal formaté, lancer `pnpm format` pour corriger puis recommiter.

### Hook `commit-msg` → `.husky/commit-msg`

S'exécute **après la saisie du message de commit**. Valide le format du message.

```bash
pnpm commitlint --edit "$1"
```

---

## 4. Commitlint — Format des messages de commit

**Config** : `commitlint.config.js` — étend `@commitlint/config-conventional`

Les messages de commit doivent suivre la convention **Conventional Commits** :

```txt
<type>(<scope>): <description>
```

### Types valides

| Type | Usage |
| --- | --- |
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `chore` | Tâche de maintenance (deps, config...) |
| `docs` | Documentation |
| `refactor` | Refacto sans changement fonctionnel |
| `test` | Ajout ou modification de tests |
| `style` | Formatage, espaces... (pas de logique) |
| `ci` | Fichiers CI/CD |
| `perf` | Amélioration de performance |
| `revert` | Annulation d'un commit précédent |

### Exemples valides

```bash
git commit -m "feat(auth): add JWT refresh token"
git commit -m "fix(api): handle 404 on missing event"
git commit -m "chore: update dependencies"
```

### Exemples invalides (bloqués par commitlint)

```bash
git commit -m "update stuff"       # pas de type
git commit -m "Fix: corrected bug" # majuscule après le type
```

---

## 5. Mise en place dans un nouveau projet

### Prérequis

- Node.js >= 20
- pnpm (ou npm/yarn, adapter les commandes)
- Un repo git initialisé (`git init`)

### Étape 1 — Installer les dépendances

```bash
pnpm add -D prettier husky @commitlint/cli @commitlint/config-conventional
```

Pour ESLint sur un projet React + TypeScript :

```bash
pnpm add -D eslint typescript-eslint @eslint/js globals eslint-plugin-react-hooks eslint-plugin-react-refresh
```

### Étape 2 — Configurer Prettier

Créer `.prettierrc` à la racine :

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

Ajouter les scripts dans `package.json` :

```json
"scripts": {
  "format": "prettier --write \"src/**/*.{ts,tsx,json}\"",
  "format:check": "prettier --check \"src/**/*.{ts,tsx,json}\""
}
```

### Étape 3 — Configurer ESLint (React + TypeScript)

Créer `eslint.config.js` à la racine :

```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
```

Ajouter le script lint dans `package.json` :

```json
"scripts": {
  "lint": "eslint ."
}
```

### Étape 4 — Configurer Commitlint

Créer `commitlint.config.js` à la racine :

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
}
```

### Étape 5 — Initialiser Husky

```bash
pnpm husky init
```

> Cette commande crée le dossier `.husky/` et ajoute automatiquement `"prepare": "husky"` dans `package.json`.

### Étape 6 — Créer les hooks Git

**Hook pre-commit** — `.husky/pre-commit` :

```bash
pnpm lint
pnpm format:check
```

**Hook commit-msg** — `.husky/commit-msg` :

```bash
pnpm commitlint --edit "$1"
```

> Vérifier que les fichiers hooks sont exécutables : `chmod +x .husky/pre-commit .husky/commit-msg`

### Étape 7 — Vérifier l'installation

```bash
# Simuler un commit valide
git add .
git commit -m "chore: setup linting and formatting"

# Tester commitlint manuellement
echo "bad message" | pnpm commitlint

# Tester prettier manuellement
pnpm format:check
```

### Récapitulatif des fichiers créés

```txt
projet/
├── .husky/
│   ├── pre-commit     ← pnpm lint + pnpm format:check
│   └── commit-msg     ← pnpm commitlint --edit
├── .prettierrc        ← règles de formatage
├── eslint.config.js   ← règles d'analyse statique
└── commitlint.config.js ← convention des messages de commit
```

---

## Récapitulatif — Ce qui se passe quand tu commites

```txt
git commit -m "feat: ..."
        │
        ├─ pre-commit hook
        │     ├─ pnpm lint            (ESLint frontend)
        │     └─ pnpm format --check  (Prettier)
        │
        └─ commit-msg hook
              └─ commitlint → vérifie le format du message
```
