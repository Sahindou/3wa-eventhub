// Export de la page
export { UserProfilePage } from './ui/pages/UserProfilePage'

// Export du store
export { userProfileReducer, type UserProfile, type UserProfilState } from './store/userSlice'

// Export des selectors
export { selectProfile, selectIsLoading, selectError, selectIsEditing } from './store/userSelectors'

// Export des thunks
export { syncProfileFromAuth, updateUserProfile } from './store/userThunks'
