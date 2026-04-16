import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppWrapper } from './modules/app/components/AppWrapper'
import { Layout } from './modules/app/components/Layout'
import { LoadingFallback } from './modules/app/components/LoadingFallback'

// React.lazy() transforme chaque import en chunk JS séparé.
// Le code de chaque page n'est téléchargé que quand l'utilisateur
// navigue vers cette route pour la première fois.

const LoginPage = lazy(() =>
  import('./features/authentification/ui/pages/LoginPage').then((m) => ({
    default: m.LoginPage,
  })),
)

const RegisterPage = lazy(() =>
  import('./features/authentification/ui/pages/RegisterPage').then((m) => ({
    default: m.RegisterPage,
  })),
)

const TwoFactorVerificationPage = lazy(() =>
  import('./features/authentification/ui/pages/TwoFactorVerificationPage').then((m) => ({
    default: m.TwoFactorVerificationPage,
  })),
)

const UserProfilePage = lazy(() =>
  import('./features/user-profile/ui/pages/UserProfilePage').then((m) => ({
    default: m.UserProfilePage,
  })),
)

const EventListPage = lazy(() =>
  import('./features/events/ui/pages/EventListPage').then((m) => ({
    default: m.EventListPage,
  })),
)

// Priorité haute : Dashboard (composant lourd avec Recharts ~500 KB).
// En production, on peut déclencher le prefetch après login avec :
//   import("./features/dashboard/ui/pages/DashboardPage")
const DashboardPage = lazy(() =>
  import('./features/dashboard/ui/pages/DashboardPage').then((m) => ({
    default: m.DashboardPage,
  })),
)

function App() {
  return (
    <AppWrapper>
      <BrowserRouter>
        {/* Suspense enveloppe toutes les routes.
            LoadingFallback s'affiche pendant le téléchargement du chunk. */}
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/2fa-verify" element={<TwoFactorVerificationPage />} />

            <Route
              path="/profile"
              element={
                <Layout>
                  <UserProfilePage />
                </Layout>
              }
            />
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <DashboardPage />
                </Layout>
              }
            />
            <Route
              path="/events"
              element={
                <Layout>
                  <EventListPage />
                </Layout>
              }
            />

            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppWrapper>
  )
}

export default App
