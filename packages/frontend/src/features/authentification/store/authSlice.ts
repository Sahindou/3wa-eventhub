import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface User {
  id: string
  username: string
  email: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitializing: boolean
  error: string | null
  requires2FAVerification: boolean
}

// Etat initial
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: true, // true tant que restoreAuth n'a pas terminé
  error: null,
  requires2FAVerification: false,
}

// slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // les actions synchrone
    registerStart: (state) => {
      state.isLoading = true
      state.error = null
    },

    registerSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false
      state.user = action.payload
      state.isAuthenticated = true
      state.error = null
    },

    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    loginStart: (state) => {
      state.isLoading = true
      state.error = null
    },

    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false
      state.user = action.payload
      state.isAuthenticated = true
      state.error = null
    },

    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Connexion réussie côté API mais en attente de vérification 2FA
    loginPending: (state, action: PayloadAction<User>) => {
      state.isLoading = false
      state.user = action.payload
      state.isAuthenticated = false
      state.error = null
    },

    // Déclenche l'étape de vérification 2FA
    require2FAVerification: (state) => {
      state.requires2FAVerification = true
    },

    // 2FA vérifiée avec succès — authentification complète
    loginComplete: (state) => {
      state.isAuthenticated = true
      state.requires2FAVerification = false
      state.isLoading = false
      state.error = null
    },

    // Erreur pendant la vérification 2FA
    twoFAVerifyFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    logout(state) {
      state.user = null
      state.isAuthenticated = false
      state.requires2FAVerification = false
      state.error = null
    },

    clearError: (state) => {
      state.error = null
    },

    // Signale que restoreAuth a terminé (token valide ou absent)
    authRestored: (state) => {
      state.isInitializing = false
    },
  },
})

export const {
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
  logout,
  clearError,
  authRestored,
} = authSlice.actions

export const authReducer = authSlice.reducer
