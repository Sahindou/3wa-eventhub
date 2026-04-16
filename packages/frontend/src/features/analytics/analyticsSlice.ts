import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AnalyticsData } from './analytics.model'
import { fetchAnalytics, sendAnalyticsEvent } from './send-analytics.action'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface AnalyticsState {
  data: AnalyticsData | null
  trackStatus: Status
  fetchStatus: Status
  error: string | null
}

const initialState: AnalyticsState = {
  data: null,
  trackStatus: 'idle',
  fetchStatus: 'idle',
  error: null,
}

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendAnalyticsEvent.pending, (state) => {
        state.trackStatus = 'loading'
      })
      .addCase(sendAnalyticsEvent.fulfilled, (state) => {
        state.trackStatus = 'success'
      })
      .addCase(sendAnalyticsEvent.rejected, (state, action) => {
        state.trackStatus = 'error'
        state.error = action.error.message ?? 'Erreur tracking'
      })

    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.fetchStatus = 'loading'
      })
      .addCase(fetchAnalytics.fulfilled, (state, action: PayloadAction<AnalyticsData>) => {
        state.fetchStatus = 'success'
        state.data = action.payload
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.fetchStatus = 'error'
        state.error = action.error.message ?? 'Erreur fetch analytics'
      })
  },
})

export const analyticsReducer = analyticsSlice.reducer
