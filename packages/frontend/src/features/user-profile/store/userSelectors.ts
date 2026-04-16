import type { AppState } from '../../../modules/store/store'

export const selectProfile = (state: AppState) => state.userProfile.profile
export const selectIsLoading = (state: AppState) => state.userProfile.isLoading
export const selectError = (state: AppState) => state.userProfile.error
export const selectIsEditing = (state: AppState) => state.userProfile.isEditing
export const selectUsername = (state: AppState) => state.userProfile.profile?.data.fristName
export const selectEmail = (state: AppState) => state.userProfile.profile?.data.email
export const select2FASetup = (state: AppState) => state.userProfile.twoFactorSetup
export const select2FALoading = (state: AppState) => state.userProfile.is2FALoading
export const select2FAError = (state: AppState) => state.userProfile.twoFAError
export const select2FAEnabled = (state: AppState) => state.userProfile.is2FAEnabled
export const selectRecoveryCodes = (state: AppState) => state.userProfile.recoveryCodes
