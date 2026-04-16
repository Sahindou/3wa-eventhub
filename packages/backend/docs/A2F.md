# Double Authentification (A2F) — EvenHub

## Sommaire

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Schéma de base de données](#schéma-de-base-de-données)
4. [Flux d'activation](#flux-dactivation)
5. [Flux de connexion avec A2F](#flux-de-connexion-avec-a2f)
6. [Codes de récupération](#codes-de-récupération)
7. [Endpoints API](#endpoints-api)
8. [Détail des use cases](#détail-des-use-cases)
9. [Sécurité](#sécurité)

---

## Vue d'ensemble

La double authentification (A2F / 2FA) ajoute une couche de sécurité supplémentaire par-dessus le mot de passe. Une fois activée, l'utilisateur doit fournir un **code TOTP à 6 chiffres** (valable 30 secondes) généré par une application tierce (Google Authenticator, Authy, etc.) à chaque connexion.

En cas de perte d'accès à l'application d'authentification, des **codes de récupération** (backup codes) permettent de reprendre la main.

Librairies utilisées :
- [`otplib`](https://github.com/yeojz/otplib) — génération et vérification des codes TOTP
- [`qrcode`](https://github.com/soldair/node-qrcode) — génération du QR code en base64
- [`bcrypt`](https://github.com/kelektiv/node.bcrypt.js) — hachage des codes de récupération

---

## Architecture

La fonctionnalité suit l'architecture en couches du projet (Clean Architecture) :

```
src/
├── api/
│   ├── controllers/
│   │   └── a2f.controller.ts        ← Points d'entrée HTTP
│   ├── routes/
│   │   └── a2f.routes.ts            ← Déclaration des routes
│   └── utils/
│       └── qr-code-generator.ts     ← Génération du QR code TOTP
│
├── application/
│   └── usecases/
│       ├── VerifyOtpUseCase.ts      ← Vérification du code OTP + activation A2F
│       ├── GenerateBackupCodesUseCase.ts  ← Génération des codes de récupération
│       └── UseBackupCodeUseCase.ts  ← Utilisation d'un code de récupération
│
├── domain/
│   ├── entities/
│   │   ├── User.ts                  ← Entité User (méthode enableOtp)
│   │   └── otp-backup-code.ts      ← Entité OtpBackupCode
│   └── interfaces/
│       └── otp-backup-code-repository.interface.ts
│
└── infrastructure/
    ├── repositories/
    │   └── OtpBackupCodeRepositoryDatabase.ts  ← Accès Prisma
    └── mappers/
        └── OtpBackupCodeMapper.ts  ← Conversion Prisma ↔ Domaine
```

---

## Schéma de base de données

### Modifications sur le modèle `User`

Deux champs ont été ajoutés à la table `User` :

```prisma
model User {
  // ... champs existants ...
  otp_secret    String           // secret TOTP lié à l'utilisateur
  otp_enable    Int  @default(0) // 0 = désactivée, 1 = activée

  a2f_backup_codes A2f_backup_codes?
}
```

### Nouveau modèle `A2f_backup_codes`

```prisma
model A2f_backup_codes {
  id                   String   @id @default(uuid())
  user_id              String   @unique
  recovery_code        String[] // codes hashés (bcrypt)
  nb_code_used         Int      @default(0)
  nb_consecutive_tests Int      @default(0)
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  user  User  @relation(fields: [user_id], references: [id], onDelete: Cascade)
}
```

> `recovery_code` est un tableau PostgreSQL. Chaque entrée est le hash bcrypt d'un code en clair, jamais le code lui-même.

---

## Flux d'activation

```
Client                          Serveur
  |                                |
  |  GET /a2f/qrcode               |
  |------------------------------> |  génère un secret TOTP temporaire
  |                                |  génère l'URI TOTP (otpauth://)
  |                                |  encode l'URI en QR code (base64)
  | <------------------------------ |  { qrCode: { image, username, secret } }
  |                                |
  |  Scanner le QR code dans       |
  |  Google Authenticator          |
  |                                |
  |  POST /a2f/verify              |
  |  { token: "123456",            |
  |    secret: "<secret reçu>" }   |
  |------------------------------> |  vérifie le code TOTP (otplib)
  |                                |  si valide → user.enableOtp(secret)
  |                                |  génère automatiquement 8 backup codes
  | <------------------------------ |  { message: "A2F activée", backupCodes: [...] }
```

### Génération du QR code

```typescript
// src/api/utils/qr-code-generator.ts
export class QrCodeGenerator {
    async generate(username: string, secret: string) {
        // Génère l'URI otpauth://totp/<app>:<email>?secret=...&issuer=...
        const uri = generateURI({ strategy: "totp", issuer: this.appName, label: username, secret });
        // Encode l'URI en image base64 pour affichage côté client
        const image = await qrcode.toDataURL(uri);
        return { image, username, secret };
    }
}
```

> **Important :** le `secret` retourné par `/qrcode` est **temporaire**. Il n'est pas encore sauvegardé en base. Il est sauvegardé uniquement après vérification réussie du premier code OTP.

---

## Flux de connexion avec A2F

Une fois l'A2F activée, le frontend doit, après l'authentification par mot de passe, demander le code TOTP et appeler :

```
POST /a2f/verify
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "token": "123456"
  // pas de "secret" ici → le serveur le récupère depuis la BDD
}
```

Dans `VerifyOtpUseCase`, la logique distingue les deux cas :

```typescript
// src/application/usecases/VerifyOtpUseCase.ts

// CAS 1 — Activation (secret fourni dans le body)
if (dto.secret) {
    const result = await verify({ secret: dto.secret, token: dto.token, epochTolerance: 30, ... });
    user.enableOtp(dto.secret);  // sauvegarde  + activation l'A2F
    await this.userRepository.update(user);
    return "activation";
}

// CAS 2 — Login (secret récupéré depuis la BDD)
const storedSecret = user.getProps().otp_secret;
const result = await verify({ secret: storedSecret, token: dto.token, epochTolerance: 30, ... });
return "login";
```

---

## Codes de récupération

### Génération

8 codes sont générés au format `xxxx-xxxx-xxxx-xxxx` (hex aléatoire) à l'aide du module `crypto` natif de Node.js. Ils sont **hachés avec bcrypt** avant stockage.

```typescript
// src/application/usecases/GenerateBackupCodesUseCase.ts
const plainCodes = Array.from({ length: 8 }, () => {
    const parts = Array.from({ length: 4 }, () => randomBytes(2).toString("hex"));
    return parts.join("-"); // ex: "a3f1-cc02-9b4e-17d8"
});

// Hash de chaque code (bcrypt, 10 rounds)
const hashedCodes = await Promise.all(
    plainCodes.map((code) => bcrypt.hash(code, 10))
);
```

> Les codes en clair ne sont **retournés qu'une seule fois** à l'utilisateur lors de l'activation. Ils ne sont jamais stockés en clair.

Si des codes existent déjà (appel à `/backup-codes/generate` pour régénérer), les anciens codes sont **écrasés** et le compteur `nb_code_used` est remis à zéro.

### Utilisation d'un code de récupération

```
POST /a2f/backup-codes/use
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "code": "a3f1-cc02-9b4e-17d8"
}
```

Le use case compare le code soumis à chaque hash stocké via `bcrypt.compare`. Si un hash correspond :

- le code est **supprimé** du tableau (usage unique)
- le compteur `nb_code_used` est incrémenté
- le compteur `nb_consecutive_tests` est remis à zéro

Si le code est invalide :
- `nb_consecutive_tests` est incrémenté
- après **5 tentatives consécutives** échouées, le compte est bloqué

```typescript
// src/application/usecases/UseBackupCodeUseCase.ts
if (record.props.nb_consecutive_tests >= MAX_CONSECUTIVE_ATTEMPTS) {
    throw new Error("Trop de tentatives échouées. Contactez le support.");
}
```

---

## Endpoints API

Toutes les routes sont protégées par le middleware `authMiddleware` (JWT requis).

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET`   | `/a2f/qrcode` | Génère un secret TOTP et retourne le QR code en base64 |
| `POST`  | `/a2f/verify` | Vérifie un code OTP (activation ou connexion) |
| `POST`  | `/a2f/backup-codes/generate` | (Ré)génère 8 codes de récupération |
| `POST`  | `/a2f/backup-codes/use` | Utilise un code de récupération |

### `GET /a2f/qrcode`

**Réponse 200 :**
```json
{
  "qrCode": {
    "image": "data:image/png;base64,iVBORw0KGgo...",
    "username": "user@example.com",
    "secret": "JBSWY3DPEHPK3PXP"
  }
}
```

### `POST /a2f/verify`

**Body (activation) :**
```json
{
  "token": "123456",
  "secret": "JBSWY3DPEHPK3PXP"
}
```

**Body (login) :**
```json
{
  "token": "123456"
}
```

**Réponse 200 (activation) :**
```json
{
  "message": "A2F activée avec succès",
  "backupCodes": [
    "a3f1-cc02-9b4e-17d8",
    "f2c0-1a3b-88e4-5d9f",
    "..."
  ]
}
```

### `POST /a2f/backup-codes/use`

**Body :**
```json
{
  "code": "a3f1-cc02-9b4e-17d8"
}
```

**Réponse 200 :**
```json
{
  "message": "Code de récupération valide. Accès accordé."
}
```

---

## Détail des use cases

### `VerifyOtpUseCase`

| Paramètre | Présent | Comportement |
|-----------|---------|--------------|
| `secret`  | Oui     | Mode **activation** : vérifie avec le secret fourni, sauvegarde en BDD, retourne `"activation"` |
| `secret`  | Non     | Mode **login** : récupère le secret depuis la BDD, vérifie, retourne `"login"` |

La tolérance TOTP est de **±30 secondes** (`epochTolerance: 30`) pour compenser les légères désynchronisations d'horloge.

### `GenerateBackupCodesUseCase`

- Vérifie que l'A2F est bien activée (`otp_enable === 1`) avant de générer des codes
- Crée ou **met à jour** l'enregistrement `A2f_backup_codes` en base

### `UseBackupCodeUseCase`

- Vérifie le seuil de tentatives consécutives (max 5)
- Parcourt tous les hashes pour trouver une correspondance (bcrypt)
- Code à **usage unique** : supprimé du tableau après utilisation

---

## Sécurité

| Mesure | Détail |
|--------|--------|
| Secret TOTP | Jamais retourné après l'activation, stocké en BDD uniquement |
| Backup codes | Hachés avec bcrypt (10 rounds) avant stockage, affichés une seule fois |
| Usage unique | Chaque backup code est supprimé du tableau après utilisation |
| Rate limiting applicatif | Blocage après 5 tentatives consécutives échouées sur les backup codes |
| Cascade delete | La suppression d'un `User` supprime automatiquement ses `A2f_backup_codes` |
| Middleware JWT | Toutes les routes A2F nécessitent un token valide |
