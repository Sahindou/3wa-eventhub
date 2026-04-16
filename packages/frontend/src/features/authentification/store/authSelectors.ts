import type { AppState } from '../../../modules/store/store'

export const selectUser = (state: AppState) => state.auth.user
export const selectIsAuthenticated = (state: AppState) => state.auth.isAuthenticated
export const selectIsLoading = (state: AppState) => state.auth.isLoading
export const selectIsInitializing = (state: AppState) => state.auth.isInitializing
export const selectError = (state: AppState) => state.auth.error
export const selectUsername = (state: AppState) => state.auth.user?.username
export const selectRequires2FAVerification = (state: AppState) => state.auth.requires2FAVerification
