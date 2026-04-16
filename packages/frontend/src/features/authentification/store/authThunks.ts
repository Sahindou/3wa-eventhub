import type { AppDispatch, AppGetState } from '../../../modules/store/store'
import type { Dependencies } from '../../../modules/store/dependencies'
import { syncProfileFromAuth } from '../../user-profile/store/userThunks'
import {
  registerStart,
  registerSuccess,
  registerFailure,
  loginStart,
  loginSuccess,
  loginFailure,
  loginPending,
  require2FAVerification,
  loginComplete,
  twoFAVerifyFailure,
  authRestored,
  logout,
} from './authSlice'
import axios from 'axios'

// validation de helpers
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const isValidPassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre')
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial')
  }

  return { valid: errors.length === 0, errors }
}

// un thunk pour l'inscription
export const registerUser = (username: string, email: string, password: string) => {
  return async (dispatch: AppDispatch, _getState: unknown, extra: Dependencies) => {
    dispatch(registerStart())

    try {
      // Validations côté client
      if (!username || !email || !password) {
        throw new Error('Tous les champs sont obligatoires')
      }

      if (!isValidEmail(email)) {
        throw new Error('Email invalide')
      }

      const passwordValidation = isValidPassword(password)
      if (!passwordValidation.valid) {
        throw new Error(passwordValidation.errors.join(', '))
      }

      // Appel API
      const data = await extra.authApi.register(username, email, password)

      // Connecter l'utilisateur
      dispatch(registerSuccess(data.user))
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(registerFailure(error.response?.data?.message ?? "Erreur lors de l'inscription"))
      } else {
        dispatch(registerFailure(error instanceof Error ? error.message : 'Erreur inconnue'))
      }
    }
  }
}

// un thunk pour restaurer la session depuis le localStorage au démarrage
export const restoreAuth = () => {
  return async (dispatch: AppDispatch, _getState: unknown, extra: Dependencies) => {
    try {
      // Si l'utilisateur est connecté, cette requête réussit
      const profile = (await extra.profileApi.getProfile()) as {
        data?: { id?: string; username?: string; email?: string }
      }

      dispatch(
        loginSuccess({
          id: profile.data?.id ?? '',
          username: profile.data?.username ?? '',
          email: profile.data?.email ?? '',
        }),
      )
    } catch {
      // Cookie absent ou expiré : l'utilisateur n'est pas connecté
      console.error('Utilisateur non connecté.')
    } finally {
      dispatch(authRestored())
    }
  }
}

// un thunk pour la connexion
export const loginUser = (email: string, password: string) => {
  return async (dispatch: AppDispatch, getState: AppGetState, extra: Dependencies) => {
    dispatch(loginStart())

    try {
      // Validation côté client
      if (!email || !password) throw new Error('Tous les champs sont requis')

      // Appel API
      const data = await extra.authApi.login(email, password)

      // Marquer l'utilisateur comme en attente (pas encore authentifié)
      dispatch(loginPending(data.data.user))

      // Récupérer le profil pour savoir si la 2FA est activée
      await dispatch(syncProfileFromAuth())

      const { userProfile } = getState()
      if (userProfile.is2FAEnabled) {
        dispatch(require2FAVerification())
      } else {
        dispatch(loginComplete())
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(loginFailure(error.response?.data?.message ?? 'Email ou mot de passe incorrect'))
      } else {
        dispatch(loginFailure(error instanceof Error ? error.message : 'Erreur inconnue'))
      }
    }
  }
}

// Thunk pour vérifier le code TOTP lors de la connexion
export const verify2FAAtLogin = (token: string) => {
  return async (dispatch: AppDispatch, _getState: AppGetState, extra: Dependencies) => {
    dispatch(loginStart())
    try {
      await extra.authApi.verifyTOTPLogin(token)
      dispatch(loginComplete())
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(twoFAVerifyFailure(error.response?.data?.message ?? 'Code invalide'))
      } else {
        dispatch(twoFAVerifyFailure(error instanceof Error ? error.message : 'Erreur inconnue'))
      }
    }
  }
}

// Thunk pour utiliser un code de secours lors de la connexion
export const applyBackupCodeAtLogin = (code: string) => {
  return async (dispatch: AppDispatch, _getState: AppGetState, extra: Dependencies) => {
    dispatch(loginStart())
    try {
      await extra.authApi.useBackupCode(code)
      dispatch(loginComplete())
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(twoFAVerifyFailure(error.response?.data?.message ?? 'Code de secours invalide'))
      } else {
        dispatch(twoFAVerifyFailure(error instanceof Error ? error.message : 'Erreur inconnue'))
      }
    }
  }
}

// Thunk pour la déconnexion : supprime le cookie côté backend puis nettoie le store
export const logoutUser = () => {
  return async (dispatch: AppDispatch, _getState: AppGetState, extra: Dependencies) => {
    try {
      await extra.authApi.logout() // demande au backend de clearCookie("token")
    } catch {
      // même si l'appel échoue, on déconnecte localement
    } finally {
      dispatch(logout())
    }
  }
}
