import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { DashboardStats } from '../../../modules/api/dashboardApi'

interface DashboardState {
  stats: DashboardStats['data'] | null
  isLoading: boolean
  error: string | null
}

const initialState: DashboardState = {
  stats: null,
  isLoading: false,
  error: null,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    fetchStatsStart(state) {
      state.isLoading = true
      state.error = null
    },
    fetchStatsSuccess(state, action: PayloadAction<DashboardStats['data']>) {
      state.isLoading = false
      state.stats = action.payload
    },
    fetchStatsFailure(state, action: PayloadAction<string>) {
      state.isLoading = false
      state.error = action.payload
    },
  },
})

export const { fetchStatsStart, fetchStatsSuccess, fetchStatsFailure } = dashboardSlice.actions
export const dashboardReducer = dashboardSlice.reducer
