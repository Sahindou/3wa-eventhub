import type { AnalyticsData, AnalyticsEvent } from './analytics.model'

export interface AnalyticsGateway {
  track(event: AnalyticsEvent): Promise<void>
  getAnalytics(): Promise<AnalyticsData>
}
