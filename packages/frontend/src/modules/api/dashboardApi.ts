import axios, { type AxiosInstance } from 'axios'

export interface DashboardStats {
  data: {
    totalEvents: number
    totalOrganizers: number
    upcomingEvents: number
    pastEvents: number
    eventsByMonth: Record<string, number>
    eventsByCategory: { category: string; count: number }[]
    nextEvents: {
      id: string
      title: string
      startDate: string
      capacity: number
      price: number
      categoryId: string
    }[]
  }
}

export interface PaginatedEventsResponse {
  data: {
    data: {
      id: string
      title: string
      startDate: string
      endDate: string
      capacity: number
      price: number
      categoryId: string
      organizerId: string
    }[]
    total: number
    page: number
    totalPages: number
  }
}

export class DashboardApi {
  private client: AxiosInstance

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    })
  }

  async getStats(): Promise<DashboardStats> {
    const response = await this.client.get<DashboardStats>('/stats')
    return response.data
  }

  async getEvents(page = 1, limit = 10): Promise<PaginatedEventsResponse> {
    const response = await this.client.get<PaginatedEventsResponse>(
      `/events?page=${page}&limit=${limit}`,
    )
    return response.data
  }
}
