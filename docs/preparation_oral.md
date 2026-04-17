# Préparation à l'oral — Docker & CI/CD

## Structure de la présentation (6.1)

**Introduction (1 min)**:

> "Dans ce projet, j'ai mis en place une infrastructure CI/CD complète : Jenkins dans Docker pour le pipeline principal, GitHub Actions pour l'intégration continue légère, et un webhook pour automatiser les déclenchements."

**Démonstration (3-4 min)**:

1. Montrer Jenkins dans le navigateur → build vert
2. Montrer la console output → stages visibles
3. Montrer l'onglet Actions sur GitHub → workflow vert
4. Expliquer le Jenkinsfile ouvert dans l'éditeur

**Conclusion (30 sec)**:

> "Les deux outils sont complémentaires : GitHub Actions vérifie rapidement les tests à chaque push, Jenkins fait le pipeline complet avec les outils spécifiques au projet."

---

## Questions probables du jury

### "C'est quoi le CI/CD ?"

**CI (Intégration Continue)** : à chaque modification du code, on vérifie automatiquement que rien n'est cassé (tests, compilation).

**CD (Déploiement Continu)** : si le CI passe, on déploie automatiquement en production.

> Dans ce projet, on fait du **CI uniquement** — le déploiement est optionnel dans le barème.

---

### "Quelle différence entre Jenkins et GitHub Actions ?"

| | Jenkins | GitHub Actions |
| --- | --- | --- |
| Hébergement | Mon serveur local (Docker) | Serveurs de GitHub |
| Déclenchement | Via webhook depuis GitHub | Natif à GitHub |
| Avantage | Contrôle total, outils internes (Prisma) | Aucune infra à gérer |
| Usage dans ce projet | Pipeline complet (generate, build, tests) | Vérification rapide des tests |

---

### "C'est quoi un webhook ?"

> "Un webhook, c'est une notification automatique. Quand je fais un `git push`, GitHub envoie une requête HTTP vers mon serveur Jenkins. Jenkins reçoit cette requête et déclenche automatiquement le pipeline — sans que j'aie à cliquer sur quoi que ce soit."

---

### "Pourquoi Docker pour Jenkins ?"

> "Docker permet d'isoler Jenkins dans un container. L'environnement est reproductible : n'importe qui peut relancer Jenkins avec une seule commande `docker compose up`. Le volume `/var/jenkins_home` garantit que la configuration n'est pas perdue si le container redémarre."

---

### "C'est quoi `prisma generate` et pourquoi c'est dans le pipeline ?"

> "Prisma est un ORM qui génère un client TypeScript à partir du schéma de base de données. Sans `prisma generate`, la compilation TypeScript échoue car les types `PrismaClient`, `Event`, `Organizer` n'existent pas. On le lance avant le build pour que le compilateur ait accès à tous les types."

---

### "Pourquoi les tests sont en parallèle dans Jenkins ?"

> "Le backend et le frontend sont deux packages indépendants dans un monorepo. Leurs tests n'ont aucune dépendance entre eux, donc on peut les lancer simultanément. Ça réduit le temps total du pipeline."

---

### "C'est quoi `pnpm --filter` ?"

> "Dans un monorepo pnpm, `--filter` permet de cibler un package spécifique. `pnpm --filter @eventhub/backend run test` exécute uniquement les tests du backend, sans toucher au frontend. C'est l'équivalent de faire `cd packages/backend && pnpm run test`."

---

### "Pourquoi pas `prisma migrate deploy` dans le pipeline ?"

> "Les tests sont des tests unitaires — ils n'utilisent pas de vraie base de données. `migrate deploy` sert à appliquer les migrations SQL sur une base de données réelle, ce qui serait nécessaire uniquement si on avait un stage de déploiement ou des tests d'intégration. Ici, `generate` suffit pour la compilation."

---

### "Si un test échoue, que se passe-t-il ?"

> "Le stage Tests retourne un code d'erreur non nul. Jenkins marque le build en rouge et exécute le bloc `post { failure }` qui affiche un message d'échec. Le stage Build ne s'exécute pas. Sur GitHub Actions, le workflow apparaît avec une croix rouge et GitHub envoie une notification."

---

## Schéma à montrer à l'oral

```text
git push
    │
    ├──► GitHub Actions (immédiat)
    │         └── install → tests ✅/❌
    │
    └──► Webhook → Jenkins
              └── checkout → install → prisma generate
                      → tests (parallel) → build ✅/❌
```

---

## Points à ne pas oublier

- Avoir Jenkins ouvert dans le navigateur **avant** de commencer
- Avoir l'onglet GitHub Actions ouvert sur le build vert
- Avoir le `Jenkinsfile` ouvert dans l'éditeur pour pointer les stages
- Si le jury demande une démo live : faire un petit push et montrer le déclenchement automatique
