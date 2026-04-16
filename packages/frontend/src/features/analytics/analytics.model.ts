export interface AnalyticsEvent {
  eventName: string
  userId: string | null
  page: string
}

export interface TopPage {
  page: string
  count: number
}

export interface AnalyticsData {
  topPages: TopPage[]
}
