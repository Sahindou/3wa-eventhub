import axios, { type AxiosInstance } from 'axios'
import type { AnalyticsGateway } from './analytics-gateway.interface'
import type { AnalyticsData, AnalyticsEvent } from './analytics.model'

export class AnalyticsApi implements AnalyticsGateway {
  private client: AxiosInstance

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    })
  }

  async track(event: AnalyticsEvent): Promise<void> {
    await this.client.post('/analytics', event)
  }

  async getAnalytics(): Promise<AnalyticsData> {
    const response = await this.client.get<{ data: AnalyticsData }>('/analytics')
    return response.data.data
  }
}
