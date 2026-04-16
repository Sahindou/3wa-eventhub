import type { Dependencies } from '../store/dependencies'
import { createStore, type AppStore } from '../store/store'
import { AuthApi } from '../api/authApi'
import { ProfileApi } from '../api/profileApi'
import { DashboardApi } from '../api/dashboardApi'
import { AnalyticsApi } from '../../features/analytics/send-analytics.api'

export class App {
  public dependencies: Dependencies
  public store: AppStore

  constructor() {
    this.dependencies = this.setupDependencies()
    this.store = createStore({ dependencies: this.dependencies })
  }

  setupDependencies(): Dependencies {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string
    return {
      authApi: new AuthApi(apiBaseUrl),
      profileApi: new ProfileApi(apiBaseUrl),
      dashboardApi: new DashboardApi(apiBaseUrl),
      analyticsGateway: new AnalyticsApi(apiBaseUrl),
    }
  }
}

export const app = new App()
