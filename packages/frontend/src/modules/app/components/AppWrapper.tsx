import React, { useEffect } from 'react'
import { Provider, useDispatch } from 'react-redux'
import { app } from '../main'
import { restoreAuth } from '../../../features/authentification/store/authThunks'
import type { AppDispatch } from '../../store/store'

const AuthRestorer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(restoreAuth())
  }, [dispatch])

  return null
}

export const AppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Provider store={app.store}>
      <AuthRestorer />
      {children}
    </Provider>
  )
}
