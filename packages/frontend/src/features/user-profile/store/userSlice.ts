import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface UserProfile {
  data: {
    id: string
    email: string
    fristName: string
    last_name: string
    companyName?: string
    siret?: string
    description?: string
    phone: string
    role: string
    profileImage?: string
    isVerified: boolean
    is2FAEnabled?: boolean
  }
}

export interface TwoFactorSetup {
  data: {
    qrCode: {
      image: string
      username: string
      secret: string
    }
  }
}

export interface UserProfilState {
  profile: UserProfile | null
  isLoading: boolean
  error: string | null
  isEditing: boolean
  twoFactorSetup: TwoFactorSetup | null
  is2FALoading: boolean
  twoFAError: string | null
  is2FAEnabled: boolean
  recoveryCodes: string[] | null
}

const initialState: UserProfilState = {
  profile: null,
  isLoading: false,
  error: null,
  isEditing: false,
  twoFactorSetup: null,
  is2FALoading: false,
  twoFAError: null,
  is2FAEnabled: false,
  recoveryCodes: null,
}

const userSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    // récuperer les infos user profile
    fetchProfileStart: (state) => {
      state.isLoading = true
      state.error = null
    },

    fetchProfileSuccess: (state, action: PayloadAction<UserProfile>) => {
      state.isLoading = false
      state.profile = action.payload
      state.error = null
      if (action.payload.data.is2FAEnabled !== undefined) {
        state.is2FAEnabled = action.payload.data.is2FAEnabled
      }
    },

    fetchProfileFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // maj du profile
    updateProfileStart: (state) => {
      state.isLoading = true
      state.error = null
    },

    updateProfileSuccess: (state, action: PayloadAction<UserProfile>) => {
      state.isLoading = false
      state.profile = action.payload
      state.error = null
      state.isEditing = false
    },

    updateProfileFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    startEditing: (state) => {
      state.isEditing = true
      state.error = null
    },

    cancelEditing(state) {
      state.isEditing = false
      state.error = null
    },

    // Mise à jour locale
    updateProfileLocally(state, action: PayloadAction<Partial<UserProfile>>) {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload }
      }
    },

    clearError(state) {
      state.error = null
    },

    setup2FAStart(state) {
      state.is2FALoading = true
      state.twoFAError = null
      state.twoFactorSetup = null
    },

    setup2FASuccess(state, action: PayloadAction<TwoFactorSetup>) {
      state.is2FALoading = false
      state.twoFactorSetup = action.payload
    },

    setup2FAFailure(state, action: PayloadAction<string>) {
      state.is2FALoading = false
      state.twoFAError = action.payload
    },

    verify2FAStart(state) {
      state.is2FALoading = true
      state.twoFAError = null
    },

    verify2FASuccess(state, action: PayloadAction<string[]>) {
      state.is2FALoading = false
      state.is2FAEnabled = true
      state.twoFactorSetup = null
      state.recoveryCodes = action.payload
    },

    verify2FAFailure(state, action: PayloadAction<string>) {
      state.is2FALoading = false
      state.twoFAError = action.payload
    },

    clear2FASetup(state) {
      state.twoFactorSetup = null
      state.twoFAError = null
      state.recoveryCodes = null
    },
  },
})

export const {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  startEditing,
  cancelEditing,
  updateProfileLocally,
  clearError,
  setup2FAStart,
  setup2FASuccess,
  setup2FAFailure,
  verify2FAStart,
  verify2FASuccess,
  verify2FAFailure,
  clear2FASetup,
} = userSlice.actions

export const userProfileReducer = userSlice.reducer
