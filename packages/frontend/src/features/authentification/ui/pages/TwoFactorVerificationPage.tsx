import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { verify2FAAtLogin, applyBackupCodeAtLogin } from '../../store/authThunks'
import {
  selectIsAuthenticated,
  selectIsLoading,
  selectError,
  selectRequires2FAVerification,
} from '../../store/authSelectors'
import { clearError } from '../../store/authSlice'
import { logoutUser } from '../../store/authThunks'
import type { AppDispatch } from '../../../../modules/store/store'

type Mode = 'totp' | 'backup'

export const TwoFactorVerificationPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isLoading = useSelector(selectIsLoading)
  const error = useSelector(selectError)
  const requires2FA = useSelector(selectRequires2FAVerification)

  const [mode, setMode] = useState<Mode>('totp')
  const [totpCode, setTotpCode] = useState('')
  const [backupCode, setBackupCode] = useState('')

  // Rediriger si la 2FA n'est pas requise (accès direct à cette page sans login)
  useEffect(() => {
    if (!requires2FA && !isAuthenticated) {
      navigate('/login')
    }
  }, [requires2FA, isAuthenticated, navigate])

  // Rediriger vers le profil une fois authentifié
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const handleTOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (totpCode.trim().length === 6) {
      dispatch(verify2FAAtLogin(totpCode.trim()))
    }
  }

  const handleBackupSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (backupCode.trim()) {
      dispatch(applyBackupCodeAtLogin(backupCode.trim()))
    }
  }

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/login')
  }

  const switchMode = (newMode: Mode) => {
    setMode(newMode)
    setTotpCode('')
    setBackupCode('')
    dispatch(clearError())
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          {/* Header */}
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24">
                <path
                  strokeWidth="1.5"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-xl font-semibold text-slate-800 text-center mb-1">
            Double authentification
          </h1>
          <p className="text-sm text-slate-500 text-center mb-6">
            {mode === 'totp'
              ? "Entrez le code de votre application d'authentification"
              : "Entrez l'un de vos codes de récupération"}
          </p>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-5">
            <button
              type="button"
              onClick={() => switchMode('totp')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                mode === 'totp'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Code d'authentification
            </button>
            <button
              type="button"
              onClick={() => switchMode('backup')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                mode === 'backup'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Code de secours
            </button>
          </div>

          {/* Erreur */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Formulaire TOTP */}
          {mode === 'totp' && (
            <form onSubmit={handleTOTPSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Code à 6 chiffres
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                  disabled={isLoading}
                  autoFocus
                  className="w-full h-12 px-4 text-center text-2xl font-mono tracking-[0.5em] border border-gray-200 rounded-lg bg-slate-50 text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 disabled:opacity-60"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || totpCode.length !== 6}
                className="w-full h-12 bg-blue-500 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isLoading ? 'Vérification...' : 'Vérifier'}
              </button>
            </form>
          )}

          {/* Formulaire code de secours */}
          {mode === 'backup' && (
            <form onSubmit={handleBackupSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Code de récupération
                </label>
                <input
                  type="text"
                  placeholder="xxxxxxxx"
                  value={backupCode}
                  onChange={(e) => setBackupCode(e.target.value)}
                  disabled={isLoading}
                  autoFocus
                  className="w-full h-12 px-4 text-center font-mono tracking-wider border border-gray-200 rounded-lg bg-slate-50 text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 disabled:opacity-60"
                />
                <p className="text-xs text-slate-400 mt-1.5">
                  Chaque code de secours n'est utilisable qu'une seule fois.
                </p>
              </div>
              <button
                type="submit"
                disabled={isLoading || !backupCode.trim()}
                className="w-full h-12 bg-blue-500 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isLoading ? 'Vérification...' : 'Utiliser ce code'}
              </button>
            </form>
          )}

          {/* Déconnexion */}
          <div className="mt-5 pt-5 border-t border-gray-100 text-center">
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-slate-400 hover:text-red-500 transition-colors duration-200"
            >
              Utiliser un autre compte
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
