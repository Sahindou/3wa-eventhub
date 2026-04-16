import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { Dependencies } from './dependencies'
import { useDispatch } from 'react-redux'
import { authReducer } from '../../features/authentification/store/authSlice'
import { userProfileReducer } from '../../features/user-profile/store/userSlice'
import { dashboardReducer } from '../../features/dashboard/store/dashboardSlice'
import { eventReducer } from '../../features/events/store/eventSlice'
import { analyticsReducer } from '../../features/analytics/analyticsSlice'

const reducers = combineReducers({
  auth: authReducer,
  userProfile: userProfileReducer,
  dashboard: dashboardReducer,
  events: eventReducer,
  analytics: analyticsReducer,
})

export type AppStore = ReturnType<typeof createStore>
export type AppState = ReturnType<typeof reducers>
export type AppDispatch = AppStore['dispatch']
export type AppGetState = AppStore['getState']

export const createStore = (config: { dependencies: Dependencies }) => {
  const store = configureStore({
    reducer: reducers,
    devTools: true,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: { extraArgument: config.dependencies } }),
  })

  return store
}

export const useAppDispatch = () => useDispatch<AppDispatch>()
