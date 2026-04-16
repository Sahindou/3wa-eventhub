import type { AppDispatch, AppGetState } from '../../../modules/store/store'
import type { Dependencies } from '../../../modules/store/dependencies'
import axios from 'axios'
import {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  setup2FAStart,
  setup2FASuccess,
  setup2FAFailure,
  verify2FAStart,
  verify2FASuccess,
  verify2FAFailure,
  type UserProfile,
} from './userSlice'

// Thunk pour synchroniser le profil après login (récupère depuis l'API)
export const syncProfileFromAuth = () => {
  return async (dispatch: AppDispatch, getState: AppGetState, extra: Dependencies) => {
    const { auth } = getState()
    if (!auth.user) return

    dispatch(fetchProfileStart())

    try {
      const profile = await extra.profileApi.getProfile()
      dispatch(fetchProfileSuccess(profile))
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(
          fetchProfileFailure(
            error.response?.data?.message ?? 'Erreur lors du chargement du profil',
          ),
        )
      } else {
        dispatch(fetchProfileFailure(error instanceof Error ? error.message : 'Erreur inconnue'))
      }
    }
  }
}

// Thunk pour mettre à jour le profil
export const updateUserProfile = (updates: { data: Partial<UserProfile['data']> }) => {
  return async (dispatch: AppDispatch, getState: AppGetState, extra: Dependencies) => {
    const { userProfile, auth } = getState()

    if (!userProfile.profile || !auth.user) {
      dispatch(updateProfileFailure('Aucun profil à mettre à jour'))
      return
    }

    // Validation côté client
    if (updates?.data?.fristName && updates?.data.fristName.length < 3) {
      dispatch(updateProfileFailure("Le nom d'utilisateur doit contenir au moins 3 caractères"))
      return
    }

    if (updates?.data?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates?.data?.email)) {
      dispatch(updateProfileFailure('Email invalide'))
      return
    }

    dispatch(updateProfileStart())

    try {
      const updatedProfile = await extra.profileApi.updateProfile(auth.user.id, updates)
      dispatch(updateProfileSuccess(updatedProfile))
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(
          updateProfileFailure(error.response?.data?.message ?? 'Erreur lors de la mise à jour'),
        )
      } else {
        dispatch(updateProfileFailure(error instanceof Error ? error.message : 'Erreur inconnue'))
      }
    }
  }
}

// Thunk pour initialiser la double authentification (récupère QR code + clé secrète)
export const setup2FA = () => {
  return async (dispatch: AppDispatch, _getState: AppGetState, extra: Dependencies) => {
    dispatch(setup2FAStart())
    try {
      const data = await extra.profileApi.setup2FA()
      dispatch(setup2FASuccess(data))
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(
          setup2FAFailure(error.response?.data?.message ?? 'Erreur lors de la configuration 2FA'),
        )
      } else {
        dispatch(setup2FAFailure(error instanceof Error ? error.message : 'Erreur inconnue'))
      }
    }
  }
}

// Thunk pour vérifier et activer la double authentification
export const verify2FA = (token: string, secret: string) => {
  return async (dispatch: AppDispatch, _getState: AppGetState, extra: Dependencies) => {
    dispatch(verify2FAStart())
    try {
      const response = await extra.profileApi.verify2FA(token, secret)
      dispatch(verify2FASuccess(response.data.backupCodes))
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(verify2FAFailure(error.response?.data?.error?.message ?? 'Code invalide'))
      } else {
        dispatch(verify2FAFailure(error instanceof Error ? error.message : 'Erreur inconnue'))
      }
    }
  }
}
