import type { AuthApi } from '../api/authApi'
import type { ProfileApi } from '../api/profileApi'
import type { DashboardApi } from '../api/dashboardApi'
import type { AnalyticsGateway } from '../../features/analytics/analytics-gateway.interface'

export type Dependencies = {
  authApi: AuthApi
  profileApi: ProfileApi
  dashboardApi: DashboardApi
  analyticsGateway: AnalyticsGateway
}
