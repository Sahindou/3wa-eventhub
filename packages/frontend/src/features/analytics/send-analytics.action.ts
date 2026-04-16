import { createAsyncThunk } from '@reduxjs/toolkit'
import type { AnalyticsEvent } from './analytics.model'
import type { Dependencies } from '../../modules/store/dependencies'

export const sendAnalyticsEvent = createAsyncThunk(
  'analytics/track',
  async (event: AnalyticsEvent, { extra }) => {
    const { analyticsGateway } = extra as Dependencies
    await analyticsGateway.track(event)
  },
)

export const fetchAnalytics = createAsyncThunk('analytics/fetch', async (_, { extra }) => {
  const { analyticsGateway } = extra as Dependencies
  return await analyticsGateway.getAnalytics()
})
