# Support présentation

## Slide 1 : Page de titre (30 sec)

## EventHub

## Feature : Gestion des Utilisateurs

**Par : Sahindou**
**Date : 19/12/2025**

---

## Slide 2 : Objectifs de la feature

### Contexte

EventHub est une application web de gestion d'événements nécessitant un système d'authentification et de gestion de profils utilisateurs.

### Objectifs de la feature Gestion des Utilisateurs

**Inscription d'un nouvel utilisateur**

- Formulaire avec username, email, password
- Validation des données (format email, force du mot de passe)
- Vérification de l'unicité de l'email

**Connexion d'un utilisateur existant**

- Authentification par email/password
- Gestion des erreurs (credentials invalides, utilisateur inexistant)
- Redirection automatique vers le profil

**Formulaire de profil**

- Affichage des informations utilisateur
- Modification du username et email
- Déconnexion

### Technologies utilisées

- **Frontend** : React 19.2, TypeScript 5.9
- **State Management** : Redux Toolkit 2.6
- **Routing** : React Router DOM 7.11
- **UI** : Material-UI + Tailwind CSS
- **Testing** : Jest + React Testing Library

---

## Slide 3 : Architecture du projet

### Schéma de l'architecture en couches

```bash
┌─────────────────────────────────────────┐
│           UI Layer (React)              │
│  LoginPage / RegisterPage / ProfilePage │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      State Management (Redux)           │
│    Slices + Thunks + Selectors          │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│       Store (In-Memory Database)        │
│      Simulated User Database            │
└─────────────────────────────────────────┘
```

### Organisation Frontend

```bash
src/
├── features/
│   ├── authentification/
│   │   ├── store/          # Redux logic
│   │   │   ├── authSlice.ts      (state + reducers)
│   │   │   ├── authThunks.ts     (async actions)
│   │   │   └── authSelectors.ts  (memoized selectors)
│   │   ├── ui/             # Components
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── RegisterPage.tsx
│   │   │   └── components/
│   │   │       └── Form.tsx
│   │   └── __tests__/      # Tests
│   └── user-profile/
│       ├── store/
│       ├── ui/
│       └── __tests__/
└── modules/
    ├── app/
    ├── store/              # Redux store config
    └── testing/            # Test utilities
```

### Justification des choix architecturaux

1. **Feature-based / domaine structure**
2. **Séparation Store/UI** : Logique métier isolée dans Redux, composants focalisés sur l'UI
3. **Tests colocalisés** : Tests à côté du code testé pour faciliter la maintenance
4. **Redux Toolkit** : Réduit le boilerplate, intègre Immer pour l'immutabilité

---

## Slide 4 : Application des principes SOLID

### 1. Single Responsibility Principle (SRP)

**Chaque module a une seule responsabilité**

```typescript
// authSlice.ts - Gère UNIQUEMENT l'état d'authentification
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    // ...
  }
});

// authThunks.ts - Gère UNIQUEMENT la logique asynchrone
export const loginUser = createAsyncThunk(/* ... */);
```

### 2. Open/Closed Principle (OCP)

**Composant Form réutilisable et extensible**

```typescript
// Form.tsx - Ouvert à l'extension, fermé à la modification
interface FormProps {
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  disabled?: boolean;
  submitText?: string;
}

export const Form = ({ title, children, onSubmit, ... }) => (
  <form onSubmit={onSubmit}>
    {/* Structure générique */}
    {children}  {/* Extension par composition */}
  </form>
);
```

### 3. Dependency Inversion Principle (DIP)

**Redux Thunks dépendent d'abstractions**

```typescript
// store/dependencies.ts - Injection de dépendances
export interface Dependencies {
  // Prêt pour injection de services (API, storage, etc.)
}

// store.ts - Configuration avec dépendances
const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: { extraArgument: dependencies }
    })
});
```

### 4. Interface Segregation Principle (ISP)

**Sélecteurs spécifiques pour chaque besoin**

```typescript
// authSelectors.ts - Sélecteurs ciblés
export const selectUser = (state: AppState) => state.auth.user;
export const selectIsAuthenticated = (state: AppState) =>
  state.auth.isAuthenticated;
export const selectAuthError = (state: AppState) => state.auth.error;
// Les composants n'importent que ce dont ils ont besoin
```

---

## Slide 5 : Frontend - Composants React

### Composant d'inscription : RegisterPage.tsx

**Validation du formulaire**:

```typescript
// Désactivation du bouton tant que tous les champs ne sont pas remplis
const isFormValid = formData.username && formData.email && formData.password;

<Button type="submit" disabled={!isFormValid || isLoading}>
  {isLoading ? 'Inscription...' : 'S\'inscrire'}
</Button>
```

**Validation côté thunk** ([authThunks.ts:39-54](src/features/authentification/store/authThunks.ts#L39-L54))

- Email format valide (regex)
- Password ≥ 8 caractères
- Au moins 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
- Email unique dans la base

### Composant de connexion : LoginPage.tsx

**Redirection automatique après connexion**
```typescript
useEffect(() => {
  if (isAuthenticated) {
    navigate("/profile");
  }
}, [isAuthenticated, navigate]);
```

### Gestion des états (loading, error, success)

**LoginPage.tsx**
```typescript
const isLoading = useSelector(selectAuthLoading);
const error = useSelector(selectAuthError);

{error && (
  <Alert severity="error" sx={{ mb: 2 }}>
    {error}
  </Alert>
)}

{isLoading && <CircularProgress />}
```

### Captures d'écran de l'interface

**[Insérer ici les captures d'écran]**

- Formulaire de connexion
- Formulaire d'inscription avec validation
- Page de profil en mode lecture
- Page de profil en mode édition

---

## Slide 6 : Frontend - Custom Hooks (Presenters) (1 min)

### Séparation logique métier / UI

**Pattern utilisé** : Redux Hooks au lieu de custom hooks

L'application utilise les hooks Redux directement dans les composants :
- `useDispatch<AppDispatch>()` - Pour déclencher les actions
- `useSelector(selector)` - Pour lire l'état
- Hooks React standard - `useState`, `useEffect`, `useNavigate`

### Exemple : LoginPage.tsx (extraits)

```typescript
const LoginPage = () => {
  // État local UI
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  // État global Redux (lecture)
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Actions Redux (écriture)
  const dispatch = useDispatch<AppDispatch>();

  // Logique métier
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  // Nettoyage des erreurs
  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, [dispatch]);

  return <Form>{/* ... */}</Form>;
};
```

### Avantages de ce pattern

✅ **Simplicité** : Pas de couche d'abstraction supplémentaire
✅ **Typage fort** : TypeScript garantit la cohérence
✅ **Testabilité** : Tests unitaires avec mock du store Redux
✅ **Flexibilité** : Facile d'extraire en custom hook si besoin

---

## Slide 7 : Tests unitaires (1 min)

### Tests Frontend : tests des composants

**Configuration Jest** ([jest.config.js](jest.config.js))
- Environnement : jsdom
- Preset : ts-jest
- Setup : @testing-library/jest-dom

### Exemple de test - LoginPage ([login.test.tsx:98-125](src/features/authentification/__tests__/login.test.tsx#L98-L125))

```typescript
test("should dispatch loginUser action on form submit", async () => {
  // Arrange : Pré-remplir le store avec un utilisateur test
  const testUser = {
    id: "1",
    username: "testuser",
    email: "test@example.com",
    password: "Password123!",
  };
  const store = createTestStore();
  store.dispatch(addUserToDb(testUser));

  const { getByLabelText, getByRole } = render(
    <Provider store={store}>
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    </Provider>
  );

  // Act : Remplir le formulaire et soumettre
  await userEvent.type(getByLabelText(/email/i), testUser.email);
  await userEvent.type(getByLabelText(/mot de passe/i), testUser.password);
  await userEvent.click(getByRole("button", { name: /se connecter/i }));

  // Assert : Vérifier l'état Redux après login
  await waitFor(() => {
    const state = store.getState();
    expect(state.auth.isAuthenticated).toBe(true);
    expect(state.auth.user).toEqual({
      id: testUser.id,
      username: testUser.username,
      email: testUser.email,
    });
  });
});
```

### Explication des tests

**Tests LoginPage** ([login.test.tsx](src/features/authentification/__tests__/login.test.tsx))
1. Affichage des inputs ✅
2. Validation email invalide ✅
3. Bouton désactivé si formulaire incomplet ✅
4. Dispatch loginUser au submit ✅
5. Affichage erreur credentials invalides ✅
6. Affichage erreur utilisateur inexistant ✅

**Tests RegisterPage** ([register.test.tsx](src/features/authentification/__tests__/register.test.tsx))
1. Affichage de tous les inputs ✅
2. Bouton désactivé si formulaire incomplet ✅
3. Bouton activé quand tous les champs remplis ✅
4. Dispatch registerUser au submit ✅
5. Erreur password invalide ✅
6. Erreur email déjà utilisé ✅

### Résultat des tests

**[Insérer capture d'écran du terminal avec `npm test`]**

```bash
PASS  src/features/authentification/__tests__/login.test.tsx
PASS  src/features/authentification/__tests__/register.test.tsx

Test Suites: 2 passed, 2 total
Tests:       13 passed, 13 total
Snapshots:   0 total
Time:        X.XXXs
```

---

## Slide 8 : Démonstration en direct (3 min)

### Lancer l'application en local

```bash
npm install
npm run dev
```

### Démonstration live

#### 1. **Formulaire de connexion** (1 min)
- Afficher la page `/login`
- Montrer les champs email et password
- **Interaction** : Tenter de soumettre avec formulaire vide
  - ➡️ Bouton désactivé (validation côté client)
- **Interaction** : Remplir uniquement l'email
  - ➡️ Bouton toujours désactivé

#### 2. **Affichage d'un message d'erreur** (30 sec)
- Remplir email + mauvais password
- Soumettre le formulaire
- ➡️ **Affichage d'une alerte rouge** : "Mot de passe incorrect"

#### 3. **Formulaire de création de compte** (1 min 30)
- Cliquer sur "Pas encore de compte ? Inscrivez-vous"
- Afficher le formulaire d'inscription (username, email, password)
- **Interaction** : Remplir progressivement
  - Montrer que le bouton reste désactivé tant que tous les champs ne sont pas remplis
  - ➡️ **Bouton devient actif** quand formulaire complet
- Soumettre le formulaire
- ➡️ **Redirection automatique vers `/profile`**
- Montrer le profil créé avec les informations saisies

#### 4. **Bonus : Edition du profil** (30 sec si temps disponible)
- Cliquer sur "Modifier le profil"
- Changer le username
- Cliquer sur "Enregistrer"
- ➡️ Profil mis à jour

---

## Slide 9 : Difficultés et solutions

### Problème 1 : Synchronisation du state Redux et du state local

**Difficulté** : Le profil utilisateur doit être synchronisé entre Redux (source de vérité) et le state local du formulaire (édition).

**Solution appliquée** ([UserProfilePage.tsx:27-31](src/features/user-profile/ui/pages/UserProfilePage.tsx#L27-L31))

```typescript
// Synchroniser les données du formulaire avec le profil Redux
useEffect(() => {
  if (profile) {
    setFormData({ username: profile.username, email: profile.email });
  }
}, [profile]);
```

**Apprentissage** : Utiliser `useEffect` pour synchroniser les états dérivés, tout en gardant une seule source de vérité (Redux).

---

### Problème 2 : Validation complexe des mots de passe

**Difficulté** : Implémenter une validation robuste (longueur, majuscules, minuscules, chiffres, caractères spéciaux) tout en fournissant des messages d'erreur clairs.

**Solution appliquée** ([authThunks.ts:44-54](src/features/authentification/store/authThunks.ts#L44-L54))

```typescript
// Validation regex avec messages spécifiques
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

if (!passwordRegex.test(password)) {
  return rejectWithValue(
    "Le mot de passe doit contenir au moins 8 caractères, " +
    "une majuscule, une minuscule, un chiffre et un caractère spécial."
  );
}
```

**Apprentissage** : Les regex complexes sont puissantes mais difficiles à maintenir. Documenter leur logique est essentiel.

---

### Apprentissages clés de la semaine

1. **Redux Toolkit simplifie énormément la gestion d'état** : Moins de boilerplate, Immer intégré
2. **Testing Library encourage les tests orientés utilisateur** : Tester ce que l'utilisateur voit/fait
3. **TypeScript évite de nombreux bugs** : Typage strict du store, des actions, des props
4. **Feature-based architecture améliore la scalabilité** : Facile d'ajouter de nouvelles features
5. **La validation côté client ET côté logique métier est importante** : UX + sécurité

---

## Slide 10 : Conclusion (30 sec)

### Résumé

**Feature complète** : Inscription, Connexion, Profil
**Architecture solide** : SOLID principles, Redux Toolkit, Feature-based
**Tests robustes** : 13 tests unitaires, couverture des cas critiques
**UX soignée** : Validation temps réel, messages d'erreur clairs, loading states

### Prochaines étapes

- 🔐 Intégration avec une vraie API backend
- 🔒 Tokens JWT pour l'authentification
- 📧 Confirmation par email à l'inscription
- 🎨 Amélioration de l'accessibilité (ARIA labels)

### Merci pour votre attention !

**Questions ?**
